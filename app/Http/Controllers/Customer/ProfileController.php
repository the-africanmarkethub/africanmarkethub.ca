<?php

namespace App\Http\Controllers\Customer;

use App\Models\User;
use App\Models\Referral;
use Jenssegers\Agent\Agent;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Services\ActivityLogger;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator; // Import the Validator facade

class ProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user(); 
        return response()->json([
            'data' => $user,
            'status' => 'success'
        ], 200);
    }

    public function update(Request $request, $userId, ActivityLogger $activityLogger)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'string|max:255',
            'last_name' => 'string|max:255',
            'phone' => 'string|max:255',
            'email' => ['email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8|confirmed',
        ]);

 

        $messages = [
            'password.different_from_current' => 'The new password must be different from the current password.',
        ];

        $validator = Validator::make($request->all(), [
            'password' => 'nullable|string|min:8|confirmed|different_from_current', 
        ], $messages);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(), 
                'message' => 'Validation failed'
            ], 422); 
        }

        $agent = new Agent();
        $device = $agent->device();
        $platform = $agent->platform();
        $browser = $agent->browser();

        $deviceInfo = "$device on $platform using $browser";
        $activityLogger->log('User update profile successfully', Auth::user(), $deviceInfo);


        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->fill($validated);
        $user->save();

        return response()->json([
            'data' => $user,
            'status' => 'success',
            'message' => 'Profile updated successfully'
        ], 200);
    }


    public function delete()
    {
        $user = Auth::user();

        if ($user) {
            // 1. Delete the user's tokens
            $user->tokens()->delete();  // This will delete all the user's Sanctum tokens

            // 2. Soft delete the user
            $user->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Profile and associated tokens deleted successfully'
            ], 200);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        }
    }

    public function changePassword(Request $request, ActivityLogger $activityLogger)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/'
            ],
        ], [
            'new_password.regex' => 'Password must include uppercase, lowercase, number, and special character.'
        ]);

        // Check if the current password is correct
        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Current password is incorrect'
            ], 422);
        }

        // Ensure new password is different from current password
        if (Hash::check($validated['new_password'], $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'New password must be different from the current password.'
            ], 422);
        }

        // Update password
        $user->password = Hash::make($validated['new_password']);
        $user->save();

        $agent = new Agent();
        $device = $agent->device();
        $platform = $agent->platform();
        $browser = $agent->browser();

        $deviceInfo = "$device on $platform using $browser";
        $activityLogger->log('User update profile successfully', Auth::user(), $deviceInfo);

        return response()->json([
            'status' => 'success',
            'message' => 'Password changed successfully'
        ]);
    }

    public function applyReferralCode(Request $request, ActivityLogger $activityLogger)
    {
        $user = Auth::user();

        if ($user->referred_by) {
            return response()->json([
                'status' => 'error',
                'message' => 'Referral code already applied.'
            ], 400);
        }

        $request->validate([
            'referral_code' => 'required|string|exists:users,referral_code',
        ]);

        $referrer = User::where('referral_code', $request->referral_code)->first();

        if ($referrer->id === $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'You cannot refer yourself.'
            ], 400);
        }

        // Update referred user record
        $user->referred_by = $referrer->id;
        $user->save();

        // Create referral record
        $rewardAmount = 100; // Or fetch from settings
        Referral::create([
            'referrer_id' => $referrer->id,
            'referred_id' => $user->id,
            'reward_amount' => $rewardAmount,
        ]);

        $agent = new Agent();
        $device = $agent->device();
        $platform = $agent->platform();
        $browser = $agent->browser();

        $deviceInfo = "$device on $platform using $browser";
        $activityLogger->log('User applied referral code successfully', Auth::user(), $deviceInfo);

        return response()->json([
            'status' => 'success',
            'message' => 'Referral code applied successfully.',
            'referrer' => $referrer->name,
            'reward' => $rewardAmount,
        ]);
    }

    
    public function getReferralCode()
    {
        $user = Auth::user();
        if ($user) {
            return response()->json([
                'status' => 'success',
                'referral_code' => $user->referral_code
            ]);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        }
    }
}
