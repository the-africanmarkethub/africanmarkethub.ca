<?php

namespace App\Http\Controllers\Customer;

 use App\Models\Communication;
use Jenssegers\Agent\Agent;
use App\Services\ActivityLogger;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class CommunicationSettings extends Controller
{
    public function communicationPreferences()
    {
        try {
            $user_id = Auth::id();
            $communication = Communication::where('user_id', $user_id)->first();
            if ($communication) {
                return response()->json(['message' => 'Communication Preference found.', 'status' => 'success', 'data' => $communication], 200);
            } else {
                return response()->json(['message' => 'Communication Preference not found.', 'status' => 'error'], 404);
            }
         
        } catch (\Throwable $th) {
            Log::error('Communication Preference failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json(['message' => 'Something went wrong. Try again later', 'status' => 'error', 'error_detail' => $th->getMessage()], 500);
        }
    }
    public function createOrUpdate(ActivityLogger $activityLogger)
    {
        try {
            $validated = request()->validate([
                'marketing_emails' => 'nullable|in:true,false',
                'new_products' => 'nullable|in:true,false',
                'promotions' => 'nullable|in:true,false',
                'push_notification' => 'nullable|in:true,false',
                'email_notification' => 'nullable|in:true,false',
                'sms_notification' => 'nullable|in:true,false',
                'events' => 'nullable|in:true,false',
            ]);

            // Convert "true"/"false" strings to actual boolean values
            foreach ($validated as $key => $value) {
                $validated[$key] = filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            }

            $user_id = Auth::id();
            Communication::updateOrCreate(
                ['user_id' => $user_id],
                array_merge($validated, ['user_id' => $user_id])
            );
            $agent = new Agent();
            $device = $agent->device();
            $platform = $agent->platform();
            $browser = $agent->browser();

            $deviceInfo = "$device on $platform using $browser";
            $activityLogger->log('User set communication preference successfully', Auth::user(), $deviceInfo);
            return response()->json(['message' => 'Communication preference saved successfully.', 'status' => 'success'], 200);
        } catch (\Throwable $th) {
            Log::error('Communication Preference creation failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json(['message' => 'Something went wrong. Try again later', 'status' => 'error', 'error_detail' => $th->getMessage()], 500);
        }
    }
  
}
