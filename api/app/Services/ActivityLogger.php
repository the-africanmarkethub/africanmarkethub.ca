<?php

namespace App\Services;

use Jenssegers\Agent\Agent;
use App\Models\UserActivity;
use Illuminate\Support\Facades\Log;

class ActivityLogger
{
    public function log($activity, $user, $device = null)
    {
        try {
            $ip = request()->getClientIp();
            $userAgent = request()->header('User-Agent');
            $agent = new Agent();
            $agent->setUserAgent($userAgent);
            $deviceDetails = $this->getDeviceDetails($agent);

            $deviceJson = json_encode($device ?? $deviceDetails);

            UserActivity::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'role' => $user->role,
                    'login_time' => now(),
                    'activity' => $activity ?? 'Login',
                    'ip' => $ip,
                    'location' => $this->getLocation($user),
                    'device' => $deviceJson,
                ]
            );
        } catch (\Throwable $th) {
            Log::error("Failed to log activity for user {$user->id}: " . $th->getMessage(), ['exception' => $th]);
        }
    }

    protected function getDeviceDetails(Agent $agent): string
    {
        $device = $agent->device() ?: 'Unknown Device';
        $browser = $agent->browser() ?: 'Unknown Browser';
        $browserVersion = $agent->version($browser) ?: 'Unknown Version';
        $platform = $agent->platform() ?: 'Unknown Platform';
        $platformVersion = $agent->version($platform) ?: 'Unknown Version';

        return "Device: {$device}, Browser: {$browser} {$browserVersion}, Platform: {$platform} {$platformVersion}";
    }

    protected function getLocation($user): string
    {
        $city = $user->city ?? 'Unknown City';
        $state = $user->state ?? 'Unknown State';
        $country = $user->country ?? 'Unknown Country';

        return "{$city}, {$state}, {$country}";
    }
}
