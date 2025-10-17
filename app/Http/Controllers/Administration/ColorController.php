<?php

namespace App\Http\Controllers\Administration;

use App\Models\Color;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ColorController extends Controller
{
    /**
     * Display a listing of the colors.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $offset = (int) $request->get('offset', 0);
        $limit = (int) $request->get('limit', 10);

        $colors = Color::offset($offset)
            ->limit($limit)
            ->get();

        $total = Color::count();

        return response()->json([
            'data' => $colors,
            'total' => $total,
            'offset' => $offset,
            'limit' => $limit
        ], 200);
    }


    /**
     * Store a newly created color in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:colors,name|max:255',
            'hexcode' => 'required|string',
        ]);

        $color = Color::create([
            'name' => ucwords($request->name),
            'hexcode' => $request->hexcode,
        ]);

        return response()->json([
            'data' => $color,
            'status' => 'success',
            'message' => 'Color created successfully'
        ], 201);
    }

    /**
     * Display the specified color.
     *
     * @param  \App\Models\Color  $color
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Color $color)
    {
        return response()->json([
            'data' => $color,
            'status' => 'success',
            'message' => 'Color retrieved successfully'
        ], 200);
    }

    /**
     * Update the specified color in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Color  $color
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Color $color)
    {
        $request->validate([
            'name' => 'required|string|unique:colors,name,' . $color->id . '|max:255',
            'hexcode' => 'required|string',
        ]);

        $color->update([
            'name' => $request->name,
            'hexcode' => $request->hexcode,
        ]);

        return response()->json([
            'data' => $color,
            'status' => 'success',
            'message' => 'Color updated successfully'
        ], 200);
    }

    /**
     * Remove the specified color from storage.
     *
     * @param  \App\Models\Color  $color
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Color $color)
    {
        $color->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Color deleted successfully'
        ], 200);
    }
}
