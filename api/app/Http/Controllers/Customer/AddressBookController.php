<?php

namespace App\Http\Controllers\Customer;

use Jenssegers\Agent\Agent;
use Illuminate\Http\Request;
use App\Services\ActivityLogger;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule; // Import the Rule class
use App\Models\AddressBook; // Import your AddressBook model

class AddressBookController extends Controller
{
    public function index()
    {
        $addresses = AddressBook::where('customer_id', Auth::id())->get();
        return $addresses->isEmpty()
            ? response()->json(['data' => $addresses, 'status' => 'error', 'message' => 'No addresses found'], 404)
            : response()->json(['data' => $addresses, 'status' => 'success', 'message' => 'Addresses retrieved successfully'], 200);
        return response()->json([
            'data' => $addresses,
            'status' => 'error',
            'message' => 'No addresses found'
        ], 404);
    }

    public function create(Request $request, ActivityLogger $activityLogger)
    {
        $validated = $request->validate([
            'street_address' => 'required|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'zip_code' => 'required|string',
            'country' => 'required|string',
            'phone' => 'nullable|numeric',
            'address_label' => 'nullable|string|max:50',
        ]);

        $address = new AddressBook();
        $address->customer_id = Auth::id();
        $address->fill($validated); // Use fill for mass assignment (safer)
        $address->save();

        $agent = new Agent();
        $device = $agent->device();         
        $platform = $agent->platform();     
        $browser = $agent->browser();        

        $deviceInfo = "$device on $platform using $browser";
        $activityLogger->log('User created shipping address successfully', Auth::user(), $deviceInfo);

        return response()->json([
            'data' => $address,
            'status' => 'success',
            'message' => 'Address created successfully'
        ], 201);
    }

    public function update(Request $request, $address_id, ActivityLogger $activityLogger)
    {
        $validated = $request->validate([
            'address_id' => ['required', 'exists:address_books,id'],
            'street_address' => 'string', // Make fields nullable for updates
            'city' => 'string',
            'state' => 'string',
            'zip_code' => 'string',
            'country' => 'string',
            'phone' => 'nullable|numeric',
            'address_label' => 'nullable|string|max:50',

        ]);

        // Use the validated ID, not the route parameter directly
        $address = AddressBook::where('id', $validated['address_id']) // Use where and then check customer_id
            ->where('customer_id', Auth::id())
            ->first();

        if (!$address) {
            return response()->json([
                'status' => 'error',
                'message' => 'Address not found or does not belong to you'
            ], 404);
        }

        $address->fill($validated); // Use fill for mass assignment (safer)
        $address->save();

        $agent = new Agent();
        $device = $agent->device();
        $platform = $agent->platform();
        $browser = $agent->browser();

        $deviceInfo = "$device on $platform using $browser";
        $activityLogger->log('User updated shipping address successfully', Auth::user(), $deviceInfo);

        return response()->json([
            'data' => $address,
            'status' => 'success',
            'message' => 'Address updated successfully'
        ], 200);
    }

    public function delete(Request $request, $address_id)
    {
        $validated = $request->validate([
            'address_id' => ['required', 'exists:address_books,id'],
        ]);

        // Use the validated ID, not the route parameter directly
        $address = AddressBook::where('id', $validated['address_id']) // Use where and then check customer_id
            ->where('customer_id', Auth::id())
            ->first();

        if (!$address) {
            return response()->json([
                'status' => 'error',
                'message' => 'Address not found or does not belong to you'
            ], 404);
        }

        $address->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Address deleted successfully'
        ], 200);
    }
}
