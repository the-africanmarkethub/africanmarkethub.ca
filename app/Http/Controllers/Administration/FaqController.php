<?php

namespace App\Http\Controllers\Administration;

use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class FaqController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type');
        $offset = (int) $request->query('offset', 0);
        $limit = (int) $request->query('limit', 10);
        $search = $request->query('search');

        $query = Faq::when($type, fn($q) => $q->where('type', $type))
            ->when($search, function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('question', 'like', "%{$search}%")
                        ->orWhere('answer', 'like', "%{$search}%");
                });
            });

        $total = $query->count();

        $faqs = $query
            ->offset($offset)
            ->limit($limit)
            ->latest()
            ->get();

        return response()->json([
            'total' => $total,
            'offset' => $offset,
            'limit' => $limit,
            'data' => $faqs
        ]);
    }




    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'status' => 'in:active,inactive',
            'type' => 'in:customer,vendor,system|required'
        ]);

        $faq = Faq::create($validated);

        return response()->json(['status' => 'success', 'message' => 'FAQ created successfully']);
    }


    public function update(Request $request, $id)
    {
        // log the incoming rrequest
        Log::info('Faq update request received', [
            'request' => $request->all()
        ]);

        $faq = Faq::findOrFail($id);

        $validated = $request->validate([
            'question' => 'sometimes|string|max:255',
            'answer' => 'sometimes|string',
            'status' => 'in:active,inactive',
            'type' => 'in:customer,vendor,system|sometimes'
        ]);

        $faq->update($validated);

        return response()->json([
            'message' => 'FAQ updated successfully',
            'data' => $faq
        ]);
    }

    public function destroy($id)
    {
        $faq = Faq::findOrFail($id);
        $faq->delete();

        return response()->json(['status' => 'success', 'message' => 'FAQ deleted']);
    }
}
