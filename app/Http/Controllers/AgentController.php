<?php

namespace App\Http\Controllers;

use App\Ai\Agents\KnowledgeAgent;
use Illuminate\Http\Request;

class AgentController extends Controller
{
    public function ask(Request $request)
    {
        $validated = $request->validate([
            'question' => ['required', 'string', 'max:1000'],
        ]);

        $agent = new KnowledgeAgent();
        $response = $agent->prompt($validated['question']);

        return response()->json([
            'answer' => $response->text,
            'tools_used' => $response->toolCalls->toArray(),
        ]);
    }
}
