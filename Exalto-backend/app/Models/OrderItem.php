<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
    ];
     
    //  price and total_price are calculated by the model
    protected $casts = [
        'price' => 'decimal:2',
        'total_price' => 'decimal:2',
    ];

    // boot the model to attach event listeners
    protected static function booted()
    {
        // Before saving (create OR update)
        static::saving(function ($item) {
            // Always fetch the current price from the product
            if ($item->product_id) {
                $product = Product::find($item->product_id);
                if ($product) {
                    $item->price = $product->price;
                }
            }

            // Always recalculate total_price
            $item->total_price = $item->quantity * $item->price;
        });

        // recalculate parent order
        static::saved(function ($item) {
            $item->order?->recalculateTotals();
        });

        // After deleted — recalculate parent order
        static::deleted(function ($item) {
            $item->order?->recalculateTotals();
        });
    }

    // ----- Relationships -----

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}