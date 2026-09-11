<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'address_id',
        'user_id',
        'status',
        'shipping_fee',
        'currency',
        'notes',
    ];
    
    // subtotal, total are calculated by the model
    protected $casts = [
        'subtotal' => 'decimal:2',
        'shipping_fee' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    // ----- Relationships -----

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function shipments()
    {
        return $this->hasMany(Shipment::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Business Logic
    // Recalculate subtotal and total from order items
    public function recalculateTotals()
    {
        $this->subtotal = (float) $this->orderItems()->sum('total_price');
        $this->total = $this->subtotal + (float) $this->shipping_fee;
        $this->saveQuietly(); // save without firing events again
    }
}