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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('ticket_id');
            $table->string('subject');
            $table->json('description'); // multiple description are contents shared as both response.
            $table->string('file')->nullable();
            $table->string('file_public_id')->nullable();
            $table->enum('priority_level', ['low', 'medium', 'high'])->default('low');
            $table->enum('response_status', ['open', 'close', 'ongoing'])->default('open');
            $table->unsignedBigInteger('reporter_id');
            $table->unsignedBigInteger('agent_id')->nullable();
            $table->foreign('agent_id')->references('id')->on('users')->onDelete('cascade')->nullable();
            $table->foreign('reporter_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
