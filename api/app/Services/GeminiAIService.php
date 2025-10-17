<?php

namespace App\Services;

use App\Models\Order;
use App\Models\ProductInsight;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class GeminiAIService
{
    protected $apiKey;

    public function __construct()
    {
        $this->apiKey = env('GEMINI_API_KEY');
    }

    /**
     * Generate sales analytics and predictions using Gemini AI
     */
    public function generateAnalytics()
    {
        // Fetch order data
        $orders = Order::with(['customer', 'orderItems.product'])->get();

        // Prepare data for Gemini AI
        $requestData = $this->prepareDataForAI($orders);

        // Call Gemini AI
        $response = $this->callGeminiAPI($requestData);

        // Store response for vendors and admins
        return $this->storeInsights($response);
    }

    /**
     * Prepare order data for AI processing
     */
    protected function prepareDataForAI($orders)
    {
        $data = [
            'sales_data' => [],
            'customer_data' => [],
            'market_trends' => [],
        ];

        foreach ($orders as $order) {
            foreach ($order->items as $item) {
                $product = $item->product;

                // Product sales analytics
                $data['sales_data'][] = [
                    'product_id' => $product->id,
                    'product_name' => $product->title,
                    'category' => $product->category->name,
                    'sales_volume' => $item->quantity,
                    'total_revenue' => $item->quantity * $item->price,
                ];

                // Customer insights
                $data['customer_data'][] = [
                    'customer_id' => $order->customer->id,
                    'customer_name' => $order->customer->name,
                    'purchase_history' => $order->items->map(fn($i) => $i->product->title)->toArray(),
                ];
            }
        }

        return $data;
    }

    /**
     * Call Gemini AI for insights
     */
    protected function callGeminiAPI($data)
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey,
            'Content-Type' => 'application/json',
        ])->post('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText', [
            'contents' => [
                ['parts' => [['text' => json_encode($data)]]]
            ]
        ]);

        if ($response->failed()) {
            Log::error('Gemini AI API call failed: ' . $response->body());
            return ['error' => 'Failed to retrieve insights from Gemini AI'];
        }

        return $response->json();
    }


    /**
     * Store AI insights into the database
     */
    protected function storeInsights($response)
    {
        if (!isset($response['sales_data']) || !is_array($response['sales_data'])) {
            Log::warning('Gemini AI response is missing sales data.');
            return ['error' => 'Invalid AI response format'];
        }

        foreach ($response['sales_data'] as $data) {
            ProductInsight::updateOrCreate(
                ['product_id' => $data['product_id']],
                [
                    'sales_volume' => $data['sales_volume'] ?? 0,
                    'total_revenue' => $data['total_revenue'] ?? 0,
                ]
            );
        }

        return $response;
    }

}
