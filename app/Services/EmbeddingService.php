<?php

namespace App\Services;

use App\Models\Document;
use Illuminate\Support\Str;
use Laravel\Ai\Embeddings;

class EmbeddingService
{
    /**
     * Generate embedding dan simpan ke dokumen.
     * OpenRouter → openai/text-embedding-3-small
     */
    public function embedDocument(Document $document): void
    {
        $embedding = Str::of($document->content)->toEmbeddings();
        $document->update(['embedding' => $embedding]);
    }

    /**
     * Batch embed — single API call, lebih hemat.
     */
    public function embedBatch(array $texts): array
    {
        $response = Embeddings::for($texts)
            ->dimensions(config('ai.embedding.dimensions', 1536))
            ->generate();

        return $response->embeddings;
    }

    /**
     * Semantic search — Laravel 13 native.
     * Query string otomatis di-embed via OpenRouter.
     */
    public function search(
        string $query,
        int $limit = 10,
        float $minSimilarity = 0.7,
        ?int $userId = null,
    ): \Illuminate\Database\Eloquent\Collection {
        $builder = Document::query()
            ->whereVectorSimilarTo('embedding', $query, minSimilarity: $minSimilarity)
            ->limit($limit);

        if ($userId) {
            $builder->where('user_id', $userId);
        }

        return $builder->get();
    }

    /**
     * Advanced search dengan distance scoring.
     */
    public function searchWithDistance(
        string $query,
        int $limit = 10,
        float $maxDistance = 0.3,
        ?int $userId = null,
    ): \Illuminate\Support\Collection {
        $queryEmbedding = Str::of($query)->toEmbeddings();

        $builder = Document::query()
            ->select('*')
            ->selectVectorDistance('embedding', $queryEmbedding, as: 'distance')
            ->whereVectorDistanceLessThan('embedding', $queryEmbedding, maxDistance: $maxDistance)
            ->orderByVectorDistance('embedding', $queryEmbedding)
            ->limit($limit);

        if ($userId) {
            $builder->where('user_id', $userId);
        }

        return $builder->get();
    }
}
