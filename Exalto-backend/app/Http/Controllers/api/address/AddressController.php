<?php

namespace App\Http\Controllers\api\address;
use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;


class AddressController extends Controller
{
    // get address for authenticated user

    public function index(Request $request)
    {
        $addresses = Address::where('user_id', $request->user()->id)
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $addresses
        ]);
    }

    // create new adress
    public function storeAddress(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'district' => 'required|string|max:100',
            'sector' => 'required|string|max:100',
            'street' => 'nullable|string|max:255',
            'is_default' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Prepare data
        $data = $request->all();
        $user = Auth::user();
        if ($user) {
            $user_id = $user->id;
            // If this is the first address, make it default
        if (Address::where('user_id', $user_id)->count() === 0) {
            $data['is_default'] = true;
        }

        // If setting as default, remove default from other addresses
        if (isset($data['is_default']) && $data['is_default']) {
            Address::where('user_id', $user_id)
                ->update(['is_default' => false]);
        }
        $data['user_id'] = $user_id;
        $address = Address::create($data);

        return response()->json([
            'success' => true,
            'data' => $address,
            'message' => 'Address created successfully'
        ], 201);
        } 

        

        // Create address

        $address = Address::create($data);

        return response()->json([
            'success' => true,
            'data' => $address,
            'message' => 'Address created successfully'
        ], 201);
    }

    // get single adress
    public function ShowAddress(Request $request, $id)
    {
        $address = Address::where('user_id', $request->user()->id)
            ->find($id);

        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'Address not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $address
        ]);
    }

    // Update an adress
    public function Update(Request $request, $id)
    {
        $address = Address::where('user_id', $request->user()->id)
            ->find($id);

        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'Address not found'
            ], 404);
        }

        // Validate input
        $validator = Validator::make($request->all(), [
            'full_name' => 'sometimes|string|max:255',
            'phone_number' => 'sometimes|string|max:20',
            'district' => 'sometimes|string|max:100',
            'sector' => 'sometimes|string|max:100',
            'street' => 'nullable|string|max:255',
            'is_default' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // If setting as default, remove default from other addresses
        if ($request->has('is_default') && $request->is_default) {
            Address::where('user_id', $request->user()->id)
                ->where('id', '!=', $id)
                ->update(['is_default' => false]);
        }

        // Update address
        $address->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $address,
            'message' => 'Address updated successfully'
        ]);
    }

    // Delete an address
    public function Destroy(Request $request, $id)
    {
        $address = Address::where('user_id', $request->user()->id)
            ->find($id);

        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'Address not found'
            ], 404);
        }

        // Check if deleting default address
        if ($address->is_default) {
            // Set another address as default if exists
            $otherAddress = Address::where('user_id', $request->user()->id)
                ->where('id', '!=', $id)
                ->first();

            if ($otherAddress) {
                $otherAddress->update(['is_default' => true]);
            }
        }

        $address->delete();

        return response()->json([
            'success' => true,
            'message' => 'Address deleted successfully'
        ]);
    }

    // Set an address as default
    public function setDefault(Request $request, $id)
    {
        $address = Address::where('user_id', $request->user()->id)
            ->find($id);

        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'Address not found'
            ], 404);
        }

        // Remove default from all other addresses
        Address::where('user_id', $request->user()->id)
            ->where('id', '!=', $id)
            ->update(['is_default' => false]);

        // Set this address as default
        $address->update(['is_default' => true]);

        return response()->json([
            'success' => true,
            'data' => $address,
            'message' => 'Default address updated successfully'
        ]);
    }
}