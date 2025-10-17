<?php

namespace App\Http\Controllers\Administration;

use App\Models\City;
use App\Models\State;
use App\Models\Country;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class CountryController extends Controller
{

    public function create(Request $request)
    {
        try {
            $validated = request()->validate([
                'name' => 'required|string|unique:countries,name|max:250',
                'flag' => 'required|file|max:1024',
                'dial_code' => 'required|string',
                'currency' => 'required|string',
                'short_name' => 'required|string'
            ]);
            //process the flag image using cloundinary
            if ($request->hasFile('flag')) {
                $uploadedFile = $request->file('flag')->getRealPath();
                $uploadResult = cloudinary()->upload($uploadedFile, [
                    'folder' => 'countryFlag',
                    'transformation' => [
                        'width' => 36,
                        'height' => 19,
                        'crop' => 'fill',
                    ],
                ]);
                $flagUrl = $uploadResult->getSecurePath();
                $publicId = $uploadResult->getPublicId();
            }
            Country::create([
                'name' => $validated['name'],
                'dial_code' => $validated['dial_code'],
                'currency' => $validated['currency'],
                'short_name' => $validated['short_name'],
                'flag' => $flagUrl,
                'flag_public_id' => $publicId,
            ]);
            return response()->json(['message' => 'Country created successfully.', 'status' => 'success'], 201);
        } catch (\Throwable $th) {
            Log::error('Country creation failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json(['message' => 'Country not created successfully.', 'status' => 'error', 'error_detail' => $th->getMessage()], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/administration/countries",
     *     tags={"Administration"},
     *     summary="Get all countries",
     *     description="Retrieves all countries",
     *     @OA\Response(
     *         response=200,
     *         description="Countries retrieved successfully",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/Country")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Countries not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Country not found."),
     *             @OA\Property(property="status", type="string", example="error")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Country fetch failed",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Country not fetched successfully."),
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="error_detail", type="string", example="Exception message")
     *         )
     *     )
     * )
     */
    public function index()
    {
        try {
            $countries = Country::all();
            if ($countries->isEmpty()) {
                return response()->json([
                    'message' => 'Country not found.',
                    'status' => 'error'
                ], 404);
            }
            return response()->json([
                'status' => 'success',
                'data' => $countries
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Country fetch failed', [
                'exception' => $th
            ]);

            return response()->json([
                'message' => 'Country not fetched successfully.',
                'status' => 'error',
                'error_detail' => $th->getMessage()
            ], 500);
        }
    }
    public function location()
    {
        try {
            $countries = Country::with(['state', 'city'])->get();
            if ($countries->isEmpty()) {
                return response()->json([
                    'message' => 'Country not found.',
                    'status' => 'error'
                ], 404);
            }
            return response()->json([
                'status' => 'success',
                'data' => $countries
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Country fetch failed', [
                'exception' => $th
            ]);

            return response()->json([
                'message' => 'Country not fetched successfully.',
                'status' => 'error',
                'error_detail' => $th->getMessage()
            ], 500);
        }
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:countries,id',
            'name' => 'required|string|max:250',
            'flag' => 'nullable|string',
            'dial_code' => 'nullable|string',
            'currency' => 'nullable|string',
            'short_name' => 'nullable|string'
        ]);

        $country = Country::findOrFail($validated['id']);
        $country->name = $validated['name'];
        $country->dial_code = $validated['dial_code'];
        $country->currency = $validated['currency'];
        $country->short_name = $validated['short_name'];

        if ($request->hasFile('flag')) {
            $uploadedFile = $request->file('flag')->getRealPath();
            $uploadResult = cloudinary()->upload($uploadedFile, [
                'folder' => 'countryFlag',
                'transformation' => [
                    'width' => 36,
                    'height' => 19,
                    'crop' => 'fill',
                ],
            ]);
            $country->flag = $uploadResult->getSecurePath();
            $country->flag_public_id = $uploadResult->getPublicId();
        }

        $country->save();

        return response()->json(['message' => 'Country updated successfully.', 'status' => 'success'], 200);
    }

    public function delete(Request $request)
    {
      try {
            $validated = $request->validate([
                'id' => 'required|exists:countries,id'
            ]);

            $country = Country::findOrFail($validated['id']);
            $country->delete();

            return response()->json(['message' => 'Country deleted successfully.', 'status' => 'success'], 200);
      } catch (\Throwable $th) {
            Log::error('Country deletion failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json(['message' => 'Country not deleted successfully.', 'status' => 'error', 'error_detail' => $th->getMessage()], 500);
      }
    }

    public function createState()
    {
         try {
            $validated = request()->validate([
                'name' => 'required|string|unique:states,name|max:250',
                'country_id' => 'required|exists:countries,id',
            ]);
            State::create([
                'name' => $validated['name'],
                'country_id' => $validated['country_id'],
            ]);
       return response()->json(['message' => 'State created successfully.', 'status' => 'success'], 201);
        } catch (\Throwable $th) {
            Log::error('State creation failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json(['message' => 'State not created successfully.', 'status' => 'error', 'error_detail' => $th->getMessage()], 500);
        }
    }

    public function indexState()
    {
        try {
            $countries = State::all();
            if ($countries->isEmpty()) {
                return response()->json([
                    'message' => 'States not found.',
                    'status' => 'error'
                ], 404);
            }
            return response()->json([
                'status' => 'success',
                'data' => $countries
            ], 200);
        } catch (\Throwable $th) {
            Log::error('State fetch failed', [
                'exception' => $th
            ]);

            return response()->json([
                'message' => 'State not fetched successfully.',
                'status' => 'error',
                'error_detail' => $th->getMessage()
            ], 500);
        }
    }
   
    public function deleteState(Request $request)
    {
        try {
            $validated = $request->validate([
                'id' => 'required|exists:states,id'
            ]);

            $state = State::findOrFail($validated['id']);
            $state->delete();

            return response()->json(['message' => 'State deleted successfully.', 'status' => 'success'], 200);
        } catch (\Throwable $th) {
            Log::error('State deletion failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json(['message' => 'State not deleted successfully.', 'status' => 'error', 'error_detail' => $th->getMessage()], 500);
        }
    }

    public function indexCity()
    {
        try {
            $countries = City::all();
            if ($countries->isEmpty()) {
                return response()->json([
                    'message' => 'City not found.',
                    'status' => 'error'
                ], 404);
            }
            return response()->json([
                'status' => 'success',
                'data' => $countries
            ], 200);
        } catch (\Throwable $th) {
            Log::error('City fetch failed', [
                'exception' => $th
            ]);

            return response()->json([
                'message' => 'City not fetched successfully.',
                'status' => 'error',
                'error_detail' => $th->getMessage()
            ], 500);
        }
    }

    public function createCity()
    {
        try {
            $validated = request()->validate([
                'name' => 'required|string|unique:cities,name|max:250',
                'state_id' => 'required|exists:states,id',
                'country_id' => 'required|exists:countries,id',
            ]);
            City::create([
                'name' => $validated['name'],
                'state_id' => $validated['state_id'],
                'country_id' => $validated['country_id'],
            ]);
            return response()->json(['message' => 'City created successfully.', 'status' => 'success'], 201);
        } catch (\Throwable $th) {
            Log::error('City creation failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json(['message' => 'City not created successfully.', 'status' => 'error', 'error_detail' => $th->getMessage()], 500);
        }
    }

    public function deleteCity(Request $request)
    {
        try {
            $validated = $request->validate([
                'id' => 'required|exists:states,id'
            ]);

            $state = City::findOrFail($validated['id']);
            $state->delete();

            return response()->json(['message' => 'City deleted successfully.', 'status' => 'success'], 200);
        } catch (\Throwable $th) {
            Log::error('City deletion failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json(['message' => 'City not deleted successfully.', 'status' => 'error', 'error_detail' => $th->getMessage()], 500);
        }
    }
}
