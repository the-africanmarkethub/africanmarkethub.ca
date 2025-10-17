<?php

namespace App\Jobs;

use Carbon\Carbon;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

class DeleteOldUsers implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $users = User::onlyTrashed()
        ->where('deleted_at', '<=', Carbon::now()->subMinutes(1))
            // ->where('deleted_at', '<=', Carbon::now()->subDays(30))
            ->get();

            foreach ($users as $user) {
            $user->forceDelete();
            Log::info('DeleteOldUsers job is running...');
        }
    }
}
