<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use App\Models\OrderItem;
use App\Models\Transaction;
use Illuminate\Support\Str;
use Jenssegers\Agent\Agent;
use Illuminate\Http\Request;
use App\Mail\ShippingUpdateMail;
use App\Models\ProductVariation;
use App\Services\ActivityLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Contracts\Pagination\Paginator;

class OrderController extends Controller
{
    public function index(): JsonResponse
    {
        $user = Auth::user();
        $orders = match ($user->role) {
            'vendor' => $this->getVendorOrders($user),
            'customer' => $this->getCustomerOrders($user),
            default => [],
        };

        if (collect($orders)->isEmpty()) {
            return response()->json(['status' => 'success', 'message' => 'No orders found', 'data' => []], 404);
        }

        return response()->json(['status' => 'success', 'message' => 'Orders found', 'data' => $orders], 200);
    }

    private function getVendorOrders(User $user): Paginator
    {
        return Order::whereHas('orderItems.product.shop', function (Builder $query) use ($user) {
            $query->where('vendor_id', $user->id);
        })
            ->with(['orderItems.product', 'address', 'customer'])
            ->latest()
            ->paginate(10);
    }

    private function getCustomerOrders(User $user): Paginator
    {
        return Order::where('customer_id', $user->id)
            ->with('orderItems.product')
            ->latest()
            ->paginate(10);
    }


    public function create(Request $request, ActivityLogger $activityLogger): JsonResponse
    {
        $validated = $request->validate([
            'products' => 'required|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.product_variation_id' => [
                'required',
                'exists:product_variations,id',
                function ($attribute, $value, $fail) use ($request) {
                    $index = explode('.', $attribute)[1]; // Get the array index
                    $productId = $request->products[$index]['product_id'] ?? null;

                    if ($productId) {
                        $exists = ProductVariation::where('id', $value)
                            ->where('product_id', $productId)
                            ->exists();

                        if (!$exists) {
                            $fail("The selected product_variation_id ($value) does not belong to the given product_id ($productId).");
                        }
                    }
                },
            ],
            'products.*.quantity' => 'required|integer|min:1',
            'address_id' => 'required|exists:address_books,id',
        ]);

        $user = Auth::user();

        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'User not authenticated'], 401);
        }

        DB::beginTransaction();

        try {
            $total = 0;
            $orderItems = [];

            foreach ($validated['products'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                $variation = ProductVariation::findOrFail($item['product_variation_id']); // Ensuring it exists

                $subtotal = $variation->price * $item['quantity']; // Use variation price
                $total += $subtotal;

                $orderItems[] = [
                    'product_id' => $product->id,
                    'product_variation_id' => $variation->id,
                    'quantity' => $item['quantity'],
                    'price' => $variation->price,
                    'subtotal' => $subtotal,
                ];
            }

            $reference = Str::upper(Str::slug("AFRMARHUB|" . $user->id . "|" . now()->format('YmdHis')));

            // Create the Order
            $order = Order::create([
                'customer_id' => $user->id,
                'vendor_id' => $product->shop->vendor_id,
                'total' => $total,
                'payment_method' => 'pending',
                'shipping_status' => 'ongoing',
                'shipping_method' => 'standard',
                'shipping_fee' => '0.00',
                'payment_date' => now(),
                'payment_reference' => $reference,
                'payment_status' => 'pending',
                'address_id' => $validated['address_id'],
            ]);

            // Attach Order Items
            foreach ($orderItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'user_id' => $user->id,
                    'product_id' => $item['product_id'],
                    'product_variation_id' => $item['product_variation_id'], // Ensure we store the variation
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'subtotal' => $item['subtotal'],
                ]);
            }

            // Create a transaction
            Transaction::create([
                'reference' => $reference,
                'receiver_id' => $product->shop->vendor_id, //vendor
                'sender_id' => $user->id, //customer
                'amount' => $total,
                'status' => 'pending',
                'type' => 'product',
                'description' => "Products purchased with total amount USD{$total} and shipping fee of USD{$order->shipping_fee}.",
                'transaction_data' => $order,
            ]);

            $agent = new Agent();
            $device = $agent->device();
            $platform = $agent->platform();
            $browser = $agent->browser();

            $deviceInfo = "$device on $platform using $browser";
            $activityLogger->log('Customer created order successfully', Auth::user(), $deviceInfo);

            DB::commit();

            return response()->json(['status' => 'success', 'message' => 'Order created successfully', 'data' => $order], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Order creation failed', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $orderId, ActivityLogger $activityLogger): JsonResponse
    {
        $user = Auth::user();

        if ($user->role !== 'vendor') {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'shipping_status' => 'required|string',
            'shipping_method' => 'nullable|string',
            'tracking_number' => 'nullable|string',
            'tracking_url' => 'nullable|string',
            'shipping_date' => 'nullable|string',
            'delivery_date' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            $order = Order::findOrFail($orderId);

            // Check if the order belongs to a product sold by the vendor
            if ($order->product->shop->vendor_id !== $user->id) {
                return response()->json(['status' => 'error', 'message' => 'Unauthorized vendor'], 403);
            }

            $order->update([
                'shipping_status' => $validated['shipping_status'],
                'shipping_method' => $validated['shipping_method'] ?? '',
                'tracking_number' => $validated['tracking_number'] ?? '',
                'tracking_url' => $validated['tracking_url'] ?? '',
                'shipping_date' => $validated['shipping_date'] ?? '',
                'delivery_date' => $validated['delivery_date'] ?? '',
            ]);

            $agent = new Agent();
            $device = $agent->device();
            $platform = $agent->platform();
            $browser = $agent->browser();

            $deviceInfo = "$device on $platform using $browser";
            $activityLogger->log('Vendor updated order successfully', Auth::user(), $deviceInfo);

            DB::commit();
            // Send email after commit
            Mail::to($order->customer->email)->send(new ShippingUpdateMail($order));

            return response()->json(['status' => 'success', 'message' => 'Order updated and email sent successfully', 'data' => $order], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Order update failed', 'error' => $e->getMessage()], 500);
        }
    }


    public function cancelOrder(Request $request, ActivityLogger $activityLogger): JsonResponse
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'cancel_reason' => 'required|string|min:0',
        ]);
        $userId = Auth::id();
        $orderId = $validated['order_id'];
        $cancelReason = $validated['cancel_reason'];
        $order = Order::findOrFail($orderId);

        // check if it the same user who ordered it
        if ($order->user_id !== $userId) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized user'], 403);
        }

        //check if the order status is not completed
        if ($order->shipping_status === 'delivered') {
            return response()->json(['status' => 'error', 'message' => 'Order has been delivered'], 400);
        }

        $order->update(['status' => 'cancelled', 'cancel_reason' => $cancelReason]);

        $agent = new Agent();
        $device = $agent->device();
        $platform = $agent->platform();
        $browser = $agent->browser();

        $deviceInfo = "$device on $platform using $browser";
        $activityLogger->log('Vendor cancelled order successfully', Auth::user(), $deviceInfo);
        return response()->json(['status' => 'success', 'message' => 'Order cancelled successfully'], 200);
    }

    public function orderDetail($id)
    {
        $user = Auth::user();

        $cart = match ($user->role) {
            'vendor' => Order::where('id', $id)
                ->whereHas('orderItems.product.shop', function ($query) use ($user) {
                    $query->where('vendor_id', $user->id);
                })
                ->with(['orderItems.product', 'address', 'customer'])
                ->first(),

            'customer' => Order::where('customer_id', $user->id)
                ->where('id', $id)
                ->with(['orderItems.product', 'address', 'customer'])
                ->first(),

            default => null,
        };

        if (!$cart) {
            return response()->json([
                'status' => 'error',
                'message' => 'Order not found or access denied.',
                'data' => null
            ], 404);
        }

        // Stats for both roles
        $stats = match ($user->role) {
            'customer' => [
                'total_orders' => Order::where('customer_id', $user->id)->count(),
                'total_amount_spent' => Order::where('customer_id', $user->id)->sum('total'),
                'total_cancelled' => Order::where('customer_id', $user->id)->where('shipping_status', 'cancelled')->count(),
                'total_delivered' => Order::where('customer_id', $user->id)->where('shipping_status', 'delivered')->count(),
            ],
            'vendor' => [
                'total_orders' => Order::whereHas('orderItems.product.shop', function ($query) use ($user) {
                    $query->where('vendor_id', $user->id);
                })->count(),
                'total_amount' => Order::whereHas('orderItems.product.shop', function ($query) use ($user) {
                    $query->where('vendor_id', $user->id);
                })->sum('total'),
                'total_cancelled' => Order::whereHas('orderItems.product.shop', function ($query) use ($user) {
                    $query->where('vendor_id', $user->id);
                })->where('shipping_status', 'cancelled')->count(),
                'total_delivered' => Order::whereHas('orderItems.product.shop', function ($query) use ($user) {
                    $query->where('vendor_id', $user->id);
                })->where('shipping_status', 'delivered')->count(),
            ],
            default => [],
        };

        return response()->json([
            'status' => 'success',
            'message' => 'Order details retrieved successfully',
            'data' => array_merge(['order' => $cart], $stats),
        ], 200);
    }
}
