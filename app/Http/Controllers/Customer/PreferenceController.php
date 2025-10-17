<?php

namespace App\Http\Controllers\Customer;

use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use App\Models\Preference;
use Jenssegers\Agent\Agent;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Services\ActivityLogger;
use Illuminate\Support\Facades\Auth;

class PreferenceController extends Controller
{
    public function createOrUpdate(ActivityLogger $activityLogger): JsonResponse
    {
        try {
            $validatedData = request()->validate([
                'list' => 'required|array'
            ]);

            $customerId = Auth::id();

            $preference = Preference::where('customer_id', $customerId)->first();

            $agent = new Agent();
            $device = $agent->device();
            $platform = $agent->platform();
            $browser = $agent->browser();

            $deviceInfo = "$device on $platform using $browser";
            $activityLogger->log('User set preference successfully', Auth::user(), $deviceInfo);

            if ($preference) {
                $updatedList = array_unique(array_merge($validatedData['list']));

                $preference->update([
                    'list' => $updatedList,
                ]);

                return response()->json(['message' => 'Preference updated successfully.', 'status' => 'success'], 200);
            } else {
                Preference::create([
                    'customer_id' => $customerId,
                    'list' => $validatedData['list']
                ]);

                return response()->json(['message' => 'Preference created successfully.', 'status' => 'success'], 201);
            }

        } catch (\Throwable $exception) {
            Log::error('Preference create or update failed: ' . $exception->getMessage(), ['exception' => $exception]);
            return response()->json(['message' => 'Preference not created or updated successfully.', 'status' => 'error', 'error_detail' => $exception->getMessage()], 500);
        }
    }

    public function index(): JsonResponse
    {
        try {
            $preferences = Category::select('name')->get();

            if ($preferences->isEmpty()) {
                return response()->json([
                    'message' => 'Preferences not found.',
                    'status' => 'error'
                ], 404);
            }

            return response()->json([
                'message' => 'Preferences fetched successfully.',
                'status' => 'success',
                'data' => $preferences
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Preference fetch failed', [
                'exception' => $th
            ]);
            return response()->json([
                'message' => 'Preferences not fetched successfully.',
                'status' => 'error',
                'error_detail' => $th->getMessage()
            ], 500);
        }
    }

    public function list()
    {
        try {
            $customerId = Auth::id();

            $preference = Preference::where('customer_id', $customerId)->first();

            if (!$preference) {
                return response()->json(['message' => 'Preference not found.', 'status' => 'error'], 404);
            } else {
                return response()->json(['message' => 'Preference fetched successfully.', 'status' => 'success', 'data' => $preference], 200);
            }
         } catch (\Throwable $exception) {
            Log::error('Preference update failed: ' . $exception->getMessage(), ['exception' => $exception]);
            return response()->json(['message' => 'Preference not updated successfully.', 'status' => 'error', 'error_detail' => $exception->getMessage()], 500);
        }
    }
    public function delete()
    {
        try {
            $validated = request()->validate([
                'pref_id' => 'required|exists:preferences,id',
            ]);
            $preference = Preference::where('id', $validated['pref_id'])->first();
            $preference->delete();
            return response()->json(['message' => 'Preference deleted successfully.', 'status' => 'success'], 200);
        } catch (\Throwable $th) {
            Log::error('Preference delete failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json(['message' => 'Preference not deleted successfully.', 'status' => 'error', 'error_detail' => $th->getMessage()], 500);
        }
    }

    public function trendingProduct(Request $request)
    {
        // info($token = $request->bearerToken());
        $token = $request->bearerToken();
        // Check if the user is authenticated
       
        $products = Product::orderBy('created_at', 'asc')->get();

        // Check if the user is authenticated
        if ($token) {
            $customerId = Auth::id();
            $preference = Preference::where('customer_id', $customerId)->first();

            if ($preference) {
                $products = $preference->products;
                return response()->json(['message' => 'Trending products fetched successfully.', 'status' => 'success', 'data' => $products], 200);
            } else {
                return response()->json(['message' => 'No preferences found for the user.', 'status' => 'success', 'data' => $products], 404);
            }
        } else {
            // If not authenticated, fetch the oldest products
            return response()->json(['message' => 'Oldest products fetched successfully.', 'status' => 'success', 'data' => $products], 200);
        }
    }
}
