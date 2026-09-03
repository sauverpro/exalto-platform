<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id', 'user_id', 'amount', 'currency', 'method', 'status', 'transaction_id', 'paid_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    public function order()
    {
        return $this->belongsTo('App\\Models\\Orders');
    }

    public function user()
    {
        return $this->belongsTo('App\\Models\\User');
    }
}
