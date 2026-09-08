<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constained('categories')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->string('description');
            $table->decimal('price');
            $table->string('status');
            $table->boolean('is_featured')->default(false);
            $table->integer('stock_quantity');
            $table->string('image')->nullable();
            $table->string('packaging_type');
            $table->string('unit');
            $table->string('country_of_origin');
            $table->string('quality_type');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
