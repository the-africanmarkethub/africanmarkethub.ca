<?php

namespace App\Http\Controllers;

use App\Models\Tutorial;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Log;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class TutorialController extends Controller
{
    public function index(Request $request)
    {
        $type   = $request->query('type');
        $search = $request->query('search');
        $limit  = (int) $request->query('limit', 10);
        $offset = (int) $request->query('offset', 0);

        $query = Tutorial::query()
            ->where('status', 'active')
            ->when($type, fn($q) => $q->where('type', $type))
            ->when(
                $search,
                fn($q, $search) =>
                $q->where(function ($sub) use ($search) {
                    $sub->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                })
            );

        $total = (clone $query)->count();

        $tutorials = $query
            ->offset($offset)
            ->limit($limit)
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'data'   => $tutorials,
            'total'  => $total,
            'limit'  => $limit,
            'offset' => $offset,
        ]);
    }



    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'video_url' => 'nullable|url',
            'type' => 'required|in:vendor,customer,system',
            'status' => 'in:active,inactive',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:9048',
        ]);

        try {
            if ($request->hasFile('image')) {
                $upload = Cloudinary::upload($request->file('image')->getRealPath(), [
                    'folder' => 'tutorialImages',
                    'transformation' => ['width' => 600, 'height' => 400, 'crop' => 'fill']
                ]);

                $validated['image_url'] = $upload->getSecurePath();
                $validated['image_public_id'] = $upload->getPublicId();
            }

            $tutorial = Tutorial::create($validated);

            return response()->json([
                'status' => 'success',
                'data' => $tutorial
            ], 201);
        } catch (\Exception $e) {
            Log::error('Tutorial creation failed: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to upload image or create tutorial'
            ], 500);
        }
    }


    public function update(Request $request, $id)
    {
        $tutorial = Tutorial::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'video_url' => 'nullable|url',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:9048',
            'type' => 'sometimes|in:vendor,customer,system',
            'status' => 'in:active,inactive'
        ]);

        $tutorial->update($validated);

        return response()->json(['status' => 'success', 'data' => $tutorial]);
    }

    public function destroy($id)
    {
        $tutorial = Tutorial::findOrFail($id);
        $tutorial->delete();

        return response()->json(['status' => 'success', 'message' => 'Tutorial deleted']);
    }
    public function show($id)
    {
        $tutorial = Tutorial::findOrFail($id);

        return response()->json(['status' => 'success', 'data' => $tutorial]);
    }
}
