<?php

namespace App\Http\Controllers\Administration;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Order;
use App\Models\Review;
use App\Models\Product;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Models\Booking;

class DashboardController extends Controller
{
    /**
     * Get statistics for the dashboard
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getStats()
    {
        $startDateInput = request()->query('start_date');
        $startDate = null;
        $endDate = now();

        // Check if we should apply date filtering
        if ($startDateInput && $startDateInput !== 'all') {
            try {
                switch ($startDateInput) {
                    case 'this_week':
                        $startDate = now()->startOfWeek();
                        $endDate = now()->endOfWeek();
                        break;
                    case 'last_week':
                        $startDate = now()->subWeek()->startOfWeek();
                        $endDate = now()->subWeek()->endOfWeek();
                        break;
                    case 'last_month':
                        $startDate = now()->subMonth()->startOfMonth();
                        $endDate = now()->subMonth()->endOfMonth();
                        break;
                    case 'last_year':
                        $startDate = now()->subYear()->startOfYear();
                        $endDate = now()->subYear()->endOfYear();
                        break;
                    default:
                        $startDate = Carbon::parse($startDateInput);
                }
            } catch (\Exception $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid start_date parameter.',
                ], 400);
            }
        }

        // Base queries
        $queryCustomers = User::where('role', 'customer');
        $queryVendors = User::where('role', 'vendor');
        $queryProducts = Product::query();
        $queryOrders = Order::query();
        $queryRevenue = Order::query();

        // Apply date range if valid and not 'all'
        if ($startDate && $endDate) {
            foreach ([$queryCustomers, $queryVendors, $queryProducts, $queryOrders, $queryRevenue] as $query) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            }
        }

        // Compile stats
        $data = [
            'total_customers' => $queryCustomers->count(),
            'total_vendors' => $queryVendors->count(),
            'total_products' => $queryProducts->count(),
            'total_orders' => $queryOrders->count(),
            'total_revenue' => $queryRevenue->sum('total'),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $data,
        ], 200);
    }

    /**
     * Get sales graph data for a specific month
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSalesGraphData()
    {
        $startDateInput = request()->query('start_date', 'January');
        $startDate = null;
        $endDate = null;

        // Determine the start and end dates for the specified month
        if ($startDateInput) {
            try {
                // Parse the month name into a Carbon date
                $parsedDate = Carbon::createFromFormat('F Y', "{$startDateInput} " . now()->year);
                $startDate = $parsedDate->startOfMonth()->startOfDay(); // First day of the month at 00:00:00
                $endDate = $parsedDate->now();
            } catch (\Exception $e) {
                // Handle invalid month input
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid month provided. Please use a valid month name.',
                ], 400);
            }
        }


        // Build the query
        $queryOrders = Order::query();

        // Apply date range filter if valid
        if ($startDate && $endDate) {
            $queryOrders->whereBetween('created_at', [$startDate, $endDate]);
        }

        // Fetch sales data grouped by day
        $salesData = $queryOrders->selectRaw('DATE(created_at) as day, SUM(total) as total')
            ->groupBy('day')
            ->orderBy('day', 'asc')
            ->get();

        // Return response
        return response()->json([
            'status' => 'success',
            'data' => $salesData,
        ], 200);
    }

    public function listReviews()
    {
        $limit = request()->integer('limit', 10);
        $offset = request()->integer('offset', 0);

        $query = Review::with('user', 'product')->orderByDesc('rating');

        $total = $query->count();

        $reviews = $query->skip($offset)->take($limit)->get();

        return response()->json([
            'status' => 'success',
            'data' => $reviews,
            'total' => $total,
            'offset' => $offset,
            'limit' => $limit,
        ]);
    }

    public function listUnreviewedOrders()
    {
        $limit = request()->integer('limit', 10);
        $offset = request()->integer('offset', 0);

        $query = Order::with('customer', 'items')
            ->where('shipping_status', 'delivered')
            ->where('payment_status', 'completed')
            ->whereDoesntHave('reviews')
            ->latest();

        $total = $query->count();

        $orders = $query->skip($offset)->take($limit)->get();

        return response()->json([
            'status' => 'success',
            'data' => $orders,
            'total' => $total,
            'offset' => $offset,
            'limit' => $limit,
        ]);
    }


    public function reviewsStats()
    {
        // count all star rating and group by rating
        $reviews = Review::selectRaw('rating, count(*) as count')->groupBy('rating')->get();

        return response()->json([
            'status' => 'success',
            'data' => $reviews,
        ]);
    }

    #get the recent 10 products
    public function getItemProducts()
    {
        $limit = request()->query('limit', 10);
        $offset = request()->query('offset', 0);
        $type = request()->query('type', 'services');
        $status = request()->query('status', 'active');

        if (!in_array($type, ['services', 'products']) || !in_array($status, ['active', 'inactive'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid type or status provided.',
            ], 400);
        }


        $query = Product::with(['category:id,name', 'vendor:id,name'])
            ->where('type', $type)->where('status', $status)
            ->latest();

        $search = trim(request()->query('search', ''));

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('category', function ($categoryQuery) use ($search) {
                        $categoryQuery->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('vendor', function ($vendorQuery) use ($search) {
                        $vendorQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }


        // Pagination
        $total = $query->count();
        $products = $query->skip($offset)->take($limit)->get();

        // Get product stats
        $stats = Product::selectRaw('
        COUNT(*) as total_products,
        COUNT(CASE WHEN status = "active" THEN 1 END) as total_active,
        COUNT(CASE WHEN status = "inactive" THEN 1 END) as total_inactive,
        COUNT(CASE WHEN type = "services" THEN 1 END) as total_service,
        COUNT(CASE WHEN type = "products" THEN 1 END) as total_physical
    ')->first();

        return response()->json([
            'status' => 'success',
            'data' => $products,
            'total' => $total,
            'limit' => $limit,
            'offset' => $offset,
            'stats' => [
                'total_items' => $stats->total_products,
                'total_active' => $stats->total_active,
                'total_inactive' => $stats->total_inactive,
                'total_service' => $stats->total_service,
                'total_product' => $stats->total_physical,
            ],
        ]);
    }


    public function getItemGraphData()
    {
        $type = request()->query('type', 'services');
        $status = request()->query('status', 'active');
        $startDateInput = request()->query('start_date');
        $startDate = null;
        $endDate = null;

        if (!$type) {
            return response()->json([
                'status' => 'error',
                'message' => 'Missing required query parameter: role.',
            ], 400);
        }

        try {
            // Use provided month or default to current month
            $parsedDate = $startDateInput
                ? Carbon::createFromFormat('F Y', "{$startDateInput} " . now()->year)
                : now();

            $startDate = $parsedDate->copy()->startOfMonth()->startOfDay();
            $endDate = $parsedDate->now();
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid month format. Use full month name like "June", "October".',
            ], 400);
        }

        $userData = Product::where('type', $type)->where('status', $status)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as day, COUNT(*) as total')
            ->groupBy('day')
            ->orderBy('day', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $userData,
        ]);
    }
    public function getRecentOrders()
    {
        try {
            $limit = request()->query('limit', 10);
            $offset = request()->query('offset', 0);
            $search = request()->query('search', '');
            $shipping_status = request()->query('status');

            $query = OrderItem::with([
                'user:id,name,profile_photo',
                'product:id,title,images',
                'order:id,shipping_status,payment_status'
            ])->latest();

            // Apply shipping_status filter if provided
            if ($shipping_status) {
                $query->whereHas('order', function ($q) use ($shipping_status) {
                    $q->where('shipping_status', $shipping_status);
                });
            }

            // Apply search filter
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('order_id', 'like', "%{$search}%")
                        ->orWhere('product_id', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($userQuery) use ($search) {
                            $userQuery->where('name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('product', function ($productQuery) use ($search) {
                            $productQuery->where('title', 'like', "%{$search}%");
                        });
                });
            }

            $total = $query->count();

            $orderItems = $query->skip($offset)->take($limit)->get();

            $orders = $orderItems->map(function ($item) {
                return [
                    'id' => $item->id,
                    'user' => [
                        'name' => $item->user->name ?? null,
                        'photo' => $item->user->profile_photo ?? null,
                    ],
                    'product' => [
                        'title' => $item->product->title ?? null,
                        'image' => is_array($item->product->images) ? ($item->product->images[0] ?? null) : $item->product->images,
                    ],
                    'subtotal' => $item->subtotal,
                    'quantity' => $item->quantity,
                    'shipping_status' => optional($item->order)->shipping_status,
                    'payment_status' => optional($item->order)->payment_status,
                    'created_at' => $item->created_at->toDateTimeString(),
                ];
            });

            return response()->json([
                'orders' => $orders,
                'total' => $total,
                'limit' => (int)$limit,
                'offset' => (int)$offset,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    public function getRecentBookings()
    {
        try {
            $limit = request()->query('limit', 10);
            $offset = request()->query('offset', 0);
            $search = request()->query('search', '');
            $delivery_status = request()->query('status');

            $query = Booking::with([
                'customer:id,name,profile_photo',
                'service:id,title,images',
            ])->latest();

            // Apply delivery_status filter if provided
            if ($delivery_status) {
                $query->where('delivery_status', $delivery_status);
            }

            // Apply search filter
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->orWhereHas('customer', function ($customerQuery) use ($search) {
                        $customerQuery->where('name', 'like', "%{$search}%");
                    })
                        ->orWhereHas('service', function ($serviceQuery) use ($search) {
                            $serviceQuery->where('title', 'like', "%{$search}%");
                        });
                });
            }

            $total = $query->count();

            $bookings = $query->skip($offset)->take($limit)->get();

            $orders = $bookings->map(function ($item) {
                return [
                    'id' => $item->id,
                    'customer' => [
                        'name' => $item->customer->name ?? null,
                        'photo' => $item->customer->profile_photo ?? null,
                    ],
                    'service' => [
                        'title' => $item->service->title ?? null,
                        'image' => is_array($item->service->images)
                            ? ($item->service->images[0] ?? null)
                            : $item->service->images,
                    ],
                    'total' => $item->total,
                    'delivery_status' => $item->delivery_status,
                    'payment_status' => $item->payment_status,
                    'created_at' => $item->created_at->toDateTimeString(),
                ];
            });

            return response()->json([
                'bookings' => $orders,
                'total' => $total,
                'limit' => (int)$limit,
                'offset' => (int)$offset,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage(),
            ], 500);
        }
    }



    public function orderStats()
    {
        $statuses = ['processing', 'ongoing', 'delivered', 'cancelled', 'returned'];

        $results = DB::table('orders')
            ->select('shipping_status', DB::raw('COUNT(*) as total'))
            ->whereIn('shipping_status', $statuses)
            ->groupBy('shipping_status')
            ->pluck('total', 'shipping_status');

        return collect($statuses)->mapWithKeys(function ($status) use ($results) {
            return ["total_{$status}" => $results[$status] ?? 0];
        })->toArray();
    }
    public function bookingStats()
    {
        $statuses = ['processing', 'ongoing', 'delivered', 'cancelled', 'returned'];

        $results = DB::table('bookings')
            ->select('delivery_status', DB::raw('COUNT(*) as total'))
            ->whereIn('delivery_status', $statuses)
            ->groupBy('delivery_status')
            ->pluck('total', 'delivery_status');

        return collect($statuses)->mapWithKeys(function ($status) use ($results) {
            return ["total_{$status}" => $results[$status] ?? 0];
        })->toArray();
    }
    public function orderGraph(Request $request)
    {
        $monthName = $request->query('start_date', now()->format('F'));
        $year = now()->year;
        try {
            $startDate = Carbon::createFromFormat('F Y', $monthName . ' ' . $year)->startOfMonth();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid month name'], 400);
        }

        $endDate = $endDate = now()->endOfDay();

        return DB::table('orders')
            ->selectRaw('DATE(created_at) as day, COUNT(*) as total')
            ->whereBetween(DB::raw('DATE(created_at)'), [$startDate->toDateString(), $endDate->toDateString()])
            ->groupBy('day')
            ->orderBy('day')
            ->get()
            ->toArray();
    }
    public function bookingGraph(Request $request)
    {
        $monthName = $request->query('start_date', now()->format('F'));
        $year = now()->year;
        try {
            $startDate = Carbon::createFromFormat('F Y', $monthName . ' ' . $year)->startOfMonth();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid month name'], 400);
        }

        $endDate = $endDate = now()->endOfDay();

        return DB::table('bookings')
            ->selectRaw('DATE(created_at) as day, COUNT(*) as total')
            ->whereBetween(DB::raw('DATE(created_at)'), [$startDate->toDateString(), $endDate->toDateString()])
            ->groupBy('day')
            ->orderBy('day')
            ->get()
            ->toArray();
    }

    public function getUserOrders($id)
    {
        try {
            $type = request()->query('type', 'customer');
            $offset = (int) request()->query('offset', 0);
            $limit = (int) request()->query('limit', 10);
            $search = request()->query('search');

            $user = User::where('role', $type)->find($id);

            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            // Base query
            $cartItemsQuery = OrderItem::with(['order', 'product'])
                ->whereHas('order', function ($q) use ($user, $type) {
                    if ($type === 'vendor') {
                        $q->whereJsonContains('vendor_id', $user->id);
                    } else {
                        $q->where('user_id', $user->id);
                    }
                });

            // Apply search if provided
            if ($search) {
                $cartItemsQuery->whereHas('product', function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")->orWhere('order_id', 'like', "%{$search}%");
                });
            }

            // Clone query to count total
            $total = (clone $cartItemsQuery)->count();

            // Get paginated results
            $cartItems = $cartItemsQuery
                ->orderBy('created_at', 'desc')
                ->offset($offset)
                ->limit($limit)
                ->get();

            return response()->json([
                'status' => 'success',
                'offset' => $offset,
                'limit' => $limit,
                'total' => $total,
                'data' => $cartItems
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'An error occurred while fetching cart items',
                'error' => $th->getMessage()
            ], 500);
        }
    }
    #order details
    public function getOrderDetails($id)
    {
        try {
            // Eager load product.shop
            $orderItem = OrderItem::with(['order.customer', 'order.address',  'product.shop'])
                ->where('order_id', $id)->orWhere('id', $id)
                ->first();

            if (!$orderItem || !$orderItem->order || !$orderItem->order->customer) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Order or customer not found.',
                ], 404);
            }
            $customerId = $orderItem->order->customer->id;
            // Compute customer order stats
            $totalOrders = Order::where('customer_id', $customerId)->count();
            $totalCompleted = Order::where('customer_id', $customerId)
                ->where('shipping_status', 'completed')
                ->count();
            $totalCancelled = Order::where('customer_id', $customerId)
                ->where('shipping_status', 'cancelled')
                ->count();
            $totalRevenue = Order::where('customer_id', $customerId)
                ->sum('total');

            return response()->json([
                'status' => 'success',
                'data' => [
                    'order_item' => $orderItem,
                    'stats' => [
                        'total_orders' => $totalOrders,
                        'total_completed' => $totalCompleted,
                        'total_cancelled' => $totalCancelled,
                        'total_revenue' => $totalRevenue,
                    ],
                ],
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage(),
            ], 500);
        }
    }
    public function getBookingDetails($id)
    {
        try {
            // Load booking with relationships
            $booking = Booking::with(['service', 'customer', 'vendor', 'address'])
                ->where('id', $id)
                ->first();

            if (!$booking || !$booking->customer) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Booking or customer not found.',
                ], 404);
            }

            $customerId = $booking->customer->id;

            // Compute customer booking stats
            $totalBookings = Booking::where('customer_id', $customerId)->count();

            $totalCompleted = Booking::where('customer_id', $customerId)
                ->where('delivery_status', 'delivered')
                ->count();

            $totalCancelled = Booking::where('customer_id', $customerId)
                ->where('delivery_status', 'cancelled')
                ->count();

            $totalRevenue = Booking::where('customer_id', $customerId)->sum('total');

            return response()->json([
                'status' => 'success',
                'data'   => [
                    'booking' => $booking,
                    'stats'   => [
                        'total_bookings'  => $totalBookings,
                        'total_completed' => $totalCompleted,
                        'total_cancelled' => $totalCancelled,
                        'total_revenue'   => $totalRevenue,
                    ],
                ],
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Booking details error: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json([
                'status'  => 'error',
                'message' => 'Server error. Please try again later.',
            ], 500);
        }
    }

    public function changeOrderStatus($id)
    {
        try {
            $order = Order::findOrFail($id);
            $status = request()->input('status');

            if (!in_array($status, ['ongoing', 'processing', 'delivered', 'returned', 'cancelled'])) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid status provided.',
                ], 400);
            }

            $order->shipping_status = $status;
            $order->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Order status updated successfully.',
                'data' => $order,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage(),
            ], 500);
        }
    }
    public function updatedOrderPaymentStatus(Request $request, $orderId)
    {
        $order = Order::findOrFail($orderId);
        $order->update(['payment_status' => $request->payment_status]);
        return response()->json(['status' => 'success', 'message' => 'Order payment status updated successfully', 'data' => $order], 200);
    }

    public function getSellingProducts()
    {
        $limit = (int) request()->query('limit', 10);
        $offset = (int) request()->query('offset', 0);

        // Get top-selling product IDs with total quantity sold
        $topSelling = DB::table('order_items')
            ->select('product_id', DB::raw('SUM(quantity) as total_sold'))
            ->groupBy('product_id')
            ->having('total_sold', '>', 5)
            ->orderByDesc('total_sold')
            ->skip($offset)
            ->take($limit)
            ->get();

        // Extract IDs
        $productIds = $topSelling->pluck('product_id');

        // Fetch product details
        $products = Product::with(['category:id,name', 'vendor:id,name'])
            ->whereIn('id', $productIds)
            ->get()
            ->map(function ($product) use ($topSelling) {
                $product->total_sold = $topSelling->firstWhere('product_id', $product->id)?->total_sold ?? 0;
                return $product;
            });

        return response()->json([
            'status' => 'success',
            'data' => $products,
            'limit' => $limit,
            'offset' => $offset,
        ]);
    }
    public function getSellingProductsGraphData()
    {
        $startDateInput = request()->query('start_date'); // e.g. "March"
        $startDate = null;
        $endDate = null;

        if ($startDateInput) {
            try {
                $parsedDate = Carbon::createFromFormat('F Y', "{$startDateInput} " . now()->year);
                $startDate = $parsedDate->startOfMonth()->startOfDay();
                $endDate = $parsedDate->now();
            } catch (\Exception $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid month provided. Use full month name like "March", "October", etc.',
                ], 400);
            }
        } else {
            // Default to current month
            $startDate = now()->startOfMonth()->startOfDay();
            $endDate = now()->endOfMonth()->endOfDay();
        }

        $data = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->selectRaw('DATE(orders.created_at) as day, SUM(order_items.quantity) as total')
            ->groupBy('day')
            ->orderBy('day', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $data,
        ]);
    }

    public function updateProductStatus($id, $status)
    {
        try {
            $product = Product::findOrFail($id);

            if (!in_array($status, ['active', 'inactive'])) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid status provided.',
                ], 400);
            }

            $product->status = $status;
            $product->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Product status updated successfully.',
                'data' => $product,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => $th->getMessage(),
            ], 500);
        }
    }
}
