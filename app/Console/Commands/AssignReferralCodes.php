<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Console\Command;

class AssignReferralCodes extends Command
{
    protected $signature = 'referrals:assign-codes';

    protected $description = 'Assign referral codes to users without one';

    public function handle()
    {
        $users = User::whereNull('referral_code')->get();
        $count = 0;

        foreach ($users as $user) {
            do {
                $code = strtoupper(Str::random(8));
            } while (User::where('referral_code', $code)->exists());

            $user->referral_code = $code;
            $user->save();
            $count++;
        }

        $this->info("Referral codes assigned to {$count} users.");
    }
}
