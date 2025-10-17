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
        Schema::create('settlement_accounts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->unique();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('name'); // Bank Name
            $table->string('code')->nullable(); // Can store SWIFT or Bank Code
            $table->string('institution_number', 3); // 3-digit institution number
            $table->string('transit_number', 5); // 5-digit transit number
            $table->string('account_number', 12)->unique(); // 7-12 digit account number
            $table->string('account_name')->unique(); // Account Holder's Name
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settlement_accounts');
    }
};
