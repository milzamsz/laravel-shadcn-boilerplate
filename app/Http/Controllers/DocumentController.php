<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Services\EmbeddingService;
use App\Services\FileUploadService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentController extends Controller
{
    public function __construct(
        protected EmbeddingService $embeddingService,
        protected FileUploadService $fileUploadService,
    ) {}

    /**
     * List user's documents.
     */
    public function index(Request $request)
    {
        $documents = $request->user()
            ->documents()
            ->latest()
            ->paginate(20);

        return Inertia::render('documents/index', [
            'documents' => $documents,
        ]);
    }

    /**
     * Store document + generate embedding.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'source' => ['nullable', 'string', 'max:500'],
            'file' => ['nullable', 'file', 'max:10240'], // max 10MB
        ]);

        // Handle file upload
        $filePath = null;
        if ($request->hasFile('file')) {
            $upload = $this->fileUploadService->upload(
                $request->file('file'),
                'documents',
            );
            $filePath = $upload['path'];
        }

        // Create document
        $document = $request->user()->documents()->create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'source' => $validated['source'] ?? null,
            'file_path' => $filePath,
        ]);

        // Generate & store embedding via OpenRouter
        $this->embeddingService->embedDocument($document);

        return redirect()->route('documents.index')
            ->with('success', 'Document created and indexed.');
    }

    /**
     * Show single document.
     */
    public function show(Document $document)
    {
        $this->authorize('view', $document);

        return Inertia::render('documents/show', [
            'document' => $document,
        ]);
    }

    /**
     * Delete document + file.
     */
    public function destroy(Document $document)
    {
        $this->authorize('delete', $document);

        if ($document->file_path) {
            $this->fileUploadService->delete($document->file_path);
        }

        $document->delete();

        return redirect()->route('documents.index')
            ->with('success', 'Document deleted.');
    }
}
