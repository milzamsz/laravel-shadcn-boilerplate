<?php

use App\Http\Controllers\AgentController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\SearchController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Semantic Search
    Route::get('/search', [SearchController::class, 'index'])->name('search');

    // Documents CRUD
    Route::resource('documents', DocumentController::class)
        ->only(['index', 'store', 'show', 'destroy']);

    // AI Agent (RAG)
    Route::post('/agent/ask', [AgentController::class, 'ask'])->name('agent.ask');
});

require __DIR__.'/settings.php';
