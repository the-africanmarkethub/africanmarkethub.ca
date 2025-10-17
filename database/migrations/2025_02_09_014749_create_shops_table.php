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
        Schema::create('shops', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Ensure shop name is unique
            $table->string('slug')->index(); // Index slug for faster searches
            $table->string('address');
            $table->string('type')->index(); // Index type for faster searches
            $table->string('logo');
            $table->string('logo_public_id');
            $table->string('banner');
            $table->string('banner_public_id');
            $table->text('description');
            $table->unsignedBigInteger('subscription_id')->nullable();
            $table->string('state_id')->index(); // Index state_id for faster searches
            $table->string('city_id')->index(); // Index city_id for faster searches
            $table->string('country_id')->index(); // Index country_id for faster searches
            $table->unsignedBigInteger('vendor_id')->unique();
            $table->foreign('vendor_id')->references('id')->on('users')->onDelete('cascade'); // If user deleted, delete the shop
            $table->unsignedBigInteger('category_id')->index(); // Index category_id for faster searches
            $table->enum('status', ['active', 'inactive'])->default('active')->index(); // Index status for faster searches
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shops');
    }
};
