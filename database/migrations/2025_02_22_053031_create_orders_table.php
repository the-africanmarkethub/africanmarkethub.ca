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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_id');
            $table->json('vendor_id')->nullable();
            $table->decimal('total', 12, 2);
            $table->string('payment_method')->default('card');
            $table->enum('shipping_status', ['processing','ongoing', 'delivered', 'cancelled', 'returned'])->default('processing');
            $table->string('shipping_method')->nullable();
            $table->decimal('shipping_fee', 12, 2)->default(0.00);
            $table->string('tracking_number')->nullable();
            $table->string('tracking_url')->nullable();
            $table->dateTime('shipping_date')->nullable();
            $table->dateTime('delivery_date')->nullable();
            $table->dateTime('payment_date')->nullable();
            $table->string('payment_reference')->nullable();
            $table->enum('payment_status', ['pending', 'cancelled', 'completed', 'refunded'])->default('pending');
            $table->enum('vendor_payment_settlement_status', ['paid', 'unpaid'])->default('unpaid');
            $table->string('cancel_reason')->nullable();
            $table->unsignedBigInteger('address_id')->nullable();
            $table->timestamps();

            // Add foreign keys
            $table->foreign('customer_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('address_id')->references('id')->on('address_books')->onDelete('cascade');

            // Indexes
            $table->index(['customer_id']);
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
