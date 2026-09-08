<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    // get all orders
    public function index(Request $request)
    {
        $user = Auth::user();
        return response()->json([
            'data' => Order::where('user_id', $user->id)
                ->with(['address', 'payments', 'shipments'])
                ->orderBy('created_at', 'desc')
                ->get()
        ]);
    }

    // create order
    public function StoreOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'address_id' => 'required|exists:addresses,id',
            'subtotal' => 'required|numeric|min:0',
            'shipping_fee' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'currency' => 'required|string|max:3',
            'notes' => 'nullable|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Verify address belongs to user
        $address = $request->user()->addresses()->find($request->address_id);
        if (!$address) {
            return response()->json(['message' => 'Invalid address'], 400);
        }

        $data = $request->all();
        $data['user_id'] = $request->user()->id;
        $data['status'] = 'pending';

        $order = Order::create($data);
        $order->load(['address', 'payments', 'shipments']);

        return response()->json([
            'data' => $order,
            'message' => 'Order created'
        ], 201);
    }

    // get single order
    public function show(Request $request, $id)
    {
        $order = Order::where('user_id', $request->user()->id)
            ->with(['address', 'payments', 'shipments'])
            ->find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json(['data' => $order]);
    }

    // cancel order
    public function cancel(Request $request, $id)
    {
        $order = Order::where('user_id', $request->user()->id)
            ->whereIn('status', ['pending', 'processing'])
            ->find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found or cannot be cancelled'], 404);
        }

        $order->update(['status' => 'cancelled']);

        return response()->json([
            'data' => $order,
            'message' => 'Order cancelled'
        ]);
    }

    // For admin, update order status
    public function updateStatus(Request $request, $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,processing,completed,cancelled'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $order->update(['status' => $request->status]);

        return response()->json([
            'data' => $order,
            'message' => 'Status updated'
        ]);
    }
}