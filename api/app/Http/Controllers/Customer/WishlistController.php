<?php

namespace App\Http\Controllers\Customer;

use App\Models\Wishlist;
use Jenssegers\Agent\Agent;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Services\ActivityLogger;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Casts\Json;

class WishlistController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */

    public function index(): JsonResponse
    {
        // Check if the user is authenticated
        if (!Auth::check()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access. Please log in.',
            ], 401); // 401 Unauthorized
        }

        $customerId = Auth::id();
        $wishlists = Wishlist::where('customer_id', $customerId)->with('product')->get();

        return response()->json([
            'data' => $wishlists,
            'status' => 'success',
            'message' => 'Wishlist retrieved successfully',
        ], 200);
    }
    public function addToWishlist(Request $request, ActivityLogger $activityLogger): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id', // Correct syntax
            'quantity' => 'nullable|integer|min:1',
        ]);
        $productId = $validated['product_id'];
        $quantity = $validated['quantity'] ?? 1;
        $customerId = Auth::id();

        $wishlist = Wishlist::where('customer_id', $customerId)
            ->where('product_id', $productId)
            ->first();

        if ($wishlist) {
            // Update quantity if provided, otherwise leave it the same
            $incomingQuantity = $quantity;

            if ($incomingQuantity !== null) { // Check if quantity is provided
                $wishlist->quantity = $incomingQuantity;
                $wishlist->save();

                return response()->json([
                    'data' => $wishlist,
                    'status' => 'success',
                    'message' => 'Wishlist updated successfully'
                ], 200); // Use 200 OK for updates
            } else {
                return response()->json([
                    'data' => $wishlist, // Return the existing wishlist item
                    'status' => 'info', // Or 'warning' if you prefer
                    'message' => 'Product already in wishlist (no quantity update)'
                ], 200); // Use 200 OK
            }
        } else {
            $newWishlist = new Wishlist();
            $newWishlist->customer_id = $customerId;
            $newWishlist->product_id = $productId;
            $newWishlist->quantity = $quantity ?? 1; // Default to 1 if no quantity provided
            $newWishlist->save();

            $agent = new Agent();
            $device = $agent->device();
            $platform = $agent->platform();
            $browser = $agent->browser();

            $deviceInfo = "$device on $platform using $browser";
            $activityLogger->log('User update profile successfully', Auth::user(), $deviceInfo);
            
            return response()->json([
                'data' => $newWishlist,
                'status' => 'success',
                'message' => 'Product added to wishlist successfully'
            ], 201);
        }
    }

    public function removeFromWishlist(Request $request, $wishlist_id, ActivityLogger $activityLogger)
    {
        $validated = $request->validate([
            'wishlist_id' => ['required', 'exists:wishlists,id'],
        ]);

        $wishlist = Wishlist::where('id', $validated['wishlist_id'])
            ->where('customer_id', Auth::id())
            ->first();

        if (!$wishlist) {
            return response()->json([
                'status' => 'error',
                'message' => 'Wishlist item not found or does not belong to you'
            ], 404);
        }

        $wishlist->delete();

        $agent = new Agent();
        $device = $agent->device();
        $platform = $agent->platform();
        $browser = $agent->browser();

        $deviceInfo = "$device on $platform using $browser";
        $activityLogger->log('User update profile successfully', Auth::user(), $deviceInfo);

        return response()->json([
            'status' => 'success',
            'message' => 'Product removed from wishlist successfully'
        ], 200);
    }
}
