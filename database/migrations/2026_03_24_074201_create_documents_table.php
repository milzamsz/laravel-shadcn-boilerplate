<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Pastikan pgvector extension aktif
        Schema::ensureVectorExtensionExists();

        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('content');
            $table->string('source')->nullable();       // asal file / URL
            $table->string('file_path')->nullable();    // path di Laravel storage
            $table->json('metadata')->nullable();
            $table->vector('embedding', dimensions: 1536)->index(); // HNSW cosine
            $table->timestamps();

            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
