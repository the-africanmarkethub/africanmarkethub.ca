<?php

namespace App\Http\Controllers\Administration;

use App\Models\Size;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SizeController extends Controller
{
    /**
     * Display a listing of the sizes.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $offset = (int) $request->get('offset', 0);
        $limit = (int) $request->get('limit', 10);

        $sizes = Size::offset($offset)
            ->limit($limit)
            ->get();

        $total = Size::count();

        return response()->json([
            'data' => $sizes,
            'total' => $total,
            'offset' => $offset,
            'limit' => $limit
        ], 200);
    }

    /**
     * Store a newly created size in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|unique:sizes,name|max:255',
            ]);

            $size = Size::create([
                'name' => ucwords($request->name),
            ]);

            return response()->json([
                'data' => $size,
                'status' => 'success',
                'message' => 'Size created successfully'
            ], 201);
        } catch (\Throwable $th) {
            return response()->json([
                'error_detail' => $th->getMessage(),
                'status' => 'success',
                'message' => 'Size not created successfully'
            ], 500);
        }
    }

    /**
     * Display the specified size.
     *
     * @param  \App\Models\Size  $size
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Size $size)
    {
        return response()->json([
            'data' => $size,
            'status' => 'success',
            'message' => 'Size retrieved successfully'
        ], 200);
    }

    /**
     * Update the specified size in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Size  $size
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Size $size)
    {
        try {
            $request->validate([
                'name' => 'required|string|unique:sizes,name,' . $size->id . '|max:255',
            ]);

            $size->update([
                'name' => $request->name,
            ]);

            return response()->json([
                'data' => $size,
                'status' => 'success',
                'message' => 'Size updated successfully'
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'error_detail' => $th->getMessage(),
                'status' => 'success',
                'message' => 'Size not updated successfully'
            ], 500);
        }
    }

    /**
     * Remove the specified size from storage.
     *
     * @param  \App\Models\Size  $size
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Size $size)
    {
        $size->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Size deleted successfully'
        ], 200);
    }
}
