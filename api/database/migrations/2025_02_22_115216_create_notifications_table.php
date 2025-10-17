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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('body', 500);
            $table->string('image')->nullable();
            $table->string('image_public_id')->nullable();
            $table->string('cta')->nullable();
            $table->string('channel');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');

            $table->string('delivery_status')->nullable();
            $table->integer('delivered_to')->default(0);
            $table->enum('receiver', ['vendor', 'customer', 'all', 'single'])->default('all');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
