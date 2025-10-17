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
        Schema::create('wallets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->unique();  //Foreign key to the User table
            $table->decimal('total_earning', 16, 2)->default(0.00); // Adjust precision as needed
            $table->decimal('available_to_withdraw', 16, 2)->default(0.00); // Adjust precision as needed
            $table->decimal('pending', 16, 2)->default(0.00); // Adjust precision as needed
            $table->index('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade'); //If user deleted, delete the wallet.
            $table->timestamps();
        });
    } 

    public function down(): void
    {
        Schema::dropIfExists('wallets');
    }
};
