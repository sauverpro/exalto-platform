<?php

namespace App\Http\Controllers\api\payment;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    // get all payments 
    public function index(Request $request)
    {
        return response()->json([
            'data' => Payment::where('user_id', $request->user()->id)
                ->with('order')
                ->orderBy('created_at', 'desc')
                ->get()
        ]);
    }

    // create new payment
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|exists:orders,id',
            'amount' => 'required|numeric|min:0.01',
            'currency' => 'required|string|max:3',
            'method' => 'required|string|in:credit_card,mobile_money,bank_transfer,cash',
            'transaction_id' => 'nullable|string|max:255',
            'status' => 'sometimes|string|in:pending,completed,failed,refunded'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Verify order belongs to user
        $order = Order::where('user_id', $request->user()->id)
            ->where('id', $request->order_id)
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Invalid order'], 400);
        }

        $data = $request->all();
        $data['user_id'] = $request->user()->id;
        $data['status'] = $request->status ?? 'pending';
        $data['paid_at'] = $data['status'] === 'completed' ? now() : null;

        $payment = Payment::create($data);
        $payment->load('order');

        return response()->json([
            'data' => $payment,
            'message' => 'Payment created'
        ], 201);
    }

    // get a single payment
    public function show(Request $request, $id)
    {
        $payment = Payment::where('user_id', $request->user()->id)
            ->with('order')
            ->find($id);

        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        return response()->json(['data' => $payment]);
    }

    // update payment status
    public function update(Request $request, $id)
    {
        $payment = Payment::where('user_id', $request->user()->id)->find($id);

        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:pending,completed,failed,refunded',
            'transaction_id' => 'nullable|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['status', 'transaction_id']);
        
        // Set paid_at if status becomes completed
        if ($request->status === 'completed' && $payment->status !== 'completed') {
            $data['paid_at'] = now();
        }

        $payment->update($data);
        $payment->load('order');

        return response()->json([
            'data' => $payment,
            'message' => 'Payment updated'
        ]);
    }

    // Delete pending payments
    public function destroy(Request $request, $id)
    {
        $payment = Payment::where('user_id', $request->user()->id)
            ->where('status', 'pending')
            ->find($id);

        if (!$payment) {
            return response()->json([
                'message' => 'Payment not found or cannot be deleted'
            ], 404);
        }

        $payment->delete();

        return response()->json(['message' => 'Payment deleted']);
    }

    //  Verify payment status (for frontend polling)
    
    public function verify(Request $request, $id)
    {
        $payment = Payment::where('user_id', $request->user()->id)
            ->find($id);

        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        return response()->json([
            'data' => [
                'id' => $payment->id,
                'status' => $payment->status,
                'paid_at' => $payment->paid_at,
                'transaction_id' => $payment->transaction_id
            ]
        ]);
    }

    // Get all payments for admin
    public function adminIndex(Request $request)
    {
        return response()->json([
            'data' => Payment::with(['user', 'order'])
                ->orderBy('created_at', 'desc')
                ->get()
        ]);
    }

    // for admin: update payment status
    public function adminUpdate(Request $request, $id)
    {
        $user = \Illuminate\Support\Facades\Auth::user();
        if (!$user || (!$user->isAdmin() && !$user->isSalesManager())) {
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 403);
        }

        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,completed,failed,refunded',
            'transaction_id' => 'nullable|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['status', 'transaction_id']);
        
        if ($request->status === 'completed' && $payment->status !== 'completed') {
            $data['paid_at'] = now();
        }

        $payment->update($data);
        $payment->load(['user', 'order']);

        return response()->json([
            'data' => $payment,
            'message' => 'Payment updated'
        ]);
    }
}