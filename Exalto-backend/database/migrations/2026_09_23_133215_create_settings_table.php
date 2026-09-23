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
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string("site_title")->nullable();
            $table->string("site_logo")->nullable();
            $table->string("primary_number")->nullable();
            $table->string("other_numbers")->nullable();
            $table->string("primary_email")->nullable();
            $table->string("other_emails")->nullable();
            $table->string("instagram")->nullable();
            $table->string("facebook")->nullable();
            $table->string("youtube")->nullable();
            $table->string("tiktok")->nullable();
            $table->string("address")->nullable();

            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
