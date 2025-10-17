<?php

namespace App\Http\Controllers\Authentication;

use App\Models\User;
use App\Services\OtpService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Validation\ValidationException;

class ForgetPassword extends Controller
{
    public function forgetPassword(Request $request, OtpService $otpService): JsonResponse
    {
        try {
            // Validate the incoming request data
            $validated = $request->validate([
                'email' => 'required|email:rfc,dns|exists:users,email',
            ]);

            // Attempt to send the OTP (One-Time Password) via email
            $user = User::where('email', $validated['email'])->first();
            $otpService->sendEmailOtp($user); // Pass validated email

            // If OTP sent, return success response
            return response()->json(['message' => 'Password reset code sent successfully.'], 200);

        } catch (ValidationException $e) {
            // Handle validation errors
            Log::warning('Password reset validation failed: ' . $e->getMessage(), ['errors' => $e->errors()]); //More details. Use warning for validation issues.
            return response()->json(['errors' => $e->errors()], 422); //Return all validation errors.
        } catch (\Throwable $th) {
            // Handle unexpected exceptions
            Log::error('Password reset failed: ' . $th->getMessage(), ['exception' => $th]); //Log the exception. Use error for server issues.
            return response()->json(['message' => 'Failed to send password reset code. Please try again later.'], 500);
        }
    }
}
