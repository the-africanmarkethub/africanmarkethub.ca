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
            $table->string('title')->unique();
            $table->string('slug')->index();
            $table->text('description');
            $table->decimal('sales_price', 16, 2);
            $table->decimal('regular_price', 16, 2);
            $table->integer('quantity')->default(0);
            $table->boolean('notify_user')->default(true);
            $table->json('images');
            $table->json('image_public_ids');
            $table->enum('status', ['active', 'inactive', 'draft'])->default('active')->index();
            $table->enum('type', ['services', 'products'])->default('products')->index();
            $table->foreignId('shop_id')->index();
            $table->foreignId('category_id')->index();
            $table->foreign('shop_id')->references('id')->on('shops')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
            $table->unsignedBigInteger('views')->default(0);
            // Service-specific fields
            $table->string('pricing_model')->nullable(); // 'fixed', 'hourly'
            $table->string('delivery_method')->nullable(); //'offline', 'online'
            $table->string('estimated_delivery_time')->nullable(); // e.g., '2 days'
            $table->json('available_days')->nullable(); // e.g., ['Mon','Tue','Wed']
            $table->string('available_from')->nullable(); // e.g., '09:00 AM'
            $table->string('available_to')->nullable();   // e.g., '05:00 PM'
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
