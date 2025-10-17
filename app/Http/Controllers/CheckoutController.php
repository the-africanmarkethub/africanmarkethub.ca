<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Jenssegers\Agent\Agent;
use Illuminate\Http\Request;
use App\Services\ActivityLogger;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\CheckoutConfirmationMail;
use App\Services\Clik2PayService;

class CheckoutController extends Controller
{
    public function checkout(Request $request, ActivityLogger $activityLogger, Clik2PayService $clik2PayService)
    {
        try {
            $userId = Auth::id();
            // Step 1: Validate order item IDs
            $validated = $request->validate([
                'order_item_id'   => 'required|array',
                'order_item_id.*' => [
                    'integer',
                    function ($attribute, $value, $fail) {
                        if (! OrderItem::where('id', $value)->exists()) {
                            $fail("The selected {$attribute} is invalid.");
                        }
                    }
                ],
                'address_id'     => 'required|exists:address_books,id',
                // 'payment_method' => 'required|string'
            ]);

            // Step 2: Get the parent order IDs from the order items
            $orderIds = OrderItem::whereIn('id', $validated['order_item_id'])
                ->pluck('order_id')
                ->unique();

            // Step 3: Load orders with relationships
            $orders = Order::with(['items.product.shop.vendor', 'customer'])
                ->whereIn('id', $orderIds)
                ->where('customer_id', $userId)
                ->where('payment_status', 'pending')
                ->get();

            if ($orders->isEmpty()) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'No valid or unprocessed orders found.'
                ], 404);
            }

            $responseOrders = [];

            foreach ($orders as $order) {
                $orderItems = $order->items;

                if ($orderItems->isEmpty()) {
                    continue;
                }

                $total = $orderItems->sum('subtotal');

                $order->update([
                    'address_id'      => $validated['address_id'],
                    'payment_method'  => 'card',
                    'total'           => $total,
                    'payment_status'  => 'pending',
                    'shipping_status' => 'processing'
                ]);

                $responseOrders[] = $order;

                // Email to customer
                Mail::to($order->customer->email)
                    ->send(new CheckoutConfirmationMail($order, 'customer'));

                // Email to vendors for each product
                foreach ($orderItems as $item) {
                    $vendorEmail = optional($item->product->shop->vendor)->email;
                    if ($vendorEmail) {
                        Mail::to($vendorEmail)
                            ->send(new CheckoutConfirmationMail($order, 'vendor'));
                    }
                }
            }

            if (empty($responseOrders)) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'All selected orders have no items.'
                ], 400);
            }

            // Log activity
            $agent = new Agent();
            $deviceInfo = $agent->device() . ' on ' . $agent->platform() . ' using ' . $agent->browser();
            $activityLogger->log('Customer checked out orders successfully', Auth::user(), $deviceInfo);

            // Update from cart to checkout from OrderItem table
            OrderItem::whereIn('id', $validated['order_item_id'])
                ->where('type', 'cart')
                ->update([
                    'type' => 'checkout',
                ]);

            $payload = [
                "merchantTransactionId" => "ORD-{$order->id}-" . uniqid(),
                "amount"                => (float) $order->total,
                "type"                  => "ECOMM",
                "dueDate"               => now()->addDays(3)->toDateString(),
                "currency"              => "CAD",
                "description"           => "Payment for Order #{$order->id}",

                "displayMessage"        => "Complete your payment for Order {$order->id}",

                "invoiceNumber"         => "INV-{$order->id}",
                "businessUnit"          => "OnlineStore",

                "callbackUrl"           => route('clik2pay.callback'),
                "successUrl"            => route('checkout.success', $order->id),
                "cancelUrl"             => route('checkout.cancel', $order->id),

                "payer" => [
                    "name" => $order->customer->first_name . '' . $order->customer->last_name,
                    "email"     => $order->customer->email,
                    "mobileNumber"     => '4165551234',
                    // "mobileNumber"     => $order->customer->phone,
                ],

                "merchant" => [
                    "name"  => config('app.name'),
                    "email" => config('mail.from.address'),
                ],
            ];


            $paymentResponse = $clik2PayService->createPaymentRequest($payload);

            return response()->json([
                'status'  => 'success',
                'message' => 'Orders checked out successfully.',
                // 'orders'  => $responseOrders,
                'payment' => $paymentResponse,

            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Validation error.',
                'errors'  => $e->errors()
            ], 422);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json([
                'status'       => 'error',
                'message'      => 'Checkout failed.',
                'error_detail' => $th->getMessage()
            ], 500);
        }
    }

    public function success($orderId)
    {
        // Redirect customer to your frontend success page
        return redirect()->away(config('app.frontend_url') . "/payment/success?order={$orderId}");
    }

    public function cancel($orderId)
    {
        // Redirect customer to your frontend cancel page
        return redirect()->away(config('app.frontend_url') . "/payment/cancel?order={$orderId}");
    }
}
