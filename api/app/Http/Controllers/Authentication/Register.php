<?php

namespace App\Http\Controllers\Authentication;

use App\Models\User;
use App\Models\Wallet;
use App\Mail\WelcomeMail;
use App\Contracts\SmsSender;
use App\Services\OtpService;
use Illuminate\Http\Request;
use App\Services\AvatarService;
use Illuminate\Validation\Rule;
use App\Services\ActivityLogger;
use App\Services\LocationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class Register extends Controller
{
    private $locationService;
    private $avatarService;
    private $otpService;
    private $SmsSender;

    public function __construct(LocationService $locationService, AvatarService $avatarService, OtpService $otpService, SmsSender $sms)
    {
        $this->locationService = $locationService;
        $this->avatarService = $avatarService;
        $this->otpService = $otpService;
        $this->SmsSender  = $sms;
    }

    public function register(Request $request, ActivityLogger $activityLogger): JsonResponse
    {
        DB::beginTransaction();
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|email:rfc,dns|unique:users,email|max:255',
                'phone' => [
                    Rule::requiredIf($request->role === 'vendor'),
                    'nullable',
                    'unique:users,phone',
                    'max:15',
                ],
                'role' => 'required|string|in:customer,vendor|max:255',
                'password' => 'required|string|min:8|max:20',
                'device_name' => 'required|string|max:255',
                'ip_address' => 'required|string|max:20',
            ]);

            $ip = $validated['ip_address'];
            $name = $validated['name'];
            $lastName = $validated['last_name'];
            $email = strtolower($validated['email']);

            $location = $this->locationService->ipInfo($ip);
            $photo = $this->avatarService->createUserAvatar($name, $lastName);

            $user = User::create([
                'name' => ucwords(strtolower($name)),
                'last_name' => ucwords(strtolower($lastName)),
                'email' => $email,
                'phone' => $validated['phone'],
                'city' => $location['city'] ?? null,
                'state' => $location['state'] ?? null,
                'country' => $location['country'] ?? null,
                'role' => $validated['role'],
                'profile_photo' => $photo,
                'password' => Hash::make($validated['password']),
            ]);

            Wallet::create(['user_id' => $user->id]);

            $activityLogger->log('New account registration', $user, $validated['device_name']);

            // defer(function () use ($email, $user) {
            Mail::to($email)->queue(new WelcomeMail($user));
            // });

            if ($validated['role'] == 'customer') {
                $this->otpService->sendEmailOtp($user);
            } else {
                $otp = mt_rand(100000, 999999);
                $messageText = "Hello {$user->name}, Your phone number confirmation code is: $otp. Thank you for choosing The African Market Hub!";
                $this->SmsSender->send($user->phone, $messageText);
            }

            DB::commit();

            return response()->json(['message' => 'Registration successful. Proceed to verify your account.', 'data' => $user], 201);
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
}
