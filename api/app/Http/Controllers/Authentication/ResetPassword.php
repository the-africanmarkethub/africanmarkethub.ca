<?php

namespace App\Http\Controllers\Authentication;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\OtpVerification;
use App\Services\ActivityLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class ResetPassword extends Controller
{
    public function resetPassword(Request $request, ActivityLogger $activityLogger): JsonResponse
    {
        try {
            // Validate the request data
            $validatedData = $request->validate([
                'confirmation_code' => 'required|numeric|exists:otp_verifications,otp|digits:6',
                'email' => 'required|email|exists:otp_verifications,email',
                'new_password' => [
                    'required',
                    'min:8',
                    'different:current_password', // Ensure new password is not the same as the old
                    Password::defaults()
                ],
                'device_name' => 'required|string',
            ]);

            // Find the user by email
            $user = User::where('email', $validatedData['email'])->first();

            if (!$user) {
                Log::error('User not found for email: ' . $validatedData['email']);
                return response()->json(['message' => 'Invalid request.'], 404);
            }

            //Check if the password matches the existing password.
            if (Hash::check($validatedData['new_password'], $user->password)) {
                return response()->json(['message' => 'New password cannot be the same as the old password.'], 422);
            }

            // Update the user's password
            $user->forceFill([
                'password' => Hash::make($validatedData['new_password']),
                'remember_token' => Str::random(60),
            ])->save();

            // Log the activity
            $activityLogger->log('User changed Password successfully', $user, $validatedData['device_name']);

            // delete the otp records of the user
            OtpVerification::where('email', $validatedData['email'])->delete();

            // Return a success response
            return response()->json(['message' => 'Password reset successfully.'], 200);
        } catch (ValidationException $e) {
            // Handle validation errors
            Log::warning('Password reset validation failed: ' . $e->getMessage(), ['errors' => $e->errors()]);
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Throwable $th) {
            // Handle unexpected exceptions
            Log::error('Password reset failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json(['message' => 'Failed to reset password. Please try again later.'], 500);
        }
    }
}
