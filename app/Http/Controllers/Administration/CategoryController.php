<?php

namespace App\Http\Controllers\Administration;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Banner;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    public function index()
    {
        $limit = min((int) request()->query('limit', 10), 100);
        $offset = (int) request()->query('offset', 0);
        $search = trim(request()->query('search', ''));
        $type = request()->query('type');

        // Base query for categories
        $query = Category::whereNull('parent_id')->with('children');

        // Filter by type before fetching results
        if (!empty($type)) {
            $query->where('type', $type);
        }

        // Apply search
        if (!empty($search)) {
            $query->where('name', 'like', "%{$search}%");
        }

        // Get total for pagination (after all filters)
        $totalCategories = $query->count();

        // Fetch paginated categories
        $categories = $query->latest()->skip($offset)->take($limit)->get();

        $stats = Category::selectRaw('
            COUNT(*) as total_items,
            COUNT(CASE WHEN type = "products" THEN 1 END) as total_product,
            COUNT(CASE WHEN type = "services" THEN 1 END) as total_service,
            COUNT(CASE WHEN status = "active" THEN 1 END) as total_active,
            COUNT(CASE WHEN status = "inactive" THEN 1 END) as total_inactive
        ')->first();

        return response()->json([
            'status' => 'success',
            'data' => $categories,
            'total' => $totalCategories,
            'limit' => $limit,
            'offset' => $offset,
            'stats' => [
                'total_product' => $stats->total_product,
                'total_service' => $stats->total_service,
                'total_items' => $stats->total_items,
                'total_active' => $stats->total_active,
                'total_inactive' => $stats->total_inactive,
            ]
        ]);
    }

    public function subCategoryList()
    {
        $limit = min((int) request()->query('limit', 10), 100);
        $offset = (int) request()->query('offset', 0);
        $search = trim(request()->query('search', ''));
        $type = request()->query('type');

        // Base query: parent categories with children
        $query = Category::whereNull('parent_id')
            ->has('children') // Only parents with children
            ->with(['children:id,parent_id,name,slug']);

        // Apply search filter
        if (!empty($search)) {
            $query->where('name', 'like', "%{$search}%");
        }

        // Apply type filter
        if (!empty($type)) {
            $query->where('type', $type);
        }

        // Get total count before pagination
        $total = $query->count();

        // Apply pagination
        $categories = $query
            ->select(['id', 'name', 'slug'])
            ->latest()
            ->skip($offset)
            ->take($limit)
            ->get();

        return response()->json([
            'status' => 'success',
            'total' => $total,
            'limit' => $limit,
            'offset' => $offset,
            'data' => $categories,
        ]);
    }



    public function getCategoryByType(Request $request)
    {
        $type = $request->query('type');

        if (!in_array($type, ['products', 'services'])) {
            return response()->json(['message' => 'Invalid category type.', 'status' => 'error'], 400);
        }

        $categories = Category::whereNull('parent_id')
            ->where('type', $type)
            ->with('children')
            ->get();

        $banner = Banner::where('type', $type)->first();

        return response()->json([
            'message' => 'Category fetched.',
            'status' => 'success',
            'banner' => $banner?->banner,
            'categories' => $categories,
        ], 200);
    }

    public function create(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|unique:categories,name|max:250',
                'description' => 'nullable|string',
                'parent_id' => 'nullable|integer|exists:categories,id',
                'type' => 'nullable|string|in:products,services',
                'image' => 'nullable|file|max:10024',
            ]);

            // Conditional rules
            $validator->sometimes('parent_id', 'required', function ($input) {
                return is_null($input->type);
            });

            $validator->sometimes('type', 'required', function ($input) {
                return is_null($input->parent_id);
            });

            $validated = $validator->validate();
            $finalType = $validated['type'] ?? null;

            if (!empty($validated['parent_id'])) {
                $parent = Category::find($validated['parent_id']);
                if (!$parent) {
                    return response()->json([
                        'message' => 'Parent category not found.',
                        'status' => 'error'
                    ], 404);
                }
                $finalType = $parent->type;
            }

            if ($request->hasFile('image')) {
                $uploadedFile = $request->file('image')->getRealPath();
                $uploadResult = cloudinary()->upload($uploadedFile, [
                    'folder' => 'categoryImage',
                    'transformation' => [
                        'width' => 300,
                        'height' => 300,
                        'crop' => 'fill',
                    ],
                ]);
                $imageUrl = $uploadResult->getSecurePath();
                $imagePublicId = $uploadResult->getPublicId();
            }

            Category::create([
                'name' => $validated['name'],
                'slug' => Str::slug($validated['name']),
                'description' => $validated['description'] ?? null,
                'parent_id' => $validated['parent_id'] ?? null,
                'type' => $finalType,
                'image' => $imageUrl ?? null,
                'image_public_id' => $imagePublicId ?? null,
            ]);

            return response()->json([
                'message' => 'Category created successfully.',
                'status' => 'success'
            ], 201);
        } catch (\Throwable $th) {
            Log::error('Category creation failed: ' . $th->getMessage(), ['exception' => $th]);

            return response()->json([
                'message' => 'Category not created successfully.',
                'status' => 'error',
                'error_detail' => $th->getMessage()
            ], 500);
        }
    }

    public function showCategoryProducts(Request $request, $category_id): JsonResponse
    {
        try {
            $query = Product::query();

            // Check if any filters are provided
            $hasFilters = false;

            // Price Range Filtering
            if ($request->has('min_price') && $request->has('max_price')) {
                $query->whereBetween('sales_price', [$request->min_price, $request->max_price]);
                $hasFilters = true;
            }

            // Category Filtering
            if ($request->has('category_id')) {
                $query->where('category_id', $request->category_id);
                $hasFilters = true;
            }

            // Size Filtering (Filter by product variations)
            if ($request->has('size_id')) {
                $query->whereHas('variations', function ($q) use ($request) {
                    $q->where('size_id', $request->size_id);
                });
                $hasFilters = true;
            }

            // Availability Filtering
            if ($request->has('availability')) {
                if ($request->availability == 'in_stock') {
                    $query->where(function ($q) {
                        // Check product quantity
                        $q->where('quantity', '>', 0)
                            // Or check product variation quantity
                            ->orWhereHas('variations', function ($q) {
                                $q->where('quantity', '>', 0);
                            });
                    });
                }
                $hasFilters = true;
            }

            // Location Filtering (Assuming `shop` table has `city_id` and `City` model exists)
            if ($request->has('location')) {
                $query->whereHas('shop', function ($q) use ($request) {
                    $q->whereHas('city', function ($q) use ($request) {
                        $q->where('name', 'LIKE', "%{$request->location}%");
                    });
                });
                $hasFilters = true;
            }


            // Fetch products based on whether filters are applied
            if ($hasFilters) {
                $products = $query->where('category_id', $category_id)->where('type', 'products')->latest()->paginate(20);
                $services = $query->where('category_id', $category_id)->where('type', 'services')->latest()->paginate(20);
            } else {
                $products = Product::where('category_id', $category_id)->where('type', 'products')->latest()->paginate(20);
                $services = Product::where('category_id', $category_id)->where('type', 'services')->latest()->paginate(20);
            }

            // Handle case when no products are found
            if ($products->isEmpty()) {
                return response()->json([
                    'data' => [],
                    'status' => 'error',
                    'message' => 'No products found'
                ], 404);
            }

            // Return response as json
            return response()->json([
                'data' => [
                    'products' => $products,
                    'services' => $services ?? null,
                ],
                'status' => 'success',
                'message' => 'Products retrieved successfully'
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'error_detail' => $th->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $categoryId)
    {
        try {
            $category = Category::findOrFail($categoryId);

            // Log the incoming request
            Log::info('Category update request received', [
                'category_id' => $categoryId,
                'request_data' => $request->except(['image']),
            ]);

            $validated = $request->validate([
                'name' => 'required|string|max:250|unique:categories,name,' . $categoryId,
                'image' => 'nullable|file|max:10024',
                'description' => 'nullable|string',
                'parent_id' => 'nullable|string',
                'type' => 'nullable|string',
            ]);

            // Handle new image upload
            if ($request->hasFile('image')) {
                // Delete old image from Cloudinary if exists
                if ($category->image_public_id) {
                    cloudinary()->destroy($category->image_public_id);
                }

                // Upload new image
                $uploadedFile = $request->file('image')->getRealPath();
                $uploadResult = cloudinary()->upload($uploadedFile, [
                    'folder' => 'categoryImage',
                    'transformation' => [
                        'width' => 300,
                        'height' => 300,
                        'crop' => 'fill',
                    ],
                ]);

                // Update validated array with new image info
                $validated['image'] = $uploadResult->getSecurePath();
                $validated['image_public_id'] = $uploadResult->getPublicId();
            }

            // Update category
            $category->update($validated);

            return response()->json([
                'message' => 'Category updated successfully.',
                'status' => 'success',
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Category update failed: ' . $th->getMessage(), [
                'exception' => $th
            ]);

            return response()->json([
                'message' => 'Category not updated successfully.',
                'status' => 'error',
                'error_detail' => $th->getMessage(),
            ], 500);
        }
    }

    public function categoryAnalytics()
    {
        try {
            $limit = min((int) request()->query('limit', 10), 100);
            $offset = (int) request()->query('offset', 0);
            $search = trim(request()->query('search', ''));
            $type = request()->query('type');

            // Base query
            $baseQuery = DB::table('order_items')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->join('categories', 'products.category_id', '=', 'categories.id')
                ->select(
                    'categories.id',
                    'categories.name',
                    'categories.slug',
                    'categories.type',
                    DB::raw('SUM(order_items.quantity) as total_sales_count'),
                    DB::raw('SUM(order_items.subtotal) as total_sales_amount'),
                    DB::raw('COUNT(order_items.id) as total_orders')
                )
                ->groupBy('categories.id', 'categories.name', 'categories.slug', 'categories.type');

            // Filters
            if (!empty($search)) {
                $baseQuery->where('categories.name', 'like', "%{$search}%");
            }

            if (!empty($type)) {
                $baseQuery->where('categories.type', $type);
            }

            // Clone query for total count
            $countQuery = clone $baseQuery;
            $total = $countQuery->get()->count();

            // Now get paginated data
            $data = $baseQuery
                ->orderByDesc('total_sales_count')
                ->offset($offset)
                ->limit($limit)
                ->get();

            return response()->json([
                'status' => 'success',
                'total' => $total,
                'limit' => $limit,
                'offset' => $offset,
                'data' => $data,
            ]);
        } catch (\Throwable $th) {
            Log::error('Failed to fetch best-selling categories: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong.',
                'error_detail' => $th->getMessage(),
            ], 500);
        }
    }


    public function delete($categoryId)
    {
        if (!$categoryId) {
            return response()->json([
                'message' => 'Category ID is required.',
                'status' => 'error'
            ], 400);
        }

        try {
            $category = Category::findOrFail($categoryId);
            $category->delete();

            return response()->json([
                'message' => 'Category deleted successfully.',
                'status' => 'success'
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Category deletion failed: ' . $th->getMessage(), ['exception' => $th]);

            return response()->json([
                'message' => 'Category not deleted successfully.',
                'status' => 'error',
                'error_detail' => $th->getMessage()
            ], 500);
        }
    }
}
