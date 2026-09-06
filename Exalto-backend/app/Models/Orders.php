<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orders extends Model
{
    use HasFactory;

    protected $fillable = [
        'address_id', 'user_id', 'status', 'subtotal', 'shipping_fee', 'total', 'currency', 'notes',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'shipping_fee' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo('App\\Models\\User');
    }

    public function address()
    {
        return $this->belongsTo('App\\Models\\Address');
    }

    public function payments()
    {
        return $this->hasMany('App\\Models\\Payment');
    }

    public function shipments()
    {
        return $this->hasMany('App\\Models\\Shipment');
    }
}
