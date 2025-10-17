<?php

namespace App\Http\Controllers\Vendor;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Product;
use Illuminate\Support\Str;
use Jenssegers\Agent\Agent;
use App\Mail\NewProductMail;
use Illuminate\Http\Request;
use App\Models\ProductVariation;
use App\Services\ActivityLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class ItemController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type', 'products');

        if (!in_array($type, ['products', 'services'])) {
            return response()->json([
                'message' => 'Invalid type parameter.',
                'status' => 'error',
            ], 400);
        }

        $query = Product::query()->where('type', $type)->latest();

        // Search Filtering
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        // Price Range Filtering
        if ($request->filled('min_price') && $request->filled('max_price')) {
            $query->whereBetween('sales_price', [$request->min_price, $request->max_price]);
        }

        // Category Filtering
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Size Filtering (via variations)
        if ($request->filled('size_id')) {
            $query->whereHas('variations', function ($q) use ($request) {
                $q->where('size_id', $request->size_id);
            });
        }

        // Availability
        if ($request->filled('availability') && $request->availability === 'in_stock') {
            $query->where(function ($q) {
                $q->where('quantity', '>', 0)
                    ->orWhereHas('variations', function ($q) {
                        $q->where('quantity', '>', 0);
                    });
            });
        }

        // Location Filtering (by shop->city->name)
        if ($request->filled('location')) {
            $query->whereHas('shop.city', function ($q) use ($request) {
                $q->where('name', 'LIKE', "%{$request->location}%");
            });
        }

        $limit = (int) $request->query('limit', 20);
        $offset = (int) $request->query('offset', 0);

        $total = $query->count();
        $products = $query->skip($offset)->take($limit)->get();

        if ($products->isEmpty()) {
            return response()->json([
                'message' => 'No products found matching the filters.',
                'status' => 'success',
                'data' => [],
                'total' => $total,
                'offset' => $offset,
                'limit' => $limit,
            ], 200);
        }

        return response()->json([
            'status' => 'success',
            'data' => $products,
            'total' => $total,
            'offset' => $offset,
            'limit' => $limit,
        ], 200);
    }



    public function show(Request $request, $slug)
    {
        $product = Product::with(['category', 'shop'])->where('slug', $slug)->firstOrFail();

        if (!$product) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found'
            ], 404);
        }

        // Get the IP address of the request
        $ipAddress = $request->ip();
        $cacheKey = 'product_view_' . $product->id . '_' . $ipAddress;

        // Check if the IP address has already viewed the product within the last 24 hours
        if (!Cache::has($cacheKey)) {
            // Increment product view count
            $product->increment('views');
            Cache::put($cacheKey, true, 86400);
        }


        // Get products from the same category excluding the current product
        $sameCategoryProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->inRandomOrder()
            ->limit(4)
            ->get();

        // other shops that selles the same category_id of products
        $otherShops = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('shop_id', '!=', $product->shop_id)
            ->inRandomOrder()
            ->limit(12)
            ->get();

        // Get products from the same category excluding the current product
        $otherViews = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->orderBy('views', 'desc')
            ->inRandomOrder()
            ->limit(8)
            ->get();

        // Calculate the average star rating
        $reviews = $product->reviews->map(function ($review) {
            return [
                'id' => $review->id,
                'rating' => $review->rating,
                'comment' => $review->comment,
                'user' => [
                    'id' => $review->user->id,
                    'name' => $review->user->name,
                    'profile_photo' => $review->user->profile_photo,
                ],
            ];
        });

        // Return response as json
        return response()->json([
            'data' => [
                'product' => $product,
                'star_rating' => [
                    'total' =>    $product->reviews->count(),
                    'reviews' => $reviews,
                ],
                'frequently_bought_together' => $sameCategoryProducts,
                'recommended' => $otherShops,
                'otherViews' => $otherViews,
            ],
            'status' => 'success',
            'message' => 'Product retrieved successfully'
        ], 200);
    }

    public function create(Request $request, ActivityLogger $activityLogger)
    {
        $user = Auth::user();

        if (!$user->shop) {
            return $this->error('Vendor does not have a shop associated.', 400);
        }

        $hasVariations = !empty($request->variations) && is_array($request->variations);
        $type = $user->shop->type;

        try {
            $this->validateProductRequest($request, $hasVariations, $type);
        } catch (ValidationException $e) {
            return $this->error('Validation failed.', 422, $e->errors());
        }

        DB::beginTransaction();

        try {
            // Prepare the data for product creation
            $productData = [
                'title' => ucwords($request->title),
                'description' => $request->description,
                'features' => $request->features,
                'category_id' => $request->category_id,
                'images' => [],
                'image_public_ids' => [],
                'slug' => Str::slug($request->title),
                'shop_id' => $user->shop->id,
                'type' => $type,
                'sales_price' => $hasVariations ? 0 : $request->sales_price,
                'regular_price' => $hasVariations ? ($request->variations[0]['price'] ?? 0) : $request->regular_price,
                'quantity' => $hasVariations ? ($request->variations[0]['quantity'] ?? 0) : $request->quantity,
            ];

            // If the product type is 'services', add the service-specific fields
            if ($type === 'services') {
                $productData['pricing_model'] = $request->pricing_model;
                $productData['delivery_method'] = $request->delivery_method;
                $productData['estimated_delivery_time'] = $request->estimated_delivery_time;
                $productData['available_days'] = $request->available_days;
                $productData['available_from'] = Carbon::parse($request->available_from)->format('H:i');
                $productData['available_to'] = Carbon::parse($request->available_to)->format('H:i');
            }

            $product = Product::create($productData);

            if ($request->hasFile('images')) {
                $this->handleImageUpload($request, $product);
            }

            if ($hasVariations) {
                $this->createVariations($product, $request->variations);
            }

            if ($request->notify_user) {
                $this->notifySubscribedUsers($product);
            }

            DB::commit();

            $agent = new Agent();
            $device = $agent->device();
            $platform = $agent->platform();
            $browser = $agent->browser();

            $deviceInfo = "$device on $platform using $browser";
            $activityLogger->log('Vendor created item successfully', Auth::user(), $deviceInfo);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Product creation failed: ' . $e->getMessage(), 500);
        }
    }
    private function validateProductRequest(Request $request, bool $hasVariations, $type): void
    {
        $baseRules = [
            'title' => 'required|string|unique:products,title|max:255|min:5',
            'description' => 'required|string|max:1000',
            'notify_user' => 'required|boolean',
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'category_id' => 'required|exists:categories,id',
        ];

        if ($type === 'services') {
            $baseRules += [
                'pricing_model' => 'required|string|in:fixed,variable',
                'delivery_method' => 'required|string|in:online,offline',
                'estimated_delivery_time' => 'required|string|max:255',
                'available_days' => 'required|array',
                'available_from' => 'required|date_format:h:ia',
                'available_to' => 'required|date_format:h:ia|after:available_from',
            ];
        }

        if ($hasVariations) {
            $baseRules += [
                'variations' => 'required|array',
                'variations.*.size_id' => 'nullable|exists:sizes,id',
                'variations.*.color_id' => 'nullable|exists:colors,id',
                'variations.*.price' => 'required|numeric|min:0',
                'variations.*.quantity' => 'required|integer|min:0',
            ];
        } else {
            $baseRules += [
                'sales_price' => 'required|numeric|min:0',
                'regular_price' => 'required|numeric|min:0',
                'quantity' => 'required|integer|min:0',
            ];
        }

        $request->validate($baseRules);
    }

    private function handleImageUpload(Request $request, Product $product): void
    {
        $images = [];
        $publicIds = [];

        foreach ($request->file('images') as $image) {
            try {
                $upload = cloudinary()->upload($image->getRealPath(), [
                    'folder' => 'productImages',
                    'transformation' => ['width' => 500, 'height' => 500, 'crop' => 'fill'],
                ]);
                $images[] = $upload->getSecurePath();
                $publicIds[] = $upload->getPublicId();
            } catch (\Exception $e) {
                Log::error('Cloudinary upload failed: ' . $e->getMessage());
            }
        }

        $product->update([
            'images' => $images,
            'image_public_ids' => $publicIds,
        ]);
    }

    private function createVariations(Product $product, array $variations): void
    {
        foreach ($variations as $data) {
            $data['sku'] = 'AMHUB-' . strtoupper(substr($product->title, 0, 4)) . '-' . strtoupper(uniqid());
            $product->variations()->create($data);
        }
    }

    private function notifySubscribedUsers(Product $product): void
    {
        $users = User::where('role', 'customer')->get();

        foreach ($users as $user) {
            Mail::to($user->email)->queue(new NewProductMail($product, $user));
        }
    }

    private function success(string $message, int $code = 200): JsonResponse
    {
        return response()->json(['status' => 'success', 'message' => $message], $code);
    }

    private function error(string $message, int $code = 400, $errors = null): JsonResponse
    {
        $response = ['status' => 'error', 'message' => $message];
        if ($errors) $response['errors'] = $errors;
        return response()->json($response, $code);
    }


    public function update(Request $request, $id, ActivityLogger $activityLogger)
    {
        // Find the product
        $product = Product::findOrFail($id);

        // Validate request
        $request->validate([
            'title' => 'required|string|max:255|unique:products,title,' . $product->id, // Ignore current product in unique check
            'description' => 'required|string|max:1000',
            'features' => 'required|string|max:500',
            'category_id' => 'required|exists:categories,id',
            'variations' => 'array', // Variations are optional for update
            'variations.*.id' => 'nullable|exists:product_variations,id', // Validate existing variation IDs
            'variations.*.size_id' => 'nullable|exists:sizes,id',
            'variations.*.color_id' => 'nullable|exists:colors,id',
            'variations.*.price' => 'required|numeric',
            'variations.*.quantity' => 'required|integer',
            'variations.*.sku' => 'nullable|string',
            'new_variations' => 'array', // Validate new variations
            'new_variations.*.size_id' => 'nullable|exists:sizes,id',
            'new_variations.*.color_id' => 'nullable|exists:colors,id',
            'new_variations.*.price' => 'required|numeric',
            'new_variations.*.quantity' => 'required|integer',
            'new_variations.*.sku' => 'nullable|string',
            'deleted_variations' => 'array', // Validate deleted variations
            'deleted_variations.*' => 'exists:product_variations,id',
            'notify_user' => 'required|in:true,false',

        ]);

        DB::beginTransaction();

        try {
            // Update product details
            $product->title = $request->title;
            $product->slug = Str::slug($request->title);
            $product->description = $request->description;
            $product->features = $request->features;
            $product->category_id = $request->category_id;
            $product->save();

            // Update existing variations
            if ($request->has('variations')) {
                foreach ($request->variations as $variationData) {
                    $variation = ProductVariation::findOrFail($variationData['id']);
                    $variation->update([
                        'size_id' => $variationData['size_id'] ?? null,
                        'color_id' => $variationData['color_id'] ?? null,
                        'price' => $variationData['price'],
                        'quantity' => $variationData['quantity'],
                        'sku' => $variationData['sku'] ?? null,
                    ]);
                }
            }

            // Create new variations
            if ($request->has('new_variations')) {
                foreach ($request->new_variations as $variationData) {
                    $product->variations()->create($variationData);
                }
            }
            // Delete variations
            if ($request->has('deleted_variations')) {
                foreach ($request->deleted_variations as $variationId) {
                    $variation = ProductVariation::findOrFail($variationId);
                    $variation->delete();
                }
            }

            // // Mail all customers for the discount if notify_user is true
            if ($request->notify_user === 'true') {
                $users = User::where('role', 'customer')->get();
                foreach ($users as $user) {
                    Mail::to($user->email)->queue(new NewProductMail($product, $user));
                }
            }


            DB::commit();

            $agent = new Agent();
            $device = $agent->device();
            $platform = $agent->platform();
            $browser = $agent->browser();

            $deviceInfo = "$device on $platform using $browser";
            $activityLogger->log('Vendor Identity verification created successfully', Auth::user(), $deviceInfo);

            return response()->json([
                'data' => $product->load('variations'),
                'status' => 'success',
                'message' => 'Product details updated successfully'
            ], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'status' => 'error',
                'message' => 'Product update failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateProductImages(Request $request, $id)
    {
        // Find the product
        $product = Product::findOrFail($id);

        // Validate request
        $request->validate([
            'images' => 'array', // New images to add
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Validate image files
            'image_public_ids_to_delete' => 'array', // Public IDs of images to delete
            'image_public_ids_to_delete.*' => 'string', // Validate public IDs
        ]);

        DB::beginTransaction();

        try {
            $existingImagesCount = count($product->images ?? []);
            $newImages = $request->file('images') ?? [];
            $imagesToAddCount = count($newImages);
            $image_public_ids_to_delete = $request->input('image_public_ids_to_delete') ?? [];
            $imagesToDeleteCount = count($image_public_ids_to_delete);

            $totalImagesAfterDelete = $existingImagesCount - $imagesToDeleteCount;

            if ($totalImagesAfterDelete + $imagesToAddCount > 7) {

                $imagesToAddCount = max(0, 7 - $totalImagesAfterDelete);
            }
            $images = $product->images ?? [];
            $image_public_ids = $product->image_public_ids ?? [];

            // Delete images
            if ($request->has('image_public_ids_to_delete')) {
                foreach ($request->input('image_public_ids_to_delete') as $publicId) {

                    try {
                        Cloudinary::destroy($publicId);
                    } catch (\Exception $e) {
                        DB::rollback();
                        return response()->json([
                            'status' => 'error',
                            'message' => 'Failed to delete image from Cloudinary: ' . $e->getMessage()
                        ], 500);
                    }

                    // Remove the image from the arrays
                    $key = array_search($publicId, $image_public_ids);
                    if ($key !== false) {
                        unset($image_public_ids[$key]);
                        unset($images[$key]);
                    }
                }

                // Reindex the arrays to remove gaps
                $image_public_ids = array_values($image_public_ids);
                $images = array_values($images);
            }

            // Add new images
            $uploadedImagesCount = 0;

            foreach ($newImages as $image) {
                if ($uploadedImagesCount >= $imagesToAddCount) {
                    break; // Stop uploading if we've reached the limit
                }

                try {
                    $uploadedImage = Cloudinary::upload($image->getRealPath(), [
                        'folder' => 'productImages',
                        'transformation' => [
                            'width' => 500,
                            'height' => 500,
                            'crop' => 'fill'
                        ]
                    ]);

                    $images[] = $uploadedImage['secure_url'];
                    $image_public_ids[] = $uploadedImage['public_id'];
                    $uploadedImagesCount++;
                } catch (\Exception $e) {
                    DB::rollback();
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Image upload failed: ' . $e->getMessage()
                    ], 500);
                }
            }

            $product->images = $images;
            $product->image_public_ids = $image_public_ids;
            $product->save();

            DB::commit();

            return response()->json([
                'data' => $product->load('variations'),
                'status' => 'success',
                'message' => 'Product images updated successfully'
            ], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'status' => 'error',
                'message' => 'Product image update failed: ' . $e->getMessage()
            ], 500);
        }
    }

    // Create destroy function to delete a product by id, return response as json
    public function destroy($id)
    {
        // Get a single product by id
        $product = Product::find($id);
        if (!$product) {
            return response()->json([
                'data' => $product,
                'status' => 'error',
                'message' => 'Product not found'
            ], 404);
        }
        // Delete the product
        $product->delete();
        // delete the images from cloudinary
        foreach ($product->image_public_ids as $publicId) {
            try {
                Cloudinary::destroy($publicId);
            } catch (\Exception $e) {
                Log::error('Cloudinary delete failed: ' . $e->getMessage());
                // Optionally, you could retry the delete or handle the error differently
                continue;
            }
        }
        // Return response as json
        return response()->json([
            'data' => $product,
            'status' => 'success',
            'message' => 'Product deleted successfully'
        ], 200);
    }

    public function vendorProducts()
    {
        $user = Auth::user();

        // search for products by vendor
        if (request()->has('search')) {
            $search = request()->search;
            $products = Product::with(['category', 'shop'])
                ->where('shop_id', $user->shop->id)
                ->where(function ($query) use ($search) {
                    $query->where('title', 'LIKE', "%{$search}%")
                        ->orWhere('description', 'LIKE', "%{$search}%");
                })
                ->latest()
                ->paginate(20);
            if ($products->isEmpty()) {
                return response()->json([
                    'data' => $products,
                    'status' => 'error',
                    'message' => 'No items found for the search query'
                ], 404);
            }
            // Return response as json
            return response()->json([
                'data' => $products,
                'status' => 'success',
                'message' => 'Vendor items retrieved successfully'
            ], 200);
        }
        // Get all items for the vendor
        $products = Product::with(['category', 'shop'])->where('shop_id', $user->shop->id)->latest()->paginate(20);
        if ($products->isEmpty()) {
            return response()->json([
                'data' => $products,
                'status' => 'error',
                'message' => 'No items found'
            ], 404);
        }
        // Return response as json
        return response()->json([
            'data' => $products,
            'status' => 'success',
            'message' => 'Vendor items retrieved successfully'
        ], 200);
    }

    public function searchProducts(): JsonResponse
    {
        $searchQuery = request()->input('query');
        info($searchQuery);
        $products = Product::where('title', 'LIKE', "%{$searchQuery}%")
            ->orWhere('description', 'LIKE', "%{$searchQuery}%")
            ->paginate(20);

        if ($products->isEmpty()) {
            return response()->json([
                'data' => $products,
                'status' => 'error',
                'message' => 'No products and services found'
            ], 404);
        }

        return response()->json([
            'data' => $products,
            'status' => 'success',
            'message' => 'Products retrieved successfully'
        ], 200);
    }

    public function recommendedProducts(): JsonResponse
    {
        try {
            $recommendedProducts = Product::inRandomOrder()->paginate(20);
            if ($recommendedProducts->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No recommended products found',
                    'data' => []
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Recommended products retrieved successfully',
                'data' => $recommendedProducts
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'error_detail' => $th->getMessage()
            ], 500);
        }
    }

    //boughtTogether
    public function boughtTogether() {}
}
