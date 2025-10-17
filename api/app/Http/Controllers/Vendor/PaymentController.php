<?php

namespace App\Http\Controllers\Vendor;

use Carbon\Carbon;
use App\Models\Shop;
use App\Models\Transaction;
use Illuminate\Support\Str;
use Jenssegers\Agent\Agent;
use App\Models\Subscription;
use Illuminate\Http\Request;
use App\Services\ActivityLogger;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class PaymentController extends Controller
{
    private $apiUsername;
    private $apiPassword;
    private $apiKey;
    private $region = 'us-east-1'; // Adjust based on Clik2pay's server location

    public function __construct()
    {
        $this->apiUsername = env('CLIK2PAY_API_USERNAME');
        $this->apiPassword = env('CLIK2PAY_API_PASSWORD');
        $this->apiKey = env('CLIK2PAY_API_KEY');
    }

    public function makePayment(Request $request, ActivityLogger $activityLogger)
    {
        $validated = $request->validate([
            'subscription_id' => 'required|exists:subscriptions,id',
        ]);

        $shop = Shop::where('vendor_id', Auth::id())->first();
        if (!$shop) {
            return response()->json(['message' => 'Shop not found'], 404);
        }

        $subscription = Subscription::findOrFail($validated['subscription_id']);

        $bearerToken = $this->getBearerToken();
        if (!$bearerToken) {
            return response()->json(['message' => 'Failed to obtain Bearer token'], 500);
        }

        $paymentResponse = $this->makePaymentRequest($bearerToken, $validated['subscription_id'], $subscription->price);
        if ($paymentResponse->failed()) {
            Log::error('Payment request failed', ['response' => $paymentResponse->json()]);
            return response()->json(['message' => 'Payment request failed', 'errors' => $paymentResponse->json()], 500);
        }

        $reference = Str::upper(Str::slug("AFRMARHUB|{$shop->id}|{$validated['subscription_id']}|" . Carbon::now()->format('YmdHis')));

        Transaction::create([
            'reference' => $reference,
            'initiated_by' => $shop->vendor_id,
            'amount' => $subscription->price,
            'status' => 'pending',
            'type' => 'subscription',
            'description' => "Vendor initiated subscription payment for shop: {$shop->name} for an amount of USD{$subscription->price}",
            'transaction_data' => $paymentResponse->json(),
        ]);

        $agent = new Agent();
        $device = $agent->device();
        $platform = $agent->platform();
        $browser = $agent->browser();

        $deviceInfo = "$device on $platform using $browser";
        $activityLogger->log('Vendor initiated subscription payment for shop: {$shop->name} for an amount of USD{$subscription->price}', Auth::user(), $deviceInfo);

        return response()->json(['message' => 'Subscription payment successful'], 200);
    }

    private function getBearerToken()
    {
        $method = 'POST';
        $uri = '/open/v1/oauth2/token';
        $host = 'api.sandbox.clik2pay.com';
        $region = 'us-east-1';
        $content_type = 'application/x-www-form-urlencoded';
        $request_parameters = [
            'grant_type' => 'client_credentials',
            'scope' => 'payment_request/all',
        ];

        $amzDate = $this->amzDate();
        $amzDateShort = $this->amzDate('Ymd');
        $payloadHash = hash('sha256', http_build_query($request_parameters));

        $canonicalHeaders = "content-type:$content_type\nhost:$host\nx-amz-date:$amzDate\n";
        $signedHeaders = 'content-type;host;x-amz-date';
        $canonicalRequest = "$method\n$uri\n\n$canonicalHeaders\n$signedHeaders\n$payloadHash";

        $credentialScope = "$amzDateShort/$region/execute-api/aws4_request";
        $stringToSign = "AWS4-HMAC-SHA256\n$amzDate\n$credentialScope\n" . hash('sha256', $canonicalRequest);

        $signingKey = $this->getSignatureKey($this->apiPassword, $amzDateShort, $region, 'execute-api');
        $signature = hash_hmac('sha256', $stringToSign, $signingKey);

        $authorizationHeader = "AWS4-HMAC-SHA256 Credential={$this->apiUsername}/$credentialScope, SignedHeaders=$signedHeaders, Signature=$signature";

        $response = Http::withHeaders([
            'Content-Type' => $content_type,
            'X-Amz-Date' => $amzDate,
            'Authorization' => $authorizationHeader,
        ])->asForm()->post("https://$host$uri", $request_parameters);

        if ($response->successful()) {
            return $response->json()['access_token'];
        }

        Log::error('Failed to obtain Bearer token', ['response' => $response->json()]);
        return null;
    }

// ... (amzDate and getSignatureKey methods remain the same)

    private function amzDate($format = 'Ymd\THis\Z')
    {
        return gmdate($format);
    }

    private function getSignatureKey($key, $dateStamp, $regionName, $serviceName)
    {
        $kDate = hash_hmac('sha256', $dateStamp, 'AWS4' . $key, true);
        $kRegion = hash_hmac('sha256', $regionName, $kDate, true);
        $kService = hash_hmac('sha256', $serviceName, $kRegion, true);
        $kSigning = hash_hmac('sha256', 'aws4_request', $kService, true);
        return $kSigning;
    }
    private function makePaymentRequest($bearerToken, $subscriptionId, $amount)
    {
        $host = 'api.clik2pay.com';
        $uri = '/payments';

        return Http::withHeaders([
            'x-api-key' => $this->apiKey,
            'Authorization' => "Bearer {$bearerToken}",
        ])->post("https://$host$uri", [
            'subscription_id' => $subscriptionId,
            'amount' => $amount,
        ]);
    }
    
}
