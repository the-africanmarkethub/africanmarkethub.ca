<?php

namespace App\Http\Controllers\Vendor;

use App\Models\User;
use App\Models\Product;
use App\Models\Discount;
use Jenssegers\Agent\Agent;
use Illuminate\Http\Request;
use App\Services\ActivityLogger;
use App\Mail\ProductDiscountMail;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class CouponController extends Controller
{
    public function create(Request $request, ActivityLogger $activityLogger)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => ['required', 'exists:products,id'],
            'discount_code' => ['required'],
            'start_time' => ['required', 'date', 'after:now'],
            'end_time' => ['required', 'date', 'after:start_time'],
            'discount_rate' => ['required', 'numeric'],
            'notify_users' => ['required', 'in:true,false'],
            'status' => ['required', 'string', 'in:active,inactive'],
            'discount_type' => ['required', 'string', 'in:percentage,fixed']
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Convert notify_users to boolean
        $notifyUsers = filter_var($request->input('notify_users'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);

        // Ensure the product belongs to the authenticated vendor
        $product = Product::where('id', $request->input('product_id'))
            ->whereHas('shop', function ($query) {
                $query->where('vendor_id', Auth::id());
            })->first();

        if (!$product) {
            return response()->json(['status' => 'error', 'message' => 'Product does not belong to the authenticated vendor'], 403);
        }

        $discount = Discount::create([
            'discount_code' => $request->input('discount_code'),
            'product_id' => $request->input('product_id'),
            'vendor_id' => Auth::id(),
            'start_time' => $request->input('start_time'),
            'end_time' => $request->input('end_time'),
            'discount_rate' => $request->input('discount_rate'),
            'discount_type' => $request->input('discount_type'),
            'status' => $request->input('status'),
            'notify_users' => $notifyUsers,
        ]);

        // Mail all customers for the discount if notify_users is true
        if ($notifyUsers) {
            $users = User::where('role', 'customer')->get();
            Mail::to($users)->queue(new ProductDiscountMail($discount));
        }

        $agent = new Agent();
        $device = $agent->device();
        $platform = $agent->platform();
        $browser = $agent->browser();

        $deviceInfo = "$device on $platform using $browser";
        $activityLogger->log('Vendor created coupon for product successfully', Auth::user(), $deviceInfo);

        return response()->json([
            'status' => 'success',
            'message' => 'Discount created successfully',
            'data' => $discount
        ], 201);
    }


    public function index()
    {
        $discounts = Discount::with('product')
            ->orderByDesc('end_time')
            ->get();

        if ($discounts->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'No discounts found',
                'data' => [],
                'total_time_left' => null
            ], 404);
        }

        // Get the latest end_time from the discounts
        $latestEndTime = $discounts->max('end_time');
        $now = now();
        $timeLeft = $latestEndTime ? \Carbon\Carbon::parse($latestEndTime)->diffForHumans($now, true) : null;

        return response()->json([
            'status' => 'success',
            'message' => 'Discounts retrieved successfully',
            'data' => $discounts,
            'total_time_left' => $timeLeft
        ], 200);
    }

    public function vendorDiscountProducts()
    {
        $vendorId = Auth::id();
        $discounts = Discount::where('vendor_id', $vendorId)->with('product')->get();
        return response()->json([
            'status' => 'success',
            'message' => 'Discounts product retrieved successfully',
            'data' => $discounts
        ], 200);
    }


    public function delete($id, ActivityLogger $activityLogger)
    {
        $discount = Discount::find($id);
        if (!$discount) {
            return response()->json(['status' => 'error', 'message' => 'Discount not found'], 404);
        }

        $discount->delete();

        $agent = new Agent();
        $device = $agent->device();
        $platform = $agent->platform();
        $browser = $agent->browser();

        $deviceInfo = "$device on $platform using $browser";
        $activityLogger->log('Vendor deleted discount for product successfully', Auth::user(), $deviceInfo);

        return response()->json(['status' => 'success', 'message' => 'Discount deleted successfully'], 200);
    }

    public function update(Request $request, $id, ActivityLogger $activityLogger)
    {
        $discount = Discount::find($id);
        if (!$discount) {
            return response()->json(['status' => 'error',  'message' => 'Discount not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'product_id' => ['sometimes', 'exists:products,id'],
            'discount_code' => ['sometimes'],
            'start_time' => ['sometimes', 'date', 'after:now'],
            'end_time' => ['sometimes', 'date', 'after:start_time'],
            'discount_rate' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'status' => ['string', 'in:active,inactive'],
            'discount_type' => ['sometimes', 'string', 'in:percentage,fixed']
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error',  'message' => $validator->errors()], 400);
        }

        $discount->update($request->all());
        $agent = new Agent();
        $device = $agent->device();
        $platform = $agent->platform();
        $browser = $agent->browser();

        $deviceInfo = "$device on $platform using $browser";
        $activityLogger->log('Vendor updated discount for product successfully', Auth::user(), $deviceInfo);
        return response()->json(['status' => 'success', 'message' => 'Discount updated successfully', 'Discount' => $discount], 200);
    }

    public function verifyDiscount(Request $request, $discountCode)
    {
        $discount = Discount::where('discount_code', $discountCode)->firstOrFail();
        if (!$discount) {
            return response()->json(['status' => 'error', 'message' => 'Discount not found'], 404);
        }
        // Check if the discount is active by checking the end_time against today's date
        $isActive = $discount->status === 'active' && now()->lessThanOrEqualTo($discount->end_time);
        return response()->json([
            'status' => 'success',
            'message' => 'Discount verification successful',
            'is_active' => $isActive,
            'discount' => $discount
        ], 200);
    }

}
