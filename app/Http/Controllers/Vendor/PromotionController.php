<?php

namespace App\Http\Controllers\Vendor;

use App\Models\Promotion;
use Jenssegers\Agent\Agent;
use Illuminate\Http\Request;
use App\Services\ActivityLogger;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class PromotionController extends Controller
{
    public function create(Request $request, ActivityLogger $activityLogger)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'type' => 'required|in:featured,sponsored,banner',
            'duration' => 'required|integer|min:1',
        ]);

        $amount = $this->calculatePromotionCost($request->type, $request->duration);

        $promotion = Promotion::create([
            'vendor_id' => Auth::id(),
            'product_id' => $request->product_id,
            'type' => $request->type,
            'amount' => $amount,
            'start_date' => now(),
            'end_date' => now()->addDays($request->duration),
            'status' => 'pending',
        ]);

        $agent = new Agent();
        $device = $agent->device();
        $platform = $agent->platform();
        $browser = $agent->browser();

        $deviceInfo = "$device on $platform using $browser";
        $activityLogger->log('Vendor Promotion request submitted successfully', Auth::user(), $deviceInfo);

        return response()->json(['message' => 'Promotion request submitted', 'promotion' => $promotion], 201);
    }
    public function pay(Request $request, ActivityLogger $activityLogger)
    {
        $request->validate([
            'promotion_id' => 'required|exists:promotions,id',
        ]);

        $promotion = Promotion::find($request->promotion_id);
        $promotion->update(['status' => 'approved']);

        $agent = new Agent();
        $device = $agent->device();
        $platform = $agent->platform();
        $browser = $agent->browser();

        $deviceInfo = "$device on $platform using $browser";
        $activityLogger->log('Vendor made payment for promotion successfully', Auth::user(), $deviceInfo);
        return response()->json(['message' => 'Payment successful, promotion approved'], 200);
    }

    public function index()
    {
        $promotions = Promotion::where('status', 'approved')->get();
        return response()->json($promotions, 200);
    }

    // 4️⃣ Get details of a specific promotion
    public function show($id)
    {
        $promotion = Promotion::findOrFail($id);
        return response()->json($promotion, 200);
    }

    // 5️⃣ Approve Promotion (Admin Only)
    public function approve($id)
    {
        $promotion = Promotion::findOrFail($id);
        $promotion->update(['status' => 'approved']);

        return response()->json(['message' => 'Promotion approved'], 200);
    }

    public function expire($id)
    {
        $promotion = Promotion::findOrFail($id);
        $promotion->update(['status' => 'expired']);

        return response()->json(['message' => 'Promotion expired'], 200);
    }

    // Utility Function: Calculate Promotion Cost
    private function calculatePromotionCost($type, $duration)
    {
        $pricing = [
            'featured' => 10, // $10 per day
            'sponsored' => 5,  // $5 per day
            'banner' => 20,    // $20 per day
        ];

        return $pricing[$type] * $duration;
    }
}
