<?php

namespace App\Http\Controllers\Administration;

use App\Models\AppSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class AppSettingController extends Controller
{
    public function index()
    {
        return response()->json([
            'message' => 'App settings index page',
            'data' =>  AppSettings::all(),
            'status' => 'success'
        ], 200);
    }

    public function create(Request $request)
    {
        try {
            $validated = $request->validate([
                'app_name' => 'nullable|string|max:255',
                'app_description' => 'nullable|string',
                'app_logo' => 'nullable',
                'support_phone' => 'nullable|string',
                'support_email' => 'nullable|email',
            ]);

            $logoUrl = $this->uploadAppLogo($request);

            $appSettingsData = [
                'app_name' => isset($validated['app_name']) ? ucwords($validated['app_name']) : null,
                'app_description' => $validated['app_description'] ?? null,
                'app_logo' => $logoUrl,
                'support_phone' => $validated['support_phone'] ?? null,
                'support_email' => $validated['support_email'] ?? null,
            ];

            // Assuming only one row should ever exist, we use id = 1 as the static record
            $appSettings = AppSettings::updateOrCreate(
                ['id' => 1],
                $appSettingsData
            );

            return response()->json([
                'status' => 'success',
                'message' => 'App settings saved successfully',
                'data' => $appSettings
            ], 200);
        } catch (\Throwable $th) {
            Log::error('App settings creation failed: ' . $th->getMessage(), [
                'exception' => $th,
                'request' => $request->all(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'App settings not saved',
                'error_detail' => $th->getMessage()
            ], 500);
        }
    }



    private function uploadAppLogo(Request $request): string
    {
        if ($request->hasFile('app_logo')) {

            $uploadedFile = $request->file('app_logo')->getRealPath();

            $uploadResult = cloudinary()->upload($uploadedFile, [
                'folder' => 'appLogo',
                'transformation' => [
                    'width' => 150,
                    'height' => 40,
                    'crop' => 'fill',
                ],
            ]);

            return $uploadResult->getSecurePath();
        }
        return '';
    }
}
