<?php

namespace App\Http\Controllers\Administration;

use Illuminate\Http\Request;
use App\Models\PolicySetting;
use App\Http\Controllers\Controller;

class PolicySettingController extends Controller
{

    
    public function getPolicy($type)
    {
        $policy = PolicySetting::where('type', $type)->first();

        if (!$policy) {
            return response()->json([
                'status' => 'error',
                'message' => 'Policy not found.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $policy
        ], 200);
    }
    public function storePolicy(Request $request)
    {
        $request->validate([
            'type' => 'required|string|in:delivery,refund,return,terms,privacy',
            'content' => 'required|string',
        ]);

        $policy = PolicySetting::updatePolicy($request->type, $request->content);

        return response()->json([
            'status' => 'success',
            'message' => ucfirst($request->type) . ' policy updated successfully.',
            'data' => $policy
        ], 201);
    }
}
