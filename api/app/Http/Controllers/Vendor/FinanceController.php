<?php

namespace App\Http\Controllers\Vendor;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Order;
use App\Models\Wallet;
use App\Models\Product;
use App\Models\OrderItem;
use App\Models\Transaction;
use Jenssegers\Agent\Agent;
use Illuminate\Http\Request;
use App\Services\ActivityLogger;
use App\Models\SettlementAccount;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;


class FinanceController extends Controller
{
    /**
     * Get Earnings Overview
     */
    public function getEarningsOverview()
    {
        $vendorId = Auth::id();

        // Get total unpaid earnings (eligible for withdrawal)
        $totalUnpaidEarnings = Order::whereJsonContains('vendor_id', $vendorId)
            ->where('payment_status', 'completed')
            ->where('shipping_status', 'delivered')
            ->where('vendor_payment_settlement_status', 'unpaid')
            ->sum('total');

        // Get total earnings from all completed & shipped orders (regardless of settlement)
        $totalEarnings = Order::whereJsonContains('vendor_id', $vendorId)
            ->where('payment_status', 'completed')
            ->where('shipping_status', 'delivered')
            ->sum('total');

        // Get pending payments (orders not completed or being processed)
        $pendingPayments = Order::whereJsonContains('vendor_id', $vendorId)
            ->where('payment_status', 'pending')
            ->whereIn('shipping_status', ['processing', 'ongoing'])
            ->sum('total');

        // Update or create wallet record
        $wallet = Wallet::updateOrCreate(
            ['user_id' => $vendorId],
            [
                'total_earning' => $totalEarnings,
                'available_to_withdraw' => $totalUnpaidEarnings,
                'pending' => $pendingPayments
            ]
        );

        return response()->json([
            'status' => 'success',
            'data' => $wallet
        ]);
    }



    public function getSalesAnalytics()
    {
        $vendorId = Auth::id();

        $now = Carbon::now();
        $thisWeekStart = $now->copy()->subDays(7);
        $lastWeekStart = $now->copy()->subDays(14);
        $lastWeekEnd = $thisWeekStart;

        // === SALES VOLUME ===
        $thisWeekSales = Order::whereJsonContains('vendor_id', $vendorId)
            ->where('payment_status', 'completed')
            ->whereBetween('updated_at', [$thisWeekStart, $now])
            ->count();

        $lastWeekSales = Order::whereJsonContains('vendor_id', $vendorId)
            ->where('payment_status', 'completed')
            ->whereBetween('updated_at', [$lastWeekStart, $lastWeekEnd])
            ->count();

        $salesGrowth = $lastWeekSales > 0
            ? (($thisWeekSales - $lastWeekSales) / $lastWeekSales) * 100
            : ($thisWeekSales > 0 ? 100 : 0);

        // === PRODUCT VIEWS (CONVERSION RATE) ===
        $thisWeekViews = Product::where('shop_id', $vendorId)
            ->whereBetween('updated_at', [$thisWeekStart, $now])
            ->sum('views');

        $lastWeekViews = Product::where('shop_id', $vendorId)
            ->whereBetween('updated_at', [$lastWeekStart, $lastWeekEnd])
            ->sum('views');

        $thisWeekConversion = $thisWeekViews > 0 ? ($thisWeekSales / $thisWeekViews) * 100 : 0;
        $lastWeekConversion = $lastWeekViews > 0 ? ($lastWeekSales / $lastWeekViews) * 100 : 0;

        $conversionGrowth = $lastWeekConversion > 0
            ? (($thisWeekConversion - $lastWeekConversion) / $lastWeekConversion) * 100
            : ($thisWeekConversion > 0 ? 100 : 0);

        // === PROFIT MARGIN ===
        $thisWeekOrderIds = Order::whereJsonContains('vendor_id', $vendorId)
            ->where('payment_status', 'completed')
            ->whereBetween('updated_at', [$thisWeekStart, $now])
            ->pluck('id');

        $lastWeekOrderIds = Order::whereJsonContains('vendor_id', $vendorId)
            ->where('payment_status', 'completed')
            ->whereBetween('updated_at', [$lastWeekStart, $lastWeekEnd])
            ->pluck('id');

        $thisWeekItems = OrderItem::whereIn('order_id', $thisWeekOrderIds)->with('product')->get();
        $lastWeekItems = OrderItem::whereIn('order_id', $lastWeekOrderIds)->with('product')->get();

        $thisRevenue = $thisWeekItems->sum(fn($i) => $i->price * $i->quantity);
        $thisCost = $thisWeekItems->sum(fn($i) => optional($i->product)->sales_price * $i->quantity);
        $thisProfitMargin = $thisRevenue > 0 ? (($thisRevenue - $thisCost) / $thisRevenue) * 100 : 0;

        $lastRevenue = $lastWeekItems->sum(fn($i) => $i->price * $i->quantity);
        $lastCost = $lastWeekItems->sum(fn($i) => optional($i->product)->sales_price * $i->quantity);
        $lastProfitMargin = $lastRevenue > 0 ? (($lastRevenue - $lastCost) / $lastRevenue) * 100 : 0;

        $profitGrowth = $lastProfitMargin > 0
            ? (($thisProfitMargin - $lastProfitMargin) / $lastProfitMargin) * 100
            : ($thisProfitMargin > 0 ? 100 : 0);

        return response()->json([
            'status' => 'success',
            'data' => [
                'sales_volume' => $thisWeekSales,
                'sales_growth' => round($salesGrowth, 2),

                'conversion_rate' => round($thisWeekConversion, 2),
                'conversion_growth' => round($conversionGrowth, 2),

                'profit_margin' => round($thisProfitMargin, 2),
                'profit_growth' => round($profitGrowth, 2),
            ]
        ]);
    }

    /**
     * Get Top Categories, Products, and Customer Locations
     */

    public function getTopCategories()
    {
        $vendorId = Auth::id();

        $orderIds = Order::whereJsonContains('vendor_id', $vendorId)
            ->where('payment_status', 'completed')
            ->pluck('id');

        $items = OrderItem::whereIn('order_id', $orderIds)
            ->with(['product.category'])
            ->get();

        $categoryStats = $items
            ->groupBy(function ($item) {
                return optional($item->product->category)->name ?? 'Uncategorized';
            })
            ->map(function ($group) {
                return [
                    'category'    => $group->first()->product->category->name ?? 'Uncategorized',
                    'quantity_sold'  => $group->sum('quantity'),
                    'revenue'     => $group->sum(fn($item) => $item->price * $item->quantity),
                ];
            })
            ->sortByDesc('quantity_sold')
            ->values();

        return response()->json([
            'status' => 'success',
            'data'   => $categoryStats,
        ]);
    }


    public function getTopProducts()
    {
        $vendorId = Auth::id();

        // Step 1: Get all COMPLETED orders that include this vendor
        $orderIds = Order::whereJsonContains('vendor_id', $vendorId)
            ->where('payment_status', 'completed')
            ->pluck('id');

        // Step 2: Fetch all OrderItems tied to those orders with product
        $items = OrderItem::whereIn('order_id', $orderIds)
            ->with('product')
            ->get();

        // Step 3: Group by product and summarize stats
        $productStats = $items->groupBy(fn($item) => optional($item->product)->id)
            ->filter(fn($group, $key) => $key !== null) // filter out nulls (products deleted?)
            ->map(function ($group) {
                $product = $group->first()->product;

                return [
                    'product_id' => $product->id,
                    'title'      => $product->title ?? 'Unknown Product',
                    'image'      => $product->images[0] ?? null,
                    'quantity_sold' => $group->sum('quantity'),
                    'revenue'    => $group->sum(fn($item) => $item->price * $item->quantity),
                ];
            })
            ->sortByDesc('quantity_sold')
            ->values();

        return response()->json([
            'status' => 'success',
            'data'   => $productStats,
        ]);
    }

    public function getTopCustomerLocations()
    {
        $vendorId = Auth::id();

        // Step 1: Fetch completed orders with address and customer data
        $orders = Order::with(['address', 'customer'])
            ->whereJsonContains('vendor_id', $vendorId)
            ->where('payment_status', 'completed')
            ->get();

        // Step 2: Group orders by city-country
        $locationStats = $orders->groupBy(function ($order) {
            $city = optional($order->address)->city ?? 'Unknown';
            $country = optional($order->address)->country ?? 'Unknown';
            return "{$city},{$country}";
        })->map(function ($group, $locationKey) {
            [$city, $country] = explode(',', $locationKey);
            $uniqueCustomers = $group->pluck('customer_id')->unique()->count();

            return [
                'city' => $city,
                'country' => $country,
                'total_customers' => $uniqueCustomers,
            ];
        });

        // Step 3: Compute total across all locations
        $totalCustomers = $locationStats->sum('total_customers');

        // Step 4: Add percentage share and sort
        $locationStats = $locationStats->map(function ($stat) use ($totalCustomers) {
            $stat['percentage'] = $totalCustomers > 0
                ? round(($stat['total_customers'] / $totalCustomers) * 100, 2)
                : 0;
            return $stat;
        })->sortByDesc('total_customers')->values();

        // Step 5: Return response
        return response()->json([
            'status' => 'success',
            'data' => $locationStats
        ]);
    }

    public function getGraphData(Request $request)
    {
        // Validate the request (date is optional)
        $request->validate([
            'date' => 'nullable|date',
        ]);

        $vendorId = Auth::id();

        $orders = Order::whereJsonContains('vendor_id', (int) $vendorId)
            ->when($request->filled('date'), function ($query) use ($request) {
                $date = Carbon::parse($request->date)->startOfDay();
                $query->whereDate('created_at', '=', $date);
            })
            ->selectRaw('DATE(created_at) as date, SUM(total) as total')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $orders
        ]);
    }

    /**
     * Get Transaction History
     */
    public function getTransactionHistory(Request $request)
    {
        //validation for start_date and end_date
        $request->validate([
            'start_date' => 'date|nullable',
            'end_date' => 'date|nullable',
        ]);
        $vendorId = Auth::id();

        // Optional date filtering
        $transactions = Transaction::where('receiver_id', $vendorId)
            ->when($request->start_date, function ($query) use ($request) {
                $query->whereDate('created_at', '>=', $request->start_date);
            })
            ->when($request->end_date, function ($query) use ($request) {
                $query->whereDate('created_at', '<=', $request->end_date);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'status' => 'success',
            'data' => $transactions
        ]);
    }

    /**
     * Create or update the vendor's settlement bank details.
     */
    public function createOrUpdateBank(Request $request, ActivityLogger $activityLogger)
    {
        $vendorId = Auth::id();

        // Validate request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',  // Bank name
            'code' => 'required|string|max:10',  // SWIFT or bank code
            'institution_number' => 'required|string|size:3',  // 3-digit institution number
            'transit_number' => 'required|string|size:5',  // 5-digit transit number
            'account_number' => 'required|string|between:7,12',  // 7-12 digit account number
            'account_name' => 'required|string|max:255',  // Account holder's name
        ], [
            'name.required' => 'Bank name is required',
        ]);

        // Find or create vendor's settlement bank record
        $bank = SettlementAccount::updateOrCreate(
            ['user_id' => $vendorId],  // Search condition
            array_merge($validated, ['user_id' => $vendorId]) // Update or insert
        );

        $agent = new Agent();
        $device = $agent->device();
        $platform = $agent->platform();
        $browser = $agent->browser();

        $deviceInfo = "$device on $platform using $browser";
        $activityLogger->log('Vendor updated settlement bank details successfully', Auth::user(), $deviceInfo);
        return response()->json([
            'status' => 'success',
            'message' => 'Bank details updated successfully',
            'data' => $bank
        ], 200);
    }

    // show the settlement bank of the vendor
    public function showSettlementBank()
    {
        return response()->json([
            'status' => 'success',
            'data' => Auth::user()->settlementAccount // Corrected method name
        ], 200);
    }

    public function getOrderStatistics(Request $request)
    {
        $vendorId = Auth::id();
        $dateRange = $request->input('range', null);

        // Correctly filter orders where vendor_id is an array
        $query = Order::whereJsonContains('vendor_id', $vendorId);

        // Optional: Filter by time range
        if ($dateRange) {
            $now = now();
            switch (strtolower($dateRange)) {
                case 'today':
                    $query->whereDate('created_at', $now->toDateString());
                    break;
                case 'last_week':
                    $query->whereBetween('created_at', [$now->copy()->subWeek(), $now]);
                    break;
                case 'last_month':
                    $query->whereBetween('created_at', [$now->copy()->subMonth(), $now]);
                    break;
                case 'last_year':
                    $query->whereBetween('created_at', [$now->copy()->subYear(), $now]);
                    break;
            }
        }

        // Clone query to avoid re-running filters
        $baseQuery = clone $query;

        // Build statistics
        return response()->json([
            'status' => 'success',
            'data' => [
                'total_orders'     => $baseQuery->count(),
                'new_orders'       => (clone $baseQuery)->where('shipping_status', 'processing')->count(),
                'ongoing_orders'   => (clone $baseQuery)->where('shipping_status', 'ongoing')->count(),
                'shipped_orders'   => (clone $baseQuery)->where('shipping_status', 'delivered')->count(),
                'cancelled_orders' => (clone $baseQuery)->where('shipping_status', 'cancelled')->count(),
                'returned_orders'  => (clone $baseQuery)->where('shipping_status', 'returned')->count(),
            ]
        ]);
    }


    public function getItemStatistics()
    {
        $vendorId = Auth::id();

        // Fetch products through the shop relationship
        $totalProducts = Product::whereHas('shop', function ($query) use ($vendorId) {
            $query->where('vendor_id', $vendorId);
        })->count();

        $activeProducts = Product::whereHas('shop', function ($query) use ($vendorId) {
            $query->where('vendor_id', $vendorId);
        })->where('status', 'active')->count();

        $inactiveProducts = Product::whereHas('shop', function ($query) use ($vendorId) {
            $query->where('vendor_id', $vendorId);
        })->where('status', 'inactive')->count();

        // Count products that have reviews
        $reviewedProducts = Product::whereHas('shop', function ($query) use ($vendorId) {
            $query->where('vendor_id', $vendorId);
        })->whereHas('reviews')->count();

        // Count ordered products through OrderItem
        $orderedProducts = Product::whereHas('shop', function ($query) use ($vendorId) {
            $query->where('vendor_id', $vendorId);
        })->whereHas('orderItems')->count();

        // Count products that have been viewed
        $views =  Product::whereHas('shop', function ($query) use ($vendorId) {
            $query->where('vendor_id', $vendorId);
        })->sum('views');
        return response()->json([
            'status' => 'success',
            'data' => [
                'total_products' => $totalProducts,
                'active_products' => $activeProducts,
                'inactive_products' => $inactiveProducts,
                'reviewed_products' => $reviewedProducts,
                'ordered_products' => $orderedProducts,
                'views' => $views,
            ]
        ]);
    }



    public function getFinanceOverview()
    {
        $startMonthInput = strtolower(request()->query('start_date', 'January'));

        // Parse input into a month number
        $monthNumber = is_numeric($startMonthInput)
            ? (int) $startMonthInput
            : Carbon::parse("1 {$startMonthInput}")->month ?? 1;

        // Define year (you can customize this if needed)
        $year = now()->year;


        $startDate = Carbon::createFromDate($year, $monthNumber, 1)->startOfDay();
        $endDate = (clone $startDate)->endOfMonth()->endOfDay();


        $orderQuery = Order::whereBetween('created_at', [$startDate, $endDate]);

        $vendorUnpaidEarnings = (clone $orderQuery)
            ->where('payment_status', 'completed')
            ->where('shipping_status', 'delivered')
            ->where('vendor_payment_settlement_status', 'unpaid')
            ->sum('total');

        $totalPlatformRevenue = (clone $orderQuery)
            ->where('payment_status', 'completed')
            ->where('shipping_status', 'delivered')
            ->sum('total');

        $customerPendingPayments = (clone $orderQuery)
            ->where('payment_status', 'pending')
            ->whereIn('shipping_status', ['processing', 'ongoing'])
            ->sum('total');

        $totalOrders = (clone $orderQuery)->count();

        $completedOrders = (clone $orderQuery)
            ->where('payment_status', 'completed')
            ->count();

        $totalEarningsRecorded = Wallet::sum('total_earning');
        $totalAvailableToWithdraw = Wallet::sum('available_to_withdraw');

        $totalVendors = User::where('role', 'vendor')->count();

        return response()->json([
            'status' => 'success',
            'data' => [
                'sales_summary' => [
                    'total_orders' => $totalOrders,
                    'completed_orders' => $completedOrders,
                    'total_platform_revenue' => $totalPlatformRevenue,
                    'customer_pending_payments' => $customerPendingPayments,
                ],
                'vendor_summary' => [
                    'unpaid_vendor_earnings' => $vendorUnpaidEarnings,
                    'total_vendors' => $totalVendors,
                ],
                'wallet_summary' => [
                    'total_earnings_recorded' => $totalEarningsRecorded,
                    'total_available_to_withdraw' => $totalAvailableToWithdraw,
                ],
            ]
        ]);
    }

    public function getDailyFinanceByMonth()
    {
        $startMonthInput = strtolower(request()->query('start_date', 'January'));
        $monthNumber = is_numeric($startMonthInput)
            ? (int) $startMonthInput
            : Carbon::parse("1 {$startMonthInput}")->month ?? 1;

        $year = now()->year;
        $startDate = Carbon::createFromDate($year, $monthNumber, 1)->startOfDay();
        $endDate = now()->endOfDay();

        $dailyTotals = Order::selectRaw('DATE(created_at) as day, SUM(total) as total')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->where('payment_status', 'completed')
            ->where('shipping_status', 'delivered')
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('day')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $dailyTotals
        ]);
    }
}
