<?php

namespace App\Services;

use App\Contracts\SmsSender;
use Twilio\Rest\Client;
use Illuminate\Support\Arr;

class TwilioSmsService implements SmsSender
{
    public function __construct(private Client $client) {}

    public function send(string $to, string $message, array $options = []): string
    {
        $from = config('twilio.from');
        $messagingServiceSid = config('twilio.messaging_service_sid');

        $payload = ['body' => $message, 'to' => $to];

        if ($messagingServiceSid) {
            $payload['messagingServiceSid'] = $messagingServiceSid;
        } else {
            $payload['from'] = $from;
        }

        $payload = array_merge($payload, Arr::only($options, ['statusCallback', 'mediaUrl']));

        $msg = $this->client->messages->create($to, $payload);

        return $msg->sid;
    }

    // Optional: WhatsApp helper
    public function sendWhatsApp(string $to, string $message, array $options = []): string
    {
        // Ensure correct format
        $to = str_starts_with($to, 'whatsapp:') ? $to : 'whatsapp:' . $to;

        $messagingServiceSid = config('twilio.messaging_service_sid');
        $from = config('twilio.from');

        $payload = ['body' => $message];

        if ($messagingServiceSid) {
            $payload['messagingServiceSid'] = $messagingServiceSid;
        } else {
            $payload['from'] = 'whatsapp:' . $from;
        }

        $payload = array_merge($payload, \Illuminate\Support\Arr::only($options, ['statusCallback', 'mediaUrl']));

        $msg = $this->client->messages->create($to, $payload);

        return $msg->sid;
    }


    // Optional: OTP (Verify)
    public function startOtp(string $to, string $channel = 'sms'): string
    {
        $verifySid = config('twilio.verify_sid');
        $verification = $this->client->verify->v2->services($verifySid)->verifications->create($to, $channel);
        return $verification->sid;
    }

    public function checkOtp(string $to, string $code): bool
    {
        $verifySid = config('twilio.verify_sid');
        $check = $this->client->verify->v2->services($verifySid)->verificationChecks->create(['to' => $to, 'code' => $code]);
        return $check->status === 'approved';
    }
}
