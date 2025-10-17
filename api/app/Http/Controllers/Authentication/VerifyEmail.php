<?php

namespace App\Http\Controllers\Authentication;

use App\Models\User;
use Jenssegers\Agent\Agent;
use Illuminate\Http\Request;
use App\Models\OtpVerification;
use App\Services\ActivityLogger;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Validation\ValidationException;

class VerifyEmail extends Controller
{
    public function verifyEmailOtp(Request $request,  ActivityLogger $activityLogger)
    {
        try {
            $validatedData = $request->validate([
                'email' => 'required|email|exists:users,email',
                'otp' => 'required|digits:6|exists:otp_verifications,otp',
            ]);

            // Check if the email exists
            $emailExists = OtpVerification::where('email', $validatedData['email'])->exists();
            if (!$emailExists) {
                return response()->json(['message' => 'Email not found.'], 401);
            }

            // Check if the OTP is correct
            $otpRecord = OtpVerification::where([
                ['email', '=', $validatedData['email']],
                ['otp', '=', $validatedData['otp']],
            ])->latest()->first();

            if (!$otpRecord) {
                return response()->json(['message' => 'Invalid OTP. Please try again.', 'status' => 'error'], 401);
            }

            $otpRecord->update(['status' => 'verified']);

            $user = User::where('email', $validatedData['email'])->first();
            if ($user) {
                $user->update(['email_verified_at' => now(), 'phone_verified_at' => now(), 'is_active' => true]);
            }

            $otpRecord->delete();
            $agent = new Agent();

            // Get device info
            $device = $agent->device();         // e.g. "iPhone"
            $platform = $agent->platform();     // e.g. "iOS"
            $browser = $agent->browser();       // e.g. "Safari"

            $deviceInfo = "$device on $platform using $browser";
            $activityLogger->log('User verify email successfully', $user, $deviceInfo);


            return response()->json(['message' => 'Email verified successfully', 'status' => 'success'], 200);
        } catch (ValidationException $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Something went wrong! Please try again', 'error_detail' => $e->getMessage()], 422);
        }
    }
}
