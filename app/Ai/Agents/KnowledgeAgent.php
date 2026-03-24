<?php

namespace App\Ai\Agents;

use App\Models\Document;
use Laravel\Ai\Attributes\Model;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Contracts\HasTools;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Messages\Message;
use Laravel\Ai\Promptable;
use Laravel\Ai\Tools\SimilaritySearch;
use Stringable;

#[Model('anthropic/claude-sonnet-4')]
class KnowledgeAgent implements Agent, Conversational, HasTools
{
    use Promptable;

    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(): Stringable|string
    {
        return <<<'PROMPT'
        Kamu adalah asisten AI yang menjawab pertanyaan berdasarkan knowledge base perusahaan.

        ATURAN:
        1. SELALU gunakan tool similarity_search untuk mencari dokumen relevan SEBELUM menjawab.
        2. Jawab HANYA berdasarkan dokumen yang ditemukan. Jangan mengarang.
        3. Jika tidak ada dokumen relevan, katakan: "Maaf, saya tidak menemukan informasi terkait di knowledge base."
        4. Jawab dalam bahasa yang sama dengan pertanyaan user.
        5. Sertakan referensi (judul dokumen) di akhir jawaban.
        PROMPT;
    }

    /**
     * Get the list of messages comprising the conversation so far.
     *
     * @return Message[]
     */
    public function messages(): iterable
    {
        return [];
    }

    /**
     * Get the tools available to the agent.
     *
     * @return Tool[]
     */
    public function tools(): iterable
    {
        return [
            SimilaritySearch::usingModel(
                model: Document::class,
                column: 'embedding',
                minSimilarity: 0.7,
                limit: 5,
                query: fn ($q) => $q->select(['id', 'title', 'content', 'source']),
            ),
        ];
    }
}
