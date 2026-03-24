<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default AI Provider Names
    |--------------------------------------------------------------------------
    | OpenRouter sebagai single gateway — 1 key, 400+ models.
    */

    'default' => env('AI_PROVIDER', 'openrouter'),
    'default_for_images' => env('AI_PROVIDER', 'openrouter'),
    'default_for_audio' => env('AI_PROVIDER', 'openrouter'),
    'default_for_transcription' => env('AI_PROVIDER', 'openrouter'),
    'default_for_embeddings' => env('AI_PROVIDER', 'openrouter'),
    'default_for_reranking' => env('AI_PROVIDER', 'openrouter'),

    /*
    |--------------------------------------------------------------------------
    | Default Models
    |--------------------------------------------------------------------------
    | Model names menggunakan format OpenRouter: provider/model-name
    */

    'models' => [
        'text' => env('AI_TEXT_MODEL', 'anthropic/claude-sonnet-4'),
        'embeddings' => env('AI_EMBEDDING_MODEL', 'openai/text-embedding-3-small'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Embedding Configuration
    |--------------------------------------------------------------------------
    */

    'embedding' => [
        'model' => env('AI_EMBEDDING_MODEL', 'openai/text-embedding-3-small'),
        'dimensions' => (int) env('AI_EMBEDDING_DIMENSIONS', 1536),
    ],

    /*
    |--------------------------------------------------------------------------
    | Caching — hemat biaya OpenRouter, cache embedding 30 hari
    |--------------------------------------------------------------------------
    */

    'caching' => [
        'embeddings' => [
            'cache' => true,
            'store' => env('CACHE_STORE', 'database'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | AI Providers
    |--------------------------------------------------------------------------
    */

    'providers' => [
        'openrouter' => [
            'driver' => 'openrouter',
            'key' => env('OPENROUTER_API_KEY'),
        ],

        'anthropic' => [
            'driver' => 'anthropic',
            'key' => env('ANTHROPIC_API_KEY'),
        ],

        'openai' => [
            'driver' => 'openai',
            'key' => env('OPENAI_API_KEY'),
        ],

        'gemini' => [
            'driver' => 'gemini',
            'key' => env('GEMINI_API_KEY'),
        ],

        'ollama' => [
            'driver' => 'ollama',
            'key' => env('OLLAMA_API_KEY', ''),
            'url' => env('OLLAMA_BASE_URL', 'http://localhost:11434'),
        ],
    ],

];
