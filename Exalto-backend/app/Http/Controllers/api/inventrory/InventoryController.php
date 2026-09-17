<?php

namespace App\Http\Controllers\api\inventrory;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class InventoryController extends Controller
{
    public function index()
    {
        if (!Auth::check() || (!Auth::user()->isAdmin() && !Auth::user()->isSalesManager())) {
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 403);
        }

        $inventories = Inventory::with('product')->get();

        return response()->json([
            'status' => true,
            'data' => $inventories,
        ], 200);
    }

    public function show($id)
    {
        if (!Auth::check() || (!Auth::user()->isAdmin() && !Auth::user()->isSalesManager())) {
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 403);
        }

        $inventory = Inventory::with('product')->find($id);

        if (!$inventory) {
            return response()->json(['status' => false, 'message' => 'Inventory not found'], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $inventory,
        ], 200);
    }

    public function store(Request $request)
    {
        if (!Auth::check() || (!Auth::user()->isAdmin() && !Auth::user()->isSalesManager())) {
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'stock_quantity' => 'required|integer|min:0',
            'reversed_quantity' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => 'Validation Error', 'errors' => $validator->errors()], 422);
        }

        if (Inventory::where('product_id', $request->product_id)->exists()) {
            return response()->json(['status' => false, 'message' => 'Inventory already exists for this product'], 409);
        }

        $inventory = Inventory::create([
            'product_id' => $request->product_id,
            'stock_quantity' => $request->stock_quantity,
            'reversed_quantity' => $request->reversed_quantity ?? 0,
        ]);

        $product = Product::find($request->product_id);
        if ($product) {
            $product->stock_quantity = $inventory->stock_quantity;
            $product->save();
        }

        return response()->json([
            'status' => true,
            'message' => 'Inventory created successfully',
            'data' => $inventory,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        if (!Auth::check() || (!Auth::user()->isAdmin() && !Auth::user()->isSalesManager())) {
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 403);
        }

        $inventory = Inventory::find($id);

        if (!$inventory) {
            return response()->json(['status' => false, 'message' => 'Inventory not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'stock_quantity' => 'sometimes|required|integer|min:0',
            'reversed_quantity' => 'sometimes|required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => 'Validation Error', 'errors' => $validator->errors()], 422);
        }

        $inventory->fill($request->only(['stock_quantity', 'reversed_quantity']));
        $inventory->save();

        if ($inventory->product) {
            $inventory->product->stock_quantity = $inventory->stock_quantity;
            $inventory->product->save();
        }

        return response()->json([
            'status' => true,
            'message' => 'Inventory updated successfully',
            'data' => $inventory,
        ], 200);
    }

    public function destroy($id)
    {
        if (!Auth::check() || (!Auth::user()->isAdmin() && !Auth::user()->isSalesManager())) {
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 403);
        }

        $inventory = Inventory::find($id);

        if (!$inventory) {
            return response()->json(['status' => false, 'message' => 'Inventory not found'], 404);
        }

        $inventory->delete();

        return response()->json([
            'status' => true,
            'message' => 'Inventory deleted successfully',
        ], 200);
    }
}
