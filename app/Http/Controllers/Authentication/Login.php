<?php

namespace App\Http\Controllers\Authentication;

use App\Models\User;
use App\Models\Wallet;
use App\Mail\WelcomeMail;
use Illuminate\Http\Request;
use App\Services\ActivityLogger;
use App\Services\LocationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Validation\ValidationException;

class Login extends Controller
{
    protected $locationService;
    public function __construct(LocationService $locationService)
    {
        $this->locationService = $locationService;
    }
    public function login(Request $request, ActivityLogger $activityLogger): JsonResponse
    {
        try {
            // Validate the request data
            $validated = $request->validate([
                'email' => 'required|email:rfc,dns|exists:users,email',
                'password' => 'required|min:8',
                'device_name' => 'required|string|max:255',
                'ip_address' => 'required|string|max:50',
            ]);

            // Check if the email exists
            $user = User::where('email', $validated['email'])->first();
            if (!$user) {
                return response()->json(['message' => 'Email not found.'], 401);
            }

            // Attempt to authenticate the user using Laravel's built-in Auth facade
            if (!Auth::attempt(['email' => $validated['email'], 'password' => $validated['password']])) {
                return response()->json(['message' => 'Invalid password.'], 401);
            }

            // Retrieve the authenticated user
            $user = Auth::user();

            // Perform additional checks (status, role verification)
            if (!$user->is_active) {
                return response()->json(['message' => 'Account is inactive. Contact support.'], 403);
            }

            if ($user->role === 'vendor' && !$user->phone_verified_at) {
                return response()->json(['message' => 'Phone number not confirmed. Verify phone number.'], 403);
            }

            if ($user->role === 'customer' && !$user->email_verified_at) {
                return response()->json(['message' => 'Email address not verified. Verify email address.'], 403);
            }

            // Generate API token
            $token = $user->createToken('api_token')->plainTextToken;

            // Log user activity
            $activityLogger->log('User login successfully', $user, $validated['device_name']);

            // Return successful response
            return response()->json([
                'message' => 'Login successful.',
                'token' => $token,
                'user' => $user,
            ], 200);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Throwable $th) {
            // Handle unexpected exceptions
            Log::error('Login error: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json(['message' => 'Server error. Please try again later.'], 500);
        }
    }



    public function continueWithGoogle(Request $request, ActivityLogger $activityLogger): JsonResponse
    {
        try {
            $validated = $request->validate([
                'access_token' => 'required|string',
                'device_name'  => 'required|string|max:255',
                'ip_address'   => 'required|string|max:50',
            ]);

            // Retrieve Google user using access token
            $googleUser = Socialite::driver('google')->stateless()->userFromToken($validated['access_token']);

            if (!$googleUser || !$googleUser->getEmail()) {
                return response()->json(['message' => 'Invalid Google token.'], 401);
            }

            // Find or create user
            $user = User::where('email', $googleUser->getEmail())->first();

            // Attempt to fetch location (don't let it crash if service fails)
            $location = [];
            try {
                $location = $this->locationService->ipInfo($validated['ip_address']);
            } catch (\Throwable $e) {
                Log::warning('Location lookup failed: ' . $e->getMessage());
            }

            // Split Google name into first and last
            $nameParts = explode(' ', $googleUser->getName(), 2);
            $firstName = $nameParts[0] ?? null;
            $lastName  = $nameParts[1] ?? null;

            if (!$user) {
                $user = User::create([
                    'name'              => $firstName,
                    'last_name'         => $lastName,
                    'email'             => $googleUser->getEmail(),
                    'google_id'         => $googleUser->getId(),
                    'profile_photo'     => $googleUser->getAvatar(),
                    'email_verified_at' => now(),
                    'is_active'         => true,
                    'role'              => 'customer',
                    'password'          => Hash::make(str()->random(16)),
                    'city'              => $location['city'] ?? null,
                    'state'             => $location['state'] ?? null,
                    'country'           => $location['country'] ?? null,
                ]);

                // Create wallet safely
                try {
                    Wallet::create(['user_id' => $user->id]);
                } catch (\Throwable $e) {
                    Log::error('Wallet creation failed: ' . $e->getMessage());
                }

                // Queue welcome email (catch mail failures)
                try {
                    Mail::to($user->email)->queue(new WelcomeMail($user));
                } catch (\Throwable $e) {
                    Log::error('Failed to send welcome mail: ' . $e->getMessage());
                }
            } elseif (!$user->google_id) {
                $user->update(['google_id' => $googleUser->getId()]);
            }

            // Block inactive users
            if (!$user->is_active) {
                return response()->json(['message' => 'Account is inactive. Contact support.'], 403);
            }

            // Authenticate the user properly
            Auth::login($user);

            // Generate API token
            $token = $user->createToken('api_token')->plainTextToken;

            // Log activity
            $activityLogger->log('User logged in with Google', $user, $validated['device_name']);

            return response()->json([
                'message' => 'Login with Google successful.',
                'token'   => $token,
                'user'    => $user,
            ], 200);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Throwable $th) {
            Log::error('Google login error: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json(['message' => 'Server error. Please try again later.'], 500);
        }
    }
}
