<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id', 'user_id', 'address_id', 'carrier', 'tracking_number', 'cost', 'status', 'shipped_at', 'delivered_at', 'notes',
    ];

    protected $casts = [
        'cost' => 'decimal:2',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    public function order()
    {
        return $this->belongsTo('App\\Models\\Orders');
    }

    public function address()
    {
        return $this->belongsTo('App\\Models\\address');
    }
}
