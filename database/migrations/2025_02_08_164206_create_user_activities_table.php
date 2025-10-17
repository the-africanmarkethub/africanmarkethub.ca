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
        Schema::create('user_activities', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->unique();  //Foreign key to the User table
            $table->string('role');
            $table->timestamp('login_time');
            $table->string('activity')->nullable();
            $table->string('ip')->nullable();
            $table->string('location')->nullable();
            $table->text('device')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade'); //If user deleted, delete the wallet.
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_activities');
    }
};
