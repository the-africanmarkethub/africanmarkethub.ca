<?php

namespace App\Http\Controllers\Administration;

use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class SubscriptionController extends Controller
{
    public function create()
    {
        try {
            $validated = request()->validate([
                'name' => 'required|string|unique:subscriptions,name|max:250',
                'monthly_price' => 'required|numeric',
                'yearly_price' => 'required|numeric',
                'features' => 'required|text',
                'payment_link' => 'required|string'
            ]);

            Subscription::create([
                'name' => $validated['name'],
                'monthly_price' => $validated['monthly_price'],
                'yearly_price' => $validated['yearly_price'],
                'features' => $validated['features'],
                'payment_link' => $validated['payment_link'],
            ]);

            return response()->json(['message' => 'Subscription created successfully.', 'status' => 'success'], 201);
        } catch (\Throwable $th) {
            Log::error('Subscription creation failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json(['message' => 'Subscription not created successfully.', 'status' => 'error', 'error_detail' => $th->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|string|unique:subscriptions,name,' . $id . '|max:250',
                'monthly_price' => 'sometimes|numeric',
                'yearly_price' => 'sometimes|numeric',
                'features' => 'sometimes|string',
                'payment_link' => 'sometimes|string',
            ]);

            $subscription = Subscription::find($id);

            if (!$subscription) {
                return response()->json(['message' => 'Subscription not found.', 'status' => 'error'], 404);
            }

            // Only update the fields that are present in the request
            $subscription->update(array_merge(
                $subscription->toArray(),
                $validated
            ));

            return response()->json(['message' => 'Subscription updated successfully.', 'status' => 'success'], 200);
        } catch (\Throwable $th) {
            Log::error('Subscription update failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json([
                'message' => 'Subscription not updated successfully.',
                'status' => 'error',
                'error_detail' => $th->getMessage(),
            ], 500);
        }
    }

    public function index()
    {
        $subscriptions  = Subscription::all();
        if ($subscriptions->isEmpty()) {
            return response()->json(['message' => 'Subscription not found.', 'status' => 'error'], 404);
        }
        return response()->json(['message' => 'Subscription fetched.', 'status' => 'success', 'data' => $subscriptions], 200);
    }

    public function destroy($id)
    {
        try {
            $subscription = Subscription::find($id);

            if (!$subscription) {
                return response()->json([
                    'message' => 'Subscription not found.',
                    'status'  => 'error',
                ], 404);
            }

            $subscription->delete();

            return response()->json([
                'message' => 'Subscription deleted successfully.',
                'status'  => 'success',
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Subscription delete failed: ' . $th->getMessage(), ['exception' => $th]);

            return response()->json([
                'message' => 'Failed to delete subscription.',
                'status'  => 'error',
            ], 500);
        }
    }
}
