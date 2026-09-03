<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'inventory_id', 'product_id', 'quantity_change', 'type', 'performed_by', 'reference', 'notes',
    ];

    protected $casts = [
        'quantity_change' => 'integer',
    ];

    public function inventory()
    {
        return $this->belongsTo('App\\Models\\Inventory');
    }

    public function product()
    {
        return $this->belongsTo('App\\Models\\Product');
    }

    public function performer()
    {
        return $this->belongsTo('App\\Models\\User', 'performed_by');
    }
}
