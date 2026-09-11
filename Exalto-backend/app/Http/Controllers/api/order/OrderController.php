<?php

namespace App\Http\Controllers\api\order;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    // get all orders for authenticated user
    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        return response()->json([
            'data' => Order::where('user_id', $user->id)
                ->with(['address', 'payments', 'orderItems.product'])
                ->orderBy('created_at', 'desc')
                ->get()
        ]);
    }

   
    // createna new order
    public function StoreOrder(Request $request)
    {
        $user = Auth::user();

        // Validate input (no subtotal / total — calculated by model)
        $validator = Validator::make($request->all(), [
            'address_id' => 'required|exists:addresses,id',
            'shipping_fee' => 'required|numeric|min:0',
            'currency' => 'required|string|max:3',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        //Find the address
        $address = Address::find($request->address_id);

        if (!$address) {
            return response()->json(['message' => 'Address not found'], 404);
        }

        // for logged user addres must belong to belong them 
        if ($user && $address->user_id !== $user->id) {
            return response()->json(['message' => 'Invalid address'], 403);
        }

        // create order with only user-supplied fields
        $order = Order::create([
            'address_id' => $address->id,
            'user_id' => $user ? $user->id : null,
            'status' => 'pending',
            'shipping_fee' => $request->shipping_fee,
            'currency' => $request->currency,
            'notes' => $request->notes,
        ]);

        $order->load(['address', 'payments', 'orderItems.product']);

        return response()->json([
            'data' => $order,
            'message' => 'Order created'
        ], 201);
    }

    // Get a single order
    public function show(Request $request, $id)
    {
        $user = Auth::user();

        if ($user) {
            $order = Order::where('user_id', $user->id)
                ->with(['address', 'payments', 'orderItems.product'])
                ->find($id);

            if (!$order) {
                return response()->json(['message' => 'Order not found'], 404);
            }

            return response()->json(['data' => $order]);
        }

        // Guest lookup
        $order = Order::with(['address', 'payments', 'orderItems.product'])->find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json(['data' => $order]);
    }

    // cancel an order
    public function cancel(Request $request, $id)
    {
        $user = Auth::user();

        $query = Order::whereIn('status', ['pending', 'processing']);

        if ($user) {
            $query->where('user_id', $user->id);
        }

        $order = $query->find($id);

        if (!$order) {
            return response()->json([
                'message' => 'Order not found or cannot be cancelled'
            ], 404);
        }

        $order->update(['status' => 'cancelled']);

        return response()->json([
            'data' => $order,
            'message' => 'Order cancelled'
        ]);
    }

    // Update order status (Admin / Sales Manager only)
    public function updateStatus(Request $request, $id)
    {
        $user = Auth::user();

        if (!$user || (!$user->isAdmin() && !$user->isSalesManager())) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

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