<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\OrderItem;
use App\Models\AddressBook;
use Jenssegers\Agent\Agent;
use Illuminate\Http\Request;
use App\Services\ActivityLogger;
use App\Services\CanadaPostService;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function storeOrUpdateCart(Request $request, ActivityLogger $activityLogger)
    {
        try {
            $userId = Auth::id();

            // Validate request data
            $validated = $request->validate([
                'cart_items' => 'required|array',
                'cart_items.*.product_id' => 'required|exists:products,id',
                'cart_items.*.quantity' => 'required|integer|min:1',
            ]);

            $cartItems = $validated['cart_items'];

            $vendorIds = [];

            foreach ($cartItems as $item) {
                $product = Product::with('shop')->find($item['product_id']);

                if (!$product) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Product not found: ' . $item['product_id'],
                    ], 404);
                }

                if ($product->shop && $product->shop->vendor_id) {
                    $vendorIds[] = $product->shop->vendor_id;
                }
            }


            $vendorIds = array_unique($vendorIds);

            // Find or create the "cart" order
            $order = Order::firstOrCreate(
                ['customer_id' => $userId, 'payment_status' => 'pending'],
                ['total' => 0, 'vendor_id' => $vendorIds, 'payment_method' => 'card']
            );

            foreach ($cartItems as $cartItem) {
                $product = Product::find($cartItem['product_id']);
                if ($product) {
                    $price = $product->sales_price ?? $product->regular_price;

                    // Check if the item already exists in the cart
                    $orderItem = OrderItem::where('order_id', $order->id)
                        ->where('product_id', $product->id)
                        ->first();

                    if ($orderItem) {
                        $orderItem->quantity += $cartItem['quantity'];
                        $orderItem->price = $price;
                        $orderItem->subtotal = $orderItem->quantity * $price;
                        $orderItem->save();

                        $updatedCart = $orderItem;
                    } else {
                        $updatedCart = OrderItem::create([
                            'user_id' => $userId,
                            'order_id' => $order->id,
                            'product_id' => $product->id,
                            'quantity' => $cartItem['quantity'],
                            'price' => $price,
                            'subtotal' => $price * $cartItem['quantity'],
                        ]);
                    }
                }
            }

            $agent = new Agent();
            $device = $agent->device();
            $platform = $agent->platform();
            $browser = $agent->browser();

            $deviceInfo = "$device on $platform using $browser";
            $activityLogger->log('Customer added cart successfully', Auth::user(), $deviceInfo);

            return response()->json([
                'status' => 'success',
                'message' => 'Cart added successfully',
                'data' => $updatedCart
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to added cart',
                'error_detail' => $th->getMessage()
            ], 500);
        }
    }


    public function index()
    {
        // Ensure the user is authenticated
        try {
            $userId = Auth::id();

            // Retrieve the cart items for the authenticated user
            $cartItems = OrderItem::where('user_id', $userId)->where('type', 'cart')->with('product')->get();

            // check if empty
            if ($cartItems->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Cart is empty'
                ], 404);
            }
            return response()->json([
                'status' => 'success',
                'message' => 'Cart retrieved successfully',
                'data' => $cartItems
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve cart items',
                'error_detail' => $th->getMessage()
            ], 500);
        }
    }
    public function destroy($id, ActivityLogger $activityLogger)
    {
        // Ensure the user is authenticated
        $userId = Auth::id();

        // Find the order item by ID and delete it
        $orderItem = OrderItem::where('user_id', $userId)->where('id', $id)->first();

        if ($orderItem) {
            $orderItem->delete();
            return response()->json([
                'status' => 'success',
                'message' => 'Cart item deleted successfully'
            ], 200);
        }

        $agent = new Agent();
        $device = $agent->device();
        $platform = $agent->platform();
        $browser = $agent->browser();

        $deviceInfo = "$device on $platform using $browser";
        $activityLogger->log('Customer deleted cart successfully', Auth::user(), $deviceInfo);

        return response()->json([
            'status' => 'error',
            'message' => 'Cart item not found'
        ], 404);
    }

    public function shippingRate(Request $request)
    {
        try {
            $request->validate([
                'customer_postal' => 'required|string',
                'vendors' => 'required|array|min:1',
                'vendors.*.postal_code' => 'required|string',
                'vendors.*.parcel.weight' => 'required|numeric',
                'vendors.*.parcel.length' => 'required|numeric',
                'vendors.*.parcel.width'  => 'required|numeric',
                'vendors.*.parcel.height' => 'required|numeric',
            ]);

            $destination = [
                'postal_code' => $request->customer_postal,
                'country' => 'CA'
            ];

            $combinedTotal = 0;
            $details = [];

            foreach ($request->vendors as $vendor) {
                $origin = [
                    'postal_code' => $vendor['postal_code'],
                    'country' => 'CA'
                ];

                $parcel = $vendor['parcel'];

                $rates = app(CanadaPostService::class)
                    ->getRates($origin, $destination, $parcel);

                $cheapest = collect($rates)->sortBy('price')->first();

                if ($cheapest) {
                    $combinedTotal += $cheapest['price'];
                    $details[] = [
                        'vendor_postal' => $vendor['postal_code'],
                        'cheapest_rate' => $cheapest
                    ];
                }
            }

            return response()->json([
                'success' => true,
                'total_shipping_cost' => $combinedTotal,
                'breakdown' => $details
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Canada Post rate fetch failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Unable to fetch shipping rates',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
