<?php

namespace App\Console;

use App\Jobs\DeleteOldUsers;
use App\Services\GeminiAIService;
use Illuminate\Support\Facades\Log;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     */
    protected $commands = [];

    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Debugging log to ensure schedule is running
        $schedule->call(function () {
            Log::info('Scheduler is running...');
        })->everyMinute();

        // Schedule the AI analytics generation daily
        $schedule->call(fn() => app(GeminiAIService::class)->generateAnalytics())->daily();

        // Ensure DeleteOldUsers job is scheduled
        $schedule->job(new DeleteOldUsers())->everyMinute();

    }
    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
} 
