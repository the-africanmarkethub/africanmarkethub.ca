<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Review;
use App\Models\OrderItem;
use Jenssegers\Agent\Agent;
use Illuminate\Http\Request;
use App\Services\ActivityLogger;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;


class ReviewController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $reviews = match ($user->role) {
            'vendor' => $this->getVendorProductReviews($user),
            'customer' => $this->getCustomerReviews($user),
            default => collect(),
        };

        if ($reviews->isEmpty()) {
            return response()->json(['status' => 'success', 'message' => 'No reviews found', 'data' => []], 404);
        }

        return response()->json(['status' => 'success', 'message' => 'Reviews found', 'data' => $reviews], 200);
    }

    /**
     * Get reviews for the vendor's products.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Support\Collection
     */
    private function getVendorProductReviews(User $user)
    {
        return Review::whereHas('product.shop', function ($query) use ($user) {
            $query->where('vendor_id', $user->id);
        })->with('product', 'user')->get();
    }

    /**
     * Get reviews for the customer.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Support\Collection
     */
    private function getCustomerReviews(User $user)
    {
        return Review::where('user_id', $user->id)->with('product', 'user')->get();
    }

    public function create(Request $request, ActivityLogger $activityLogger)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500',
            'images' => 'required|array',
            'images.*' => 'required|image|mimes:jpeg,png,jpg|max:9048',
        ]);

        $productId = $validated['product_id'];
        $rating = $validated['rating'];
        $comment = $validated['comment'] ?? null;

        $user = Auth::user();

        $orderItem = OrderItem::whereHas('order', function ($q) use ($user) {
            $q->where('user_id', $user->id)
                ->where('payment_status', 'completed');
        })->where('product_id', $productId)->first();

        if (!$orderItem) {
            return response()->json([
                'status' => 'error',
                'message' => 'You are yet to checkout this product. Please checkout first'
            ], 403);
        }

        $existingReview = Review::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->where('order_id', $orderItem->order_id)
            ->first();

        if ($existingReview) {
            return response()->json([
                'status' => 'error',
                'message' => 'You have already reviewed this product for this order'
            ], 403);
        }

        DB::beginTransaction();

        try {
            $review = Review::create([
                'user_id' => $user->id,
                'order_id' => $orderItem->order_id,
                'product_id' => $productId,
                'rating' => $rating,
                'comment' => $comment,
                'images' => [],
                'image_public_ids' => [],
            ]);

            if ($request->hasFile('images')) {
                defer(function () use ($request, $review) {
                    $imageUrls = [];
                    $imagePublicIds = [];

                    foreach ($request->file('images') as $image) {
                        try {
                            $uploadResult = cloudinary()->upload(
                                $image->getRealPath(),
                                [
                                    'folder' => 'reviewImages',
                                    'transformation' => [
                                        'width' => 300,
                                        'height' => 300,
                                        'crop' => 'fill'
                                    ]
                                ]
                            );
                            $imageUrls[] = $uploadResult->getSecurePath();
                            $imagePublicIds[] = $uploadResult->getPublicId();
                        } catch (\Exception $e) {
                            Log::error('Cloudinary upload failed: ' . $e->getMessage());
                            continue;
                        }
                    }

                    $review->update([
                        'images' => $imageUrls,
                        'image_public_ids' => $imagePublicIds,
                    ]);
                });
            }

            $agent = new Agent();
            $deviceInfo = $agent->device() . ' on ' . $agent->platform() . ' using ' . $agent->browser();

            $activityLogger->log('Customer created review successfully', $user, $deviceInfo);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Review created successfully',
                'data' => $review
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Review creation failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // get all reviews
    public function allReviews()
    {
        $reviews = Review::with('user')->inRandomOrder()->limit(10)->get();

        if ($reviews->isEmpty()) {
            return response()->json(['status' => 'success', 'message' => 'No reviews found', 'data' => []], 404);
        }

        return response()->json(['status' => 'success', 'message' => 'Reviews found', 'data' => $reviews], 200);
    }

    //reply to a review as a vendor
    public function reply(Request $request, $id)
    {
        $validated = $request->validate([
            'reply' => 'required|string|max:500',
        ]);

        $review = Review::find($id);
        if (!$review) {
            return response()->json(['status' => 'error', 'message' => 'Review not found'], 404);
        }

        $userId = Auth::id();

        if ($review->product->shop->vendor_id !== $userId) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized action'], 403);
        }

        $review->update(['reply' => $validated['reply']]);

        return response()->json(['status' => 'success', 'message' => 'Reply added successfully', 'data' => $review], 200);
    }
}
