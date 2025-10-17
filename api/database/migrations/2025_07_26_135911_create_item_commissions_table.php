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
        Schema::create('item_commissions', function (Blueprint $table) {
            $table->id();
            $table->decimal('rate', 5, 2)->nullable();
            $table->enum('type', ['product', 'service', 'withdrawal'])->default('withdrawal');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_commissions');
    }
};
