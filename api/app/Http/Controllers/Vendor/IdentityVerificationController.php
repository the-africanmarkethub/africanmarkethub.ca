<?php

namespace App\Http\Controllers\Vendor;

use Jenssegers\Agent\Agent;
use Illuminate\Http\Request;
use App\Services\ActivityLogger;
use App\Http\Controllers\Controller;
use App\Models\IdentityVerification;
use Illuminate\Support\Facades\Auth;

class IdentityVerificationController extends Controller
{
    // list all verified identity verifications and return json response
    public function list()
    {
        $identityVerifications = IdentityVerification::all();
        return response()->json([
            'status' => 'success',
            'identity_verifications' => $identityVerifications,
        ], 200);
    }

    // store all identity verifications and return json response
    public function store(Request $request, ActivityLogger $activityLogger)
    {
        $user = Auth::user();

        // Validate the request
        $request->validate([
            'document_type' => 'required|string|max:255,in:identity_card,passport,driver_license',
            'document_number' => 'nullable|string|max:255',
            'document_front' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'document_back' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'document_selfie' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Ensure at least one document is provided
        if (
            !$request->hasFile('document_front') &&
            !$request->hasFile('document_back') &&
            !$request->hasFile('document_selfie')
        ) {
            return response()->json(['error' => 'At least one document is required.'], 422);
        }

        // Handle file uploads and store file paths
        $uploadedFiles = [];
        if ($request->hasFile('document_front')) {
            $uploadedFiles['document_front'] = $this->uploadFileToCloudinary($request->file('document_front'), 'identity_verifications')->getSecurePath();
        }
        if ($request->hasFile('document_back')) {
            $uploadedFiles['document_back'] = $this->uploadFileToCloudinary($request->file('document_back'), 'identity_verifications')->getSecurePath();
        }
        if ($request->hasFile('document_selfie')) {
            $uploadedFiles['document_selfie'] = $this->uploadFileToCloudinary($request->file('document_selfie'), 'identity_verifications')->getSecurePath();
        }

        // Create the IdentityVerification record
        $identityVerification = IdentityVerification::create(array_merge(
            [
                'user_id' => $user->id,
            ],

            $request->only(['document_type', 'document_number']),
            $uploadedFiles
        ));
        $agent = new Agent();
        $device = $agent->device();
        $platform = $agent->platform();
        $browser = $agent->browser();

        $deviceInfo = "$device on $platform using $browser";
        $activityLogger->log('Vendor Identity verification created successfully', Auth::user(), $deviceInfo);

        return response()->json([
            'status' => 'success',
            'message' => 'Identity verification created successfully.',
            'identity_verification' => $identityVerification,
        ], 201);

    }

    private function uploadFileToCloudinary($file, string $folder)
    {
        $uploadResult = cloudinary()->upload($file->getRealPath(), [
            'folder' => $folder,

            'transformation' => [
                'width' => 1500,
                'height' => 1500,
                'crop' => 'fill',
            ],
        ]);

        return $uploadResult;

    }
    //fundtion to delete identity verification
    public function delete($id)
    {
        $identityVerification = IdentityVerification::find($id);

        if (!$identityVerification) {
            return response()->json(['error' => 'Identity verification not found.'], 404);
        }

        $identityVerification->delete();

        return response()->json(['message' => 'Identity verification deleted successfully.'], 200);
    }
    //function to update identity verification
    public function update(Request $request, $id, ActivityLogger $activityLogger)
    {
        $identityVerification = IdentityVerification::find($id);

        if (!$identityVerification) {
            return response()->json(['error' => 'Identity verification not found.'], 404);
        }

        $request->validate([
            'document_type' => 'required|string|max:255',
            'document_number' => 'nullable|string|max:255',
            'document_front' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'document_back' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'document_selfie' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('document_front')) {
            $identityVerification->document_front = $this->uploadFileToCloudinary($request->file('document_front'), 'identity_verifications')->getSecurePath();
        }
        if ($request->hasFile('document_back')) {
            $identityVerification->document_back = $this->uploadFileToCloudinary($request->file('document_back'), 'identity_verifications')->getSecurePath();
        }
        if ($request->hasFile('document_selfie')) {
            $identityVerification->document_selfie = $this->uploadFileToCloudinary($request->file('document_selfie'), 'identity_verifications')->getSecurePath();
        }

        $identityVerification->document_type = $request->input('document_type');
        $identityVerification->document_number = $request->input('document_number');        
        $identityVerification->save();

        $agent = new Agent();
        $device = $agent->device();
        $platform = $agent->platform();
        $browser = $agent->browser();

        $deviceInfo = "$device on $platform using $browser";
        $activityLogger->log('Vendor Identity verification updated successfully', Auth::user(), $deviceInfo);
        return response()->json(['message' => 'Identity verification updated successfully.'], 200);
    }

}
