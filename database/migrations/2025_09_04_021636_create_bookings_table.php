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
    Schema::create('bookings', function (Blueprint $table) {
        $table->id();

        // Relations
        $table->unsignedBigInteger('customer_id');
        $table->unsignedBigInteger('vendor_id');
        $table->unsignedBigInteger('service_id'); // each booking is tied to one service
        $table->unsignedBigInteger('address_id')->nullable();

        // Financials
        $table->decimal('total', 12, 2);

        // Delivery (use string instead of enum for flexibility)
        $table->string('delivery_method')->default('online');
        $table->string('delivery_status')->default('processing');

        // Dates
        $table->dateTime('scheduled_at')->nullable(); // customer requested date
        $table->dateTime('started_at')->nullable();   // when service started
        $table->dateTime('completed_at')->nullable(); // when finished/delivered

        // Payments
        $table->string('payment_status')->default('pending');
        $table->string('vendor_payment_settlement_status')->default('unpaid');
        $table->string('payment_reference')->nullable();

        // Cancellations
        $table->string('cancel_reason')->nullable();
        $table->unsignedBigInteger('cancelled_by')->nullable();

        // Foreign keys
        $table->foreign('customer_id')->references('id')->on('users')->onDelete('cascade');
        $table->foreign('vendor_id')->references('id')->on('users')->onDelete('cascade');
        $table->foreign('service_id')->references('id')->on('products')->onDelete('cascade');
        $table->foreign('address_id')->references('id')->on('address_books')->nullOnDelete();
        $table->foreign('cancelled_by')->references('id')->on('users')->nullOnDelete();

        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
