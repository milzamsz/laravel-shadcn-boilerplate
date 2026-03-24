<?php

namespace App\Http\Controllers;

use App\Services\EmbeddingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function __construct(
        protected EmbeddingService $embeddingService,
    ) {}

    public function index(Request $request)
    {
        $query = $request->string('q', '')->toString();
        $results = [];

        if ($query !== '') {
            $results = $this->embeddingService
                ->searchWithDistance($query, limit: 20, userId: $request->user()->id)
                ->map(fn ($doc) => [
                    'id' => $doc->id,
                    'title' => $doc->title,
                    'content' => \Illuminate\Support\Str::limit($doc->content, 300),
                    'distance' => round($doc->distance, 4),
                    'relevance' => round(1 - $doc->distance, 2),
                    'source' => $doc->source,
                    'created_at' => $doc->created_at->diffForHumans(),
                ])
                ->toArray();
        }

        return Inertia::render('search', [
            'results' => $results,
            'query' => $query,
        ]);
    }
}
