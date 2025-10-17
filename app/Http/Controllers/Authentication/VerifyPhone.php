<?php

namespace App\Http\Controllers\Authentication;

use App\Models\User;
use Illuminate\Http\Request;
use App\Models\OtpVerification;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Validation\ValidationException;

class VerifyPhone extends Controller
{
    public function verifyPhoneOtp(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'phone' => 'required|numeric|exists:users,phone',
                'otp' => 'required|digits:6|exists:otp_verifications,otp',
            ]);

            $otpRecord = OtpVerification::where([
                ['phone', '=', $validatedData['phone']],
                ['otp', '=', $validatedData['otp']],
            ])->latest()->first();

            if (!$otpRecord) {
                return response()->json(['message' => 'Invalid OTP. Pls try again', 'status' => 'error'], 401);
            }

            $otpRecord->update(['status' => 'verified']);

            $user = User::where('phone', $validatedData['phone'])->first();
            if ($user) {
                $user->update(['phone_verified_at' => now(), 'is_active' => true]);
            }

            $otpRecord->delete();

            return response()->json(['message' => 'Phone verified successfully', 'status' => 'success'], 200);
        } catch (ValidationException $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Something went wrong! Please try again', 'error_detail' => $e->getMessage()], 422);
        }
    }
}
