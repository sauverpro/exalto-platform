<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id', 'stock_quantity', 'reversed_quantity',
    ];

    protected $casts = [
        'stock_quantity' => 'integer',
        'reversed_quantity' => 'integer',
    ];

    public function product()
    {
        return $this->belongsTo('App\\Models\\Product');
    }
}
