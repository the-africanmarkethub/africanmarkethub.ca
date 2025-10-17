<?php

namespace App\Http\Controllers\Administration;

use App\Models\Banner;
use App\Models\BannerType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class BannerController extends Controller
{

    public function storeBanner(Request $request)
    {
        try {
            $validated = $request->validate([
                'type'   => 'required|integer|exists:banner_types,id',
                'banner' => 'required|file|max:5024',
            ]);

            $bannerType = BannerType::findOrFail($validated['type']);

            $dimensions = [
                'login'   => ['width' => 1440, 'height' => 400],
                'header'  => ['width' => 1920, 'height' => 500],
                'sidebar' => ['width' => 300,  'height' => 600],
            ];

            // Use type name to get dimensions, or default
            $dimension = $dimensions[$bannerType->name] ?? ['width' => 1440, 'height' => 400];

            // Fetch existing banner record
            $existing = Banner::where('type', $bannerType->id)->first();

            $imageUrl = $existing->banner ?? null;
            $image_publicId = $existing->banner_public_id ?? null;

            if ($request->hasFile('banner')) {
                if ($image_publicId) {
                    cloudinary()->destroy($image_publicId);
                }

                // Upload new banner with dynamic dimensions
                $uploadedFile = $request->file('banner')->getRealPath();
                $uploadResult = cloudinary()->upload($uploadedFile, [
                    'folder' => 'categoryImage',
                    'transformation' => [
                        'width'  => $dimension['width'],
                        'height' => $dimension['height'],
                        'crop'   => 'fill',
                    ],
                ]);

                $imageUrl = $uploadResult->getSecurePath();
                $image_publicId = $uploadResult->getPublicId();
            }

            // Create or update DB record
            Banner::updateOrCreate(
                ['type' => $bannerType->name],
                [
                    'banner'           => $imageUrl,
                    'banner_public_id' => $image_publicId,
                ]
            );

            return response()->json([
                'message' => 'Banner created or updated successfully.',
                'status'  => 'success',
            ], 201);
        } catch (\Throwable $th) {
            Log::error('Banner save failed: ' . $th->getMessage(), ['exception' => $th]);

            return response()->json([
                'message'      => 'Banner not created successfully.',
                'status'       => 'error',
                'error_detail' => $th->getMessage(),
            ], 500);
        }
    }



    public function listBanners()
    {
        try {
            $limit = min((int) request()->query('limit', 10), 100);
            $offset = (int) request()->query('offset', 0);

            $banners = Banner::latest()->skip($offset)->take($limit)->get();

            return response()->json([
                'status' => 'success',
                'data' => $banners,
                'limit' => $limit,
                'offset' => $offset,
                'total' => Banner::count(),
            ]);
        } catch (\Throwable $th) {
            Log::error('Category banner list failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json([
                'message' => 'Category banner not fetched successfully.',
                'status' => 'error',
                'error_detail' => $th->getMessage(),
            ], 500);
        }
    }
    public function deleteBanner($bannerId)
    {
        if (!$bannerId) {
            return response()->json([
                'message' => 'Banner ID is required.',
                'status' => 'error'
            ], 400);
        }

        try {
            $banner = Banner::findOrFail($bannerId);
            $banner->delete();

            return response()->json([
                'message' => 'Banner deleted successfully.',
                'status' => 'success'
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Banner deletion failed: ' . $th->getMessage(), ['exception' => $th]);

            return response()->json([
                'message' => 'Banner not deleted successfully.',
                'status' => 'error',
                'error_detail' => $th->getMessage()
            ], 500);
        }
    }

    public function storeBannerType(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:banner_types,name',
            ]);

            $bannerType = BannerType::create($validated);

            return response()->json([
                'message' => 'Banner type created successfully.',
                'status' => 'success',
                'data' => $bannerType,
            ], 201);
        } catch (\Throwable $th) {
            Log::error('Banner type creation failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json([
                'message' => 'Banner type not created successfully.',
                'status' => 'error',
                'error_detail' => $th->getMessage(),
            ], 500);
        }
    }

    public function listBannerType()
    {
        try {
            $limit = min((int) request()->query('limit', 10), 100);
            $offset = (int) request()->query('offset', 0);

            $bannerTypes = BannerType::latest()->skip($offset)->take($limit)->get();

            return response()->json([
                'status' => 'success',
                'data' => $bannerTypes,
                'limit' => $limit,
                'offset' => $offset,
                'total' => BannerType::count(),
            ]);
        } catch (\Throwable $th) {
            Log::error('Banner type list failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json([
                'message' => 'Banner type not fetched successfully.',
                'status' => 'error',
                'error_detail' => $th->getMessage(),
            ], 500);
        }
    }

    public function deleteBannerType($bannerTypeId)
    {
        if (!$bannerTypeId) {
            return response()->json([
                'message' => 'Banner type ID is required.',
                'status' => 'error'
            ], 400);
        }

        try {
            $bannerType = BannerType::findOrFail($bannerTypeId);
            $bannerType->delete();

            return response()->json([
                'message' => 'Banner type deleted successfully.',
                'status' => 'success'
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Banner type deletion failed: ' . $th->getMessage(), ['exception' => $th]);

            return response()->json([
                'message' => 'Banner type not deleted successfully.',
                'status' => 'error',
                'error_detail' => $th->getMessage()
            ], 500);
        }
    }
}
