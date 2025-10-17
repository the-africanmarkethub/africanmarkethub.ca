<?php

namespace App\Http\Controllers\Vendor;

use Carbon\Carbon;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Support\Str;
use Jenssegers\Agent\Agent;
use Illuminate\Http\Request;
use App\Services\ActivityLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\defer;
use Illuminate\Support\Facades\Response;

class ShopController extends Controller
{
    public function create(Request $request, ActivityLogger $activityLogger): JsonResponse
    {
        $validationRules = [
            'name' => 'required|string|unique:shops,name|max:250',
            'address' => 'required|string|max:250',
            'type' => 'required|string|in:services,products',
            'description' => 'required|string|max:2000',
            'subscription_id' => 'required|integer|exists:subscriptions,id',
            'state_id' => 'required|integer|exists:states,id',
            'city_id' => 'required|integer|exists:cities,id',
            'country_id' => 'required|integer|exists:countries,id',
            'category_id' => 'required|integer|exists:categories,id',
            'logo' => 'required|file|max:1024',
            'banner' => 'required|file|max:1024',
        ];

        try {
            // Check if the Auth User already has a shop
            $shop = Shop::where('vendor_id', Auth::id())->first();
            if ($shop) {
                return response()->json(['message' => 'You already have a shop.', 'status' => 'error'], 400);
            }

            $validatedData = $request->validate($validationRules);

            // Create the shop without waiting for the file uploads to complete
            $shop = Shop::create([
                'name' => ucwords($validatedData['name']),
                'slug' => Str::slug($validatedData['name']),
                'address' => $validatedData['address'],
                'type' => $validatedData['type'],
                'description' => $validatedData['description'],
                'subscription_id' => $validatedData['subscription_id'],
                'state_id' => $validatedData['state_id'],
                'city_id' => $validatedData['city_id'],
                'country_id' => $validatedData['country_id'],
                'vendor_id' => Auth::id(),
                'category_id' => $validatedData['category_id'],
                'logo' => '', // Temporary placeholder
                'logo_public_id' => '', // Temporary placeholder
                'banner' => '', // Temporary placeholder
                'banner_public_id' => '', // Temporary placeholder
            ]);

            // Update the auth user role to vendor from customer
            User::where('id', Auth::id())->update(['role' => 'vendor']);

            // Defer the Cloudinary uploads
            defer(function () use ($request, $shop) {
                $logoFile = $request->file('logo');
                $bannerFile = $request->file('banner');

                $logoResult = $this->uploadFileToCloudinary($logoFile, 'shopLogo');
                $bannerResult = $this->uploadFileToCloudinary($bannerFile, 'shopBanner');

                $shop->update([
                    'logo' => $logoResult->getSecurePath(), // Get the secure URL
                    'logo_public_id' => $logoResult->getPublicId(),
                    'banner' => $bannerResult->getSecurePath(), // Get the secure URL
                    'banner_public_id' => $bannerResult->getPublicId(),
                ]);
            });

            $agent = new Agent();
            $device = $agent->device();
            $platform = $agent->platform();
            $browser = $agent->browser();

            $deviceInfo = "$device on $platform using $browser";
            $activityLogger->log('Vendor shop created successfully', Auth::user(), $deviceInfo);
            return response()->json([
                'message' => 'Shop created successfully.',
                'status' => 'success',
            ], 201);
        } catch (\Throwable $th) {
            Log::error('Shop creation failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json(['message' => 'Shop not created successfully.', 'status' => 'error', 'error_detail' => $th->getMessage()], 500);
        }
    }

    public function update(Request $request, $slug, ActivityLogger $activityLogger): JsonResponse
    {
        $validationRules = [
            'name' => 'nullable|string|max:250',
            'address' => 'nullable|string|max:250',
            'type' => 'nullable|string|in:services,products',
            'description' => 'nullable|string|max:2000',
            'subscription_id' => 'nullable|integer|exists:subscriptions,id',
            'state_id' => 'nullable|integer|exists:states,id',
            'city_id' => 'nullable|integer|exists:cities,id',
            'country_id' => 'nullable|integer|exists:,countries,id',
            'category_id' => 'nullable|integer|exists:categories,id',
        ];

        try {
            // Find the shop by slug
            $shop = Shop::where('slug', $slug)->first();

            if (!$shop) {
                return response()->json(['message' => 'Shop not found.', 'status' => 'error'], 404);
            }

            // Ensure the shop belongs to the auth user
            if ($shop->vendor_id !== Auth::id()) {
                return response()->json(['message' => 'Oops! This is not your shop.', 'status' => 'error'], 403);
            }

            $validatedData = $request->validate($validationRules);

            // Update the shop details
            $shop->update(array_filter($validatedData));

            $agent = new Agent();
            $device = $agent->device();
            $platform = $agent->platform();
            $browser = $agent->browser();

            $deviceInfo = "$device on $platform using $browser";
            $activityLogger->log('Vendor shop updated successfully', Auth::user(), $deviceInfo);

            return response()->json(['message' => 'Shop updated successfully.', 'status' => 'success', 'shop' => $shop], 200);
        } catch (\Throwable $th) {
            Log::error('Shop update failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json(['message' => 'Shop not updated successfully.', 'status' => 'error', 'error_detail' => $th->getMessage()], 500);
        }
    }

    // show products of the incoming shop_id //correct this on psotman when you have interent
    public function showShopProduct($slug): JsonResponse
    {
        try {
            $shop = Shop::where('slug', $slug)->first();
            if (!$shop) {
                return response()->json(['message' => 'Shop not found.', 'status' => 'error'], 404);
            }

            $products = $shop->products;
            if ($products->isEmpty()) {
                return response()->json(['message' => 'No products found for this shop.', 'status' => 'error'], 404);
            }

            return response()->json(['message' => 'Shop products retrieved successfully.', 'status' => 'success', 'products' => $products], 200);
        } catch (\Throwable $th) {
            Log::error('Shop products retrieval failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json(['message' => 'Shop products not retrieved successfully.', 'status' => 'error', 'error_detail' => $th->getMessage()], 500);
        }
    }

    public function index()
    {
        try {
            $shops = Shop::with(['state', 'city', 'category', 'vendor'])->paginate(10);
            return response()->json(['message' => 'Shops retrieved successfully.', 'status' => 'success', 'shops' => $shops], 200);
        } catch (\Throwable $th) {
            Log::error('Shops retrieval failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json(['message' => 'Shops not retrieved successfully.', 'status' => 'error', 'error_detail' => $th->getMessage()], 500);
        }
    }
    public function vendorShop()
    {
        try {
            $shops = Shop::with(['state', 'city', 'category', 'vendor'])->where('vendor_id', Auth::id())->get();
            return response()->json(['message' => 'Shops retrieved successfully.', 'status' => 'success', 'shops' => $shops], 200);
        } catch (\Throwable $th) {
            Log::error('Shops retrieval failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json(['message' => 'Shops not retrieved successfully.', 'status' => 'error', 'error_detail' => $th->getMessage()], 500);
        }
    }



    public function updateShopLogo(Request $request, ActivityLogger $activityLogger): JsonResponse
    {
        try {
            $validated = $request->validate([
                'shop_id' => 'required|exists:shops,id',
                'logo' => 'required|file|max:9024',
            ]);

            // Ensure the shop belongs to the auth user
            $shop = Shop::where('vendor_id', Auth::id())->find($validated['shop_id']);

            if (!$shop) {
                return response()->json(['message' => 'Shop not found!.', 'status' => 'error'], 404);
            }


            // Defer the Cloudinary logo upload and deletion of the old logo
            defer(function () use ($request, $shop) {
                $logoFile = $request->file('logo');
                $logoResult = $this->uploadFileToCloudinary($logoFile, 'shopLogo');

                // Delete the old logo from Cloudinary
                if ($shop->logo_public_id) {
                    $this->deleteFileFromCloudinary($shop->logo_public_id);
                }

                $shop->update([
                    'logo' => $logoResult->getSecurePath(), // Get the secure URL
                    'logo_public_id' => $logoResult->getPublicId(),
                ]);
            });

            $agent = new Agent();
            $device = $agent->device();
            $platform = $agent->platform();
            $browser = $agent->browser();

            $deviceInfo = "$device on $platform using $browser";
            $activityLogger->log('Vendor updated shop logo successfully', Auth::user(), $deviceInfo);

            return response()->json(['message' => 'Shop logo update initiated successfully.', 'status' => 'success'], 200);
        } catch (\Throwable $th) {
            Log::error('Shop logo update failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json(['message' => 'Shop logo update not initiated successfully.', 'status' => 'error', 'error_detail' => $th->getMessage()], 500);
        }
    }

    public function updateShopBanner(Request $request, ActivityLogger $activityLogger): JsonResponse
    {
        try {
            $validated = $request->validate([
                'shop_id' => 'required|exists:shops,id',
                'banner' => 'required|file|max:1024',
            ]);

            $shop = Shop::find($validated['shop_id']);

            if (!$shop) {
                return response()->json(['message' => 'Shop not found.', 'status' => 'error'], 404);
            }

            // Defer the Cloudinary banner upload and deletion of the old banner
            defer(function () use ($request, $shop) {
                $bannerFile = $request->file('banner');
                $bannerResult = $this->uploadFileToCloudinary($bannerFile, 'shopBanner');

                // Delete the old banner from Cloudinary
                if ($shop->banner_public_id) {
                    $this->deleteFileFromCloudinary($shop->banner_public_id);
                }

                $shop->update([
                    'banner' => $bannerResult->getSecurePath(), // Get the secure URL
                    'banner_public_id' => $bannerResult->getPublicId(),
                ]);
            });

            $agent = new Agent();
            $device = $agent->device();
            $platform = $agent->platform();
            $browser = $agent->browser();

            $deviceInfo = "$device on $platform using $browser";
            $activityLogger->log('Vendor updated shop banner successfully', Auth::user(), $deviceInfo);

            return response()->json(['message' => 'Shop banner update initiated successfully.', 'status' => 'success'], 200);
        } catch (\Throwable $th) {
            Log::error('Shop banner update failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json(['message' => 'Shop banner update not initiated successfully.', 'status' => 'error', 'error_detail' => $th->getMessage()], 500);
        }
    }

    private function uploadFileToCloudinary($file, string $folder)
    {
        // $uploadResult = Cloudinary::upload($file->getRealPath(), [
        $uploadResult = cloudinary()->upload($file->getRealPath(), [
            'folder' => $folder,
            'transformation' => [
                'width' => 1500,
                'height' => 1500,
                'crop' => 'fill',
            ],
        ]);

        return $uploadResult;
    }


    private function deleteFileFromCloudinary($publicId)
    {
        cloudinary()->destroy($publicId);
    }

    public function delete($id)
    {
        $shop = Shop::find($id);
        if (!$shop) {
            return response()->json(['message' => 'Shop not found'], 404);
        }
        $shop->delete();
        $this->deleteFileFromCloudinary($shop->logo_public_id);
        $this->deleteFileFromCloudinary($shop->banner_public_id);
        return response()->json(['message' => 'Shop deleted successfully']);
    }

    // for admin
    public function list()
    {
        try {
            $limit = request()->query('limit', 10);
            $offset = request()->query('offset', 0);
            $search = request()->query('search');
            $type = request()->query('type');

            $query = Shop::with(['state', 'city', 'category', 'vendor'])
                ->withCount('products');

            if ($search) {
                $query->where('name', 'LIKE', "%{$search}%");
            }

            if ($type) {
                $query->where('type', $type);
            }

            $total = $query->count();

            $shops = $query
                ->offset($offset)
                ->limit($limit)
                ->get();

            return response()->json([
                'message' => 'Shops retrieved successfully.',
                'status' => 'success',
                'total' => $total,
                'limit' => (int)$limit,
                'offset' => (int)$offset,
                'data' => $shops,
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Shops retrieval failed: ' . $th->getMessage(), ['exception' => $th]);

            return response()->json([
                'message' => 'Shops not retrieved successfully.',
                'status' => 'error',
                'error_detail' => $th->getMessage()
            ], 500);
        }
    }

    public function shopAnalytics()
    {
        try {
            $startDateInput = request()->query('start_date');
            $startDate = null;
            $endDate = null;

            if ($startDateInput) {
                try {
                    $parsedDate = Carbon::createFromFormat('F Y', "{$startDateInput} " . now()->year);
                    $startDate = $parsedDate->startOfMonth()->startOfDay();
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
            $queryOrders = Shop::query();

            // Apply date range filter if valid
            if ($startDate && $endDate) {
                $queryOrders->whereBetween('created_at', [$startDate, $endDate]);
            }

            // Fetch sales data grouped by day
            $data = $queryOrders
                ->selectRaw('DATE(created_at) as day, COUNT(*) as total')
                ->groupBy('day')
                ->orderBy('day', 'asc')
                ->get();


            return response()->json([
                'message' => 'Shop analytics retrieved successfully.',
                'status' => 'success',
                'data' => $data,
            ]);
        } catch (\Throwable $th) {
            Log::error('Shop analytics retrieval failed: ' . $th->getMessage(), ['exception' => $th]);

            return response()->json([
                'message' => 'Analytics not retrieved.',
                'status' => 'error',
                'error_detail' => $th->getMessage(),
            ], 500);
        }
    }
    public function shopMetrics()
    {
        try {
            $statusCounts = Shop::selectRaw("status, COUNT(*) as count")
                ->groupBy('status')
                ->pluck('count', 'status');

            $total = $statusCounts->sum();
            $active = $statusCounts['active'] ?? 0;
            $inactive = $statusCounts['inactive'] ?? 0;

            $typeCounts = Shop::selectRaw("type, COUNT(*) as count")
                ->groupBy('type')
                ->pluck('count', 'type');

            $totalProducts = $typeCounts['products'] ?? 0;
            $totalServices = $typeCounts['services'] ?? 0;

            return response()->json([
                'message' => 'Shop metrics retrieved successfully.',
                'status' => 'success',
                'data' => [
                    'total_shops' => $total,
                    'active_shops' => $active,
                    'inactive_shops' => $inactive,
                    'total_products' => $totalProducts,
                    'total_services' => $totalServices,
                ],
            ]);
        } catch (\Throwable $th) {
            Log::error('Shop metrics retrieval failed: ' . $th->getMessage(), ['exception' => $th]);

            return response()->json([
                'message' => 'Metrics not retrieved.',
                'status' => 'error',
                'error_detail' => $th->getMessage(),
            ], 500);
        }
    }

    public function mostSellingShops()
    {
        try {
            $limit = min((int) request()->query('limit', 10), 100);
            $offset = (int) request()->query('offset', 0);

            // Get total sales amount across all shops (for calculating percentage)
            $totalSalesAmount = DB::table('order_items')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->join('shops', 'products.shop_id', '=', 'shops.id')
                ->sum('order_items.subtotal');

            // Main analytics query
            $baseQuery = DB::table('order_items')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->join('shops', 'products.shop_id', '=', 'shops.id')
                ->join('users', 'shops.vendor_id', '=', 'users.id')
                ->select(
                    'shops.id',
                    'shops.name',
                    'shops.slug',
                    'shops.type',
                    'shops.logo',
                    'users.name as vendor_name',
                    DB::raw('SUM(order_items.quantity) as total_sales_count'),
                    DB::raw('SUM(order_items.subtotal) as total_sales_amount'),
                    DB::raw('COUNT(order_items.id) as total_orders')
                )
                ->groupBy(
                    'shops.id',
                    'shops.name',
                    'shops.slug',
                    'shops.type',
                    'shops.logo',
                    'users.name'
                );

            $total = (clone $baseQuery)->get()->count();

            // Fetch and append percentage contribution
            $data = $baseQuery
                ->get()
                ->map(function ($shop) use ($totalSalesAmount) {
                    $shop->sales_percentage = $totalSalesAmount > 0
                        ? round(($shop->total_sales_amount / $totalSalesAmount) * 100, 2)
                        : 0;
                    return $shop;
                })
                ->sortBy('sales_percentage')
                ->slice($offset, $limit)
                ->values();

            return response()->json([
                'status' => 'success',
                'total' => $total,
                'limit' => $limit,
                'offset' => $offset,
                'data' => $data,
            ]);
        } catch (\Throwable $th) {
            Log::error('Failed to fetch shop analytics: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong.',
                'error_detail' => $th->getMessage(),
            ], 500);
        }
    }
}
