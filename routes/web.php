<?php

use App\Http\Controllers\AgentController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SearchController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return inertia('dashboard', [
            'totalRevenue' => 45231.89,
            'totalProducts' => \App\Models\Product::count(),
            'totalUsers' => \App\Models\User::count(),
            'activeProducts' => \App\Models\Product::where('status', 'active')->count(),
        ]);
    })->name('dashboard');

    // Semantic Search
    Route::get('/search', [SearchController::class, 'index'])->name('search');

    // Documents CRUD
    Route::resource('documents', DocumentController::class)
        ->only(['index', 'store', 'show', 'destroy']);

    // AI Agent (RAG)
    Route::post('/agent/ask', [AgentController::class, 'ask'])->name('agent.ask');

    // Products CRUD
    Route::resource('products', ProductController::class)
        ->only(['index', 'create', 'store', 'edit', 'update', 'destroy']);

    // Kanban & Notifications (Inertia pages)
    Route::inertia('kanban', 'kanban')->name('kanban');
    Route::inertia('notifications', 'notifications')->name('notifications');
});

require __DIR__.'/settings.php';
