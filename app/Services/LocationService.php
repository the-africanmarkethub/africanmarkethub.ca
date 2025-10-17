<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class LocationService
{
    public function ipInfo(string $clientIp): ?array
    {
        try {
            // Use a reliable IP Geolocation API (e.g., ipinfo.io, ipapi.co)
            $apiKey = env('IPINFO');
            $response = Http::get("https://ipinfo.io/{$clientIp}?token={$apiKey}");

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'city' => $data['city'] ?? null,
                    'state' => $data['region'] ?? null,
                    'country' => $data['country'] ?? null,
                ];
            } else {
                Log::warning("Failed to retrieve location from ipinfo.io for IP: {$clientIp}. Status: " . $response->status());
                return $this->getLocation($clientIp);
            }
        } catch (\Throwable $th) {
            Log::error("Error retrieving location from ipinfo.io for IP: {$clientIp}. " . $th->getMessage(), ['exception' => $th]);
            return $this->getLocation($clientIp);
        }
    }

    private function getLocation(string $clientIp): ?array
    {
        try {
            // Attempt the first API call to api.ip2location.io
            $apiKey = env('IP2LOCATION_API_KEY');
            $response = Http::get("https://api.ip2location.io/?key={$apiKey}&ip={$clientIp}&format=json");

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'city' => $data['city_name'] ?? '',
                    'state' => $data['region_name'] ?? '',
                    'country' => $data['country_code'] ?? '',
                ];
            } else {
                Log::warning("Failed to retrieve location from api.ip2location.io for IP: {$clientIp}. Status: " . $response->status());
                return null;
            }
        } catch (\Throwable $th) {
            Log::error("Error retrieving location from api.ip2location.io for IP: {$clientIp}. " . $th->getMessage(), ['exception' => $th]);
            return null;
        }
    }
}
