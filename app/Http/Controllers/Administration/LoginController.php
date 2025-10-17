<?php

namespace App\Http\Controllers\Administration;

use Carbon\Carbon;
use App\Models\AdminUser;
use Illuminate\Support\Str;
use App\Services\OtpService;
use Illuminate\Http\Request;
use App\Mail\AdminInviteMail;
use App\Models\OtpVerification;
use App\Services\ActivityLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Jenssegers\Agent\Agent;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    public function login(Request $request, ActivityLogger $activityLogger): JsonResponse
    {
        try {
            $credentials = $request->validate([
                'email' => 'required|email:rfc,dns|exists:admin_users,email',
                'password' => 'required|min:8',
            ]);
            $admin = AdminUser::where('email', $credentials['email'])->first();

            if (!$admin || !Hash::check($credentials['password'], $admin->password)) {
                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            $activityLogger->log('Admin login successfully', $admin, 'Web');

            $token = $admin->createToken('MyAdmin')->plainTextToken;
            $admin->last_login = Carbon::now();
            $admin->save();

            if ($admin->status == 'inactive') {
                return response()->json(['message' => 'Your account is inactive'], 401);
            }
            $needsPasswordChange = !$admin->password_changed_at;

            return response()->json([
                'message' => 'Welcome back.',
                'token' => $token,
                'data' => $admin,
                'must_change_password' => $needsPasswordChange,
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Admin login failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json(['message' => 'Something went wrong. Try again later', 'status' => 'error', 'error_detail' => $th->getMessage()], 500);
        }
    }
    public function invite(Request $request, ActivityLogger $activityLogger): JsonResponse
    {
        $invitee = Auth::user();
        DB::beginTransaction();
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|email:rfc,dns|unique:admin_users,email|max:255',
                'phone' => 'nullable|unique:users,phone|max:12',
                'role' => 'required|string|in:admin,staff',
                'password' => 'required|string|min:8|max:20',
            ]);

            $name = $validated['name'];
            $lastName = $validated['last_name'];
            $email = strtolower($validated['email']);
            $plainPassword = $validated['password'];
            $admin = AdminUser::create([
                'name' => ucwords(strtolower($name)),
                'last_name' => ucwords(strtolower($lastName)),
                'email' => $email,
                'phone' => $validated['phone'],
                'role' => $validated['role'],
                'password' => Hash::make($validated['password']),
            ]);


            $activityLogger->log('New admin account registration', $invitee, 'Web');

            Mail::to($email)->send(new AdminInviteMail($admin, 'Admin Support', $plainPassword));

            DB::commit();

            return response()->json(['message' => 'Account invited successfully'], 201);
        } catch (ValidationException $e) {
            DB::rollBack();
            Log::warning('Registration validation failed: ' . $e->getMessage(), ['errors' => $e->errors()]);
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error('Registration failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json(['message' => 'Something went wrong! Please try again later.'], 500);
        }
    }

    public function listAdmins(Request $request)
    {
        $limit = (int) $request->input('limit', 10);
        $offset = (int) $request->input('offset', 0);
        $search = $request->input('search');

        $query = AdminUser::query();

        // Apply search if provided
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%");
            });
        }

        // Clone for stats
        $statsQuery = clone $query;
        $stats = $statsQuery->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $total = $stats->sum();

        // Fetch paginated data
        $list = $query->latest()
            ->offset($offset)
            ->limit($limit)
            ->get();

        return response()->json([
            'data' => $list,
            'total' => $total,
            'stats' => [
                'total' => $total,
                'active' => $stats['active'] ?? 0,
                'inactive' => $stats['inactive'] ?? 0,
            ],
            'offset' => $offset,
            'limit' => $limit,
        ], 200);
    }

    public function changePassword(Request $request): JsonResponse
    {
        try {
            $admin = Auth::user();
            if (!$admin) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $validated = $request->validate([
                'current_password' => 'required|string|min:8',
                'new_password' => 'required|string|min:8',
            ]);

            if (!Hash::check($validated['current_password'], $admin->password)) {
                return response()->json(['message' => 'Current password is incorrect'], 401);
            }

            if (Hash::check($validated['new_password'], $admin->password)) {
                return response()->json(['message' => 'New password cannot be the same as the current password'], 422);
            }

            $admin->password = Hash::make($validated['new_password']);
            $admin->password_changed_at = now();
            $admin->last_login = now();
            $admin->save();

            return response()->json(['message' => 'Password changed successfully'], 200);
        } catch (\Throwable $th) {
            Log::error('Password change failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json(['message' => 'Something went wrong. Try again later', 'status' => 'error', 'error_detail' => $th->getMessage()], 500);
        }
    }

    public function forgetPassword(Request $request, OtpService $otpService): JsonResponse
    {
        try {
            // Validate the incoming request data
            $validated = $request->validate([
                'email' => 'required|email:rfc,dns|exists:admin_users,email',
            ]);

            // Attempt to send the OTP (One-Time Password) via email
            $user = AdminUser::where('email', $validated['email'])->first();
            $otpService->sendAdminEmailOtp($user);

            return response()->json(['message' => 'Password reset code sent successfully.'], 200);
        } catch (ValidationException $e) {
            Log::warning('Password reset validation failed: ' . $e->getMessage(), ['errors' => $e->errors()]); //More details. Use warning for validation issues.
            return response()->json(['errors' => $e->errors()], 422); //Return all validation errors.
        } catch (\Throwable $th) {
            Log::error('Password reset failed: ' . $th->getMessage(), ['exception' => $th]); //Log the exception. Use error for server issues.
            return response()->json(['message' => 'Failed to send password reset code. Please try again later.'], 500);
        }
    }


    public function resetPassword(Request $request, ActivityLogger $activityLogger): JsonResponse
    {
        try {
            $validatedData = $request->validate(
                [
                    'email' => 'required|email|exists:admin_users,email',
                    'new_password' => [
                        'required',
                        'min:8',
                        'different:current_password',
                        'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/',
                        Password::defaults(),
                    ],
                ],
                [
                    'new_password.regex' => 'Password must include uppercase, lowercase, number, and special character.',
                ]
            );

            // Find the user by email
            $user = AdminUser::where('email', $validatedData['email'])->first();

            if (!$user) {
                Log::error('User not found for email: ' . $validatedData['email']);
                return response()->json(['message' => 'Invalid request.'], 404);
            }

            //Check if the password matches the existing password.
            if (Hash::check($validatedData['new_password'], $user->password)) {
                return response()->json(['message' => 'Improve your password.'], 422);
            }

            // Update the user's password
            $user->forceFill([
                'password' => Hash::make($validatedData['new_password']),
                'remember_token' => Str::random(60),
            ])->save();

            // Log the activity
            $activityLogger->log('Admin User changed Password successfully', $user, 'Admin Portal');

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

    public function resetCodeConfirmation(Request $request,  ActivityLogger $activityLogger)
    {
        try {
            $validatedData = $request->validate([
                'email' => 'required|email|exists:admin_users,email',
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

            $user = AdminUser::where('email', $validatedData['email'])->first();
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
            $activityLogger->log('Admin User verify email successfully', $user, $deviceInfo);


            return response()->json(['message' => 'Email verified successfully', 'status' => 'success'], 200);
        } catch (ValidationException $e) {
            Log::error($e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Something went wrong! Please try again', 'error_detail' => $e->getMessage()], 422);
        }
    }
    public function deleteAdmin($id)
    {
        $admin = AdminUser::find($id);
        if (!$admin) {
            return response()->json(['message' => 'Admin not found'], 404);
        }
        $admin->delete();
        return response()->json(['message' => 'Admin deleted successfully']);
    }
}
