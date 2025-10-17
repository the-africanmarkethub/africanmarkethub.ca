<?php

use App\Services\GeminiAIService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('generate:analytics', function () {
    app(GeminiAIService::class)->generateAnalytics();
    $this->info('Sales analytics generated successfully!');
})->purpose('Generate AI-powered sales analytics');

