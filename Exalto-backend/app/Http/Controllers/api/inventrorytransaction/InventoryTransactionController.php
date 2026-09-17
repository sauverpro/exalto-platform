<?php

namespace App\Http\Controllers\api\inventrorytransaction;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Models\InventoryTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class InventoryTransactionController extends Controller
{
    public function index()
    {
        if (!Auth::check() || (!Auth::user()->isAdmin() && !Auth::user()->isSalesManager())) {
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'status' => true,
            'data' => InventoryTransaction::with(['inventory', 'product', 'performer'])->get(),
        ], 200);
    }

    public function show($id)
    {
        if (!Auth::check() || (!Auth::user()->isAdmin() && !Auth::user()->isSalesManager())) {
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 403);
        }

        $transaction = InventoryTransaction::with(['inventory', 'product', 'performer'])->find($id);

        if (!$transaction) {
            return response()->json(['status' => false, 'message' => 'Transaction not found'], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $transaction,
        ], 200);
    }

    public function store(Request $request)
    {
        if (!Auth::check() || (!Auth::user()->isAdmin() && !Auth::user()->isSalesManager())) {
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'inventory_id' => 'required|exists:inventories,id',
            'product_id' => 'required|exists:products,id',
            'quantity_change' => 'required|integer',
            'type' => 'required|in:in,out,adjustment',
            'performed_by' => 'nullable|exists:users,id',
            'reference' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => 'Validation Error', 'errors' => $validator->errors()], 422);
        }

        $inventory = Inventory::findOrFail($request->inventory_id);

        $newStock = $inventory->stock_quantity;

        if ($request->type === 'in') {
            $newStock += $request->quantity_change;
        } elseif ($request->type === 'out') {
            $newStock -= $request->quantity_change;
        } elseif ($request->type === 'adjustment') {
            $newStock += $request->quantity_change;
        }

        if ($newStock < 0) {
            return response()->json(['status' => false, 'message' => 'Stock cannot go below zero'], 422);
        }

        $inventory->stock_quantity = $newStock;
        $inventory->save();

        $transaction = InventoryTransaction::create([
            'inventory_id' => $inventory->id,
            'product_id' => $request->product_id,
            'quantity_change' => $request->quantity_change,
            'type' => $request->type,
            'performed_by' => $request->performed_by ?? Auth::id(),
            'reference' => $request->reference,
            'notes' => $request->notes,
        ]);

        if ($inventory->product) {
            $inventory->product->stock_quantity = $newStock;
            $inventory->product->save();
        }

        return response()->json([
            'status' => true,
            'message' => 'Inventory transaction created successfully',
            'data' => $transaction,
        ], 201);
    }
}
