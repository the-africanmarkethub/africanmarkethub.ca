<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\AddressBook;
use EasyPost\EasyPostClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class ShippingController extends Controller
{
    public function getShippingRates(Request $request)
    {
        try {
            // Validate the incoming request
            $request->validate([
                'to_street' => 'required|string',
                'to_city' => 'required|string',
                'to_state' => 'required|string',
                'to_zip' => 'required|string',
                'to_country' => 'required|string',
                'products' => 'required|array',
                'products.*.id' => 'required|exists:products,id',
                'products.*.quantity' => 'required|integer|min:1',
            ]);

            // Prepare recipient address
            $toAddress = [
                'street1' => $request->to_street,
                'city' => $request->to_city,
                'state' => $request->to_state,
                'zip' => $request->to_zip,
                'country' => $request->to_country,
            ];

            // Set EasyPost API key
            // $key = (config('services.easypost.key'));
            // $client = new EasyPostClient($key);

            // $vendors = [];

            // // Process each product in the request
            // foreach ($request->products as $productData) {
            //     $product = Product::find($productData['id']);
            //     $vendorId = $product->shop->vendor_id;

            //     // Retrieve vendor shipping address if not already stored
            //     if (!isset($vendors[$vendorId])) {
            //         $vendorAddress = AddressBook::where('user_id', $vendorId)->first();
            //         if (!$vendorAddress) {
            //             return response()->json(['status' => 'error', 'message' => 'Oops! Vendor shipping address not found'], 404);
            //         }

            //         // Store vendor address details
            //         $vendors[$vendorId] = [
            //             'address' => [
            //                 'street1' => $vendorAddress->street,
            //                 'city' => $vendorAddress->city,
            //                 'state' => $vendorAddress->state,
            //                 'zip' => $vendorAddress->zip,
            //                 'country' => $vendorAddress->country,
            //             ],
            //             'parcels' => []
            //         ];
            //     }

            //     // Calculate dimensional weight (volume-based weight)
            //     $dimensionalWeight = ($product->length * $product->width * $product->height) / 139;

            //     // Calculate total actual weight based on quantity
            //     $totalWeight = $product->weight * $productData['quantity'];

            //     // Determine whether to use dimensional weight or actual weight
            //     if ($dimensionalWeight > $totalWeight) {
            //         // If dimensional weight is greater, adjust height and use it as weight
            //         $height = $product->height * $productData['quantity'];
            //         $weight = $dimensionalWeight;
            //     } else {
            //         // Otherwise, use actual weight and keep height unchanged
            //         $height = $product->height;
            //         $weight = $totalWeight;
            //     }

            //     // Store parcel details for the vendor
            //     $vendors[$vendorId]['parcels'][] = [
            //         'length' => $product->length,
            //         'width' => $product->width,
            //         'height' => $height,
            //         'weight' => $weight
            //     ];
            // }

            // $totalShippingCost = 0;
            // $shippingDetails = [];

            // // Process shipping for each vendor
            // foreach ($vendors as $vendorId => $vendorData) {
            //     $shipment =  $client->shipment->create([
            //         'from_address' => $vendorData['address'],
            //         'to_address' => $toAddress,
            //         'parcel' => $vendorData['parcels'][0] // Assuming one parcel per vendor for now
            //     ]);

            //     // Get the cheapest available shipping rate
            //     $cheapestRate = collect($shipment->rates)->sortBy('rate')->first();
            //     $totalShippingCost += $cheapestRate ? $cheapestRate->rate : 0;
            //     $shippingDetails[$vendorId] = $cheapestRate;
            // }

            // Return calculated shipping cost and details
            return response()->json([
                'status' => 'success',
                // fake shipping rate
                'total_shipping_cost' => 10,
                'shipping_details' => '3 days delivery'
                // 'total_shipping_cost' => $totalShippingCost,
                // 'shipping_details' => $shippingDetails
            ]);
        } catch (\Exception $e) {
            // Log and return an error response if an EasyPost error occurs
            Log::error('EasyPost error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Something went wrong! Please try again', 'error_detail' => $e->getMessage()], 500);
        }
    }
    // get easypost webhook
    public function getEasypostWebhook(Request $request)
    {
        try {
            // Validate the incoming request
            $request->validate([
                'url' => 'required|url',
            ]);

            // Set EasyPost API key
            $key = (config('services.easypost.key'));
            $client = new EasyPostClient($key);

            // Create a new webhook
            $webhook = $client->webhook->create([
                'url' => $request->url,
                'mode' => 'test', // Change to 'production' for live mode
                'disabled' => false,
                'description' => 'EasyPost webhook for shipping updates'
            ]);

            // Return the webhook details
            return response()->json([
                'status' => 'success',
                'webhook' => $webhook
            ]);
        } catch (\Exception $e) {
            // Log and return an error response if an EasyPost error occurs
            Log::error('EasyPost error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Something went wrong! Please try again', 'error_detail' => $e->getMessage()], 500);
        }
    }
}
