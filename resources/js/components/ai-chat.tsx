import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function AiChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const question = input.trim();
        setInput('');
        setMessages((prev) => [...prev, { role: 'user', content: question }]);
        setLoading(true);

        try {
            const res = await fetch('/agent/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>(
                        'meta[name="csrf-token"]'
                    )?.content ?? '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ question }),
            });

            const data = await res.json();
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: data.answer },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="flex flex-col h-[500px]">
            <CardHeader className="pb-3">
                <CardTitle className="text-base">AI Assistant</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-3 min-h-0">
                <ScrollArea className="flex-1 pr-3">
                    <div className="space-y-3">
                        {messages.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                Ask a question about your documents.
                            </p>
                        )}
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${
                                msg.role === 'user' ? 'justify-end' : 'justify-start'
                            }`}>
                                <div className={`rounded-lg px-3 py-2 max-w-[85%] text-sm ${
                                    msg.role === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted'
                                }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-muted rounded-lg px-3 py-2 text-sm text-muted-foreground">
                                    Thinking...
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your documents..."
                        disabled={loading}
                    />
                    <Button type="submit" disabled={loading || !input.trim()}>
                        Send
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
