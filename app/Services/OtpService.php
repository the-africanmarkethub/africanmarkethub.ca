<?php

namespace App\Services;

use App\Models\User;
use App\Mail\OtpMail;
use App\Models\AdminUser;
use App\Models\OtpVerification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Twilio\Rest\Client;

class OtpService
{
    public function sendEmailOtp(User $user): void
    {
        try {
            $otp = random_int(100000, 999999);
            OtpVerification::updateOrCreate(
                ['email' => $user->email],
                ['otp' => $otp]
            );

            // Defer sending email to avoid blocking
            // defer(function () use ($user, $otp) {
                Mail::to($user->email)->queue(new OtpMail($otp, $user));
            // });

            Log::info("Email OTP sent to {$user->email}");
        } catch (\Throwable $th) {
            Log::error("Failed to send Email OTP to {$user->email}: " . $th->getMessage(), ['exception' => $th]);
        }
    }
    public function sendAdminEmailOtp(AdminUser $user): void
    {
        try {
            $otp = random_int(100000, 999999);
            OtpVerification::updateOrCreate(
                ['email' => $user->email],
                ['otp' => $otp]
            );

            // Defer sending email to avoid blocking
            // defer(function () use ($user, $otp) {
                Mail::to($user->email)->queue(new OtpMail($otp, $user));
            // });

            Log::info("Email OTP sent to {$user->email}");
        } catch (\Throwable $th) {
            Log::error("Failed to send Email OTP to {$user->email}: " . $th->getMessage(), ['exception' => $th]);
        }
    }

    public function sendPhoneOtp(User $user): void
    {
        $otp = mt_rand(100000, 999999);
        $messageText = "Hello {$user->name}, Your phone number confirmation code is: $otp. Thank you for choosing The African Market Hub!";

        OtpVerification::updateOrCreate(
            ['phone' => $user->phone],
            ['otp' => $otp]
        );

        if ($this->sendOtpViaTwilio($user->phone, $messageText)) {
            return;
        }


        Log::error("Failed to send SMS OTP via both Twilio User phone: {$user->phone}");
        throw new \Exception('Failed to send SMS OTP via both Twilio');
    }

    private function sendOtpViaTwilio(string $phone, string $messageText): bool
    {
        try {
            $twilioSid = config('services.twilio.sid');
            $twilioToken = config('services.twilio.token');
            $twilioFrom = config('services.twilio.from');

            $twilio = new Client($twilioSid, $twilioToken);
            $message = $twilio->messages->create($phone, [
                'from' => $twilioFrom,
                'body' => $messageText,
            ]);

            Log::info("SMS OTP sent to {$phone} via Twilio. SID: {$message->sid}");
            return true;
        } catch (\Throwable $th) {
            Log::warning("Failed to send SMS OTP via Twilio: " . $th->getMessage(), ['exception' => $th]);
            return false;
        }
    }


}
