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
        Schema::create('communications', function (Blueprint $table) {
            $table->id();
            $table->boolean('marketing_emails')->default(true);
            $table->boolean('new_products')->default(true);
            $table->boolean('promotions')->default(true);
            $table->boolean('events')->default(true);
            $table->boolean('push_notification')->default(true);
            $table->boolean('email_notification')->default(true);
            $table->boolean('sms_notification')->default(true);
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            $table->index(['user_id']);

            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('communications');
    }

    /**
     * Reverse the migrations.
     */
    // public function down(): void
    // {
    //     Schema::dropIfExists('communications');
    // }
};
