<?php

namespace App\Http\Controllers\api\orderitem;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrderItemController extends Controller
{
    // only for logged users
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthenticated',
            ], 401);
        }

        $items = OrderItem::with(['order', 'product'])
            ->whereHas('order', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Order items retrieved successfully',
            'data' => $items,
        ], 200);
    }

    // creating orderitem for logged users and guests
    public function store(Request $request)
    {
        $user = $request->user(); // null for guests

        $validator = Validator::make($request->all(), [
            'order_id' => 'required|exists:orders,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // find orders
        $order = Order::find($request->order_id);

        if (!$order) {
            return response()->json([
                'status' => false,
                'message' => 'Order not found.',
            ], 404);
        }

        // for logged user, order must belong to them
        if ($user && $order->user_id !== $user->id) {
            return response()->json([
                'status' => false,
                'message' => 'Order does not belong to this account.',
            ], 403);
        }

        // Check if item already exists — if so, merge quantities
        $existingItem = OrderItem::where('order_id', $order->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($existingItem) {
            $existingItem->quantity += $request->quantity;
            $existingItem->save();

            return response()->json([
                'status' => true,
                'message' => 'Order item updated successfully',
                'data' => $existingItem->fresh()->load(['order', 'product']),
            ], 200);
        }

        // handle prices and total_price
        $orderItem = OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $request->product_id,
            'quantity' => $request->quantity,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Item added to order successfully',
            'data' => $orderItem->load(['order', 'product']),
        ], 201);
    }

    // show single order
    public function show(Request $request, $id)
    {
        $user = $request->user();

        $query = OrderItem::with(['order', 'product']);

        // If logged in, restrict to their orders
        if ($user) {
            $query->whereHas('order', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }

        $orderItem = $query->find($id);

        if (!$orderItem) {
            return response()->json([
                'status' => false,
                'message' => 'Order item not found.',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Order item retrieved successfully',
            'data' => $orderItem,
        ], 200);
    }

    // Update the quantity on an order item
    public function update(Request $request, $id)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $query = OrderItem::query();

        // If logged in, restrict to their orders
        if ($user) {
            $query->whereHas('order', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }

        $orderItem = $query->find($id);

        if (!$orderItem) {
            return response()->json([
                'status' => false,
                'message' => 'Order item not found.',
            ], 404);
        }

        // Only set quantity — model recalculates price and total_price
        $orderItem->quantity = $request->quantity;
        $orderItem->save();

        return response()->json([
            'status' => true,
            'message' => 'Order item updated successfully',
            'data' => $orderItem->fresh()->load(['order', 'product']),
        ], 200);
    }

    // remove an item from an order
    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        $query = OrderItem::query();

        // If logged in, restrict to their orders
        if ($user) {
            $query->whereHas('order', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }

        $orderItem = $query->find($id);

        if (!$orderItem) {
            return response()->json([
                'status' => false,
                'message' => 'Order item not found.',
            ], 404);
        }

        $orderItem->delete(); //model auto-recalculates parent order totals

        return response()->json([
            'status' => true,
            'message' => 'Order item removed successfully',
        ], 200);
    }
}