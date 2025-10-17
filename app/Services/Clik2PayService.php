<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class Clik2PayService
{
    protected string $apiBaseUrl;
    protected string $apiToken;
    protected string $apiKey;
    protected string $basicAuthCredentials;

    public function __construct()
    {
        $this->apiBaseUrl = config('services.clik2pay.base_url');
        $this->apiToken = config('services.clik2pay.api_token');
        $this->apiKey = config('services.clik2pay.api_key');
        $this->basicAuthCredentials = base64_encode(
            config('services.clik2pay.username') . ':' . config('services.clik2pay.password')
        );
    }

    /**
     * Retrieve and cache bearer token.
     */
    protected function getAccessToken(): string
    {
        return Cache::remember('clik2pay_access_token', 3500, function () {
            $response = Http::asForm()->post($this->apiToken, [
                'grant_type'    => 'client_credentials',
                'client_id'     => config('services.clik2pay.username'),
                'client_secret' => config('services.clik2pay.password'),
                'scope'         => 'payment_request/all',
            ]);

            if ($response->failed()) {
                Log::error('Clik2Pay Auth Failed', [
                    'status' => $response->status(),
                    'body'   => $response->body(),
                ]);
                throw new Exception("Clik2Pay Auth error: " . $response->body());
            }

            $data = $response->json();
            return $data['access_token'] ?? throw new Exception('Invalid auth response.');
        });
    }


    /**
     * Create a payment request.
     */
    public function createPaymentRequest(array $payload): array
    {
        $token = $this->getAccessToken();

        Log::info('Creating Clik2Pay Payment Request', [
            'payload' => $payload,
            'token'   => $token,
        ]);
        $url = "{$this->apiBaseUrl}/payment-requests";

        $response = Http::withHeaders([
            'accept'         => 'application/json',
            'authorization' => "Bearer {$token}",
            'content-type'  => 'application/json',
            'x-api-key'     => $this->apiKey,
        ])->post($url, $payload);

        if ($response->failed()) {
            Log::error('Clik2Pay Payment Request Failed', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
            throw new Exception("Clik2Pay Payment Request failed: " . $response->body());
        }

        return $response->json();
    }
}
