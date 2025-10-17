<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Twilio\Rest\Client as TwilioClient;
use App\Contracts\SmsSender;
use App\Services\TwilioSmsService;

class TwilioServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(TwilioClient::class, function () {
            return new TwilioClient(config('twilio.account_sid'), config('twilio.auth_token'));
        });

        $this->app->bind(SmsSender::class, function ($app) {
            return new TwilioSmsService($app->make(TwilioClient::class));
        });
    }

    public function boot(): void {}
}
