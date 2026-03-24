import { useState } from 'react';
import { router, Head } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface SearchResult {
    id: number;
    title: string;
    content: string;
    distance: number;
    relevance: number;
    source?: string;
    created_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Search', href: '/search' },
];

export default function Search({
    results = [],
    query = '',
}: {
    results?: SearchResult[];
    query?: string;
}) {
    const [searchQuery, setSearchQuery] = useState(query);
    const [searching, setSearching] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setSearching(true);
        router.get('/search', { q: searchQuery }, {
            preserveState: true,
            onFinish: () => setSearching(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Semantic Search" />

            <div className="max-w-3xl mx-auto p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Semantic Search</h1>
                    <p className="text-muted-foreground mt-1">
                        Search by meaning, not just keywords. Powered by pgvector + OpenRouter.
                    </p>
                </div>

                <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Describe what you're looking for..."
                        className="flex-1"
                    />
                    <Button type="submit" disabled={searching || !searchQuery.trim()}>
                        {searching ? 'Searching...' : 'Search'}
                    </Button>
                </form>

                {/* Results */}
                <div className="space-y-3">
                    {results.map((r) => (
                        <Card key={r.id} className="transition-colors hover:bg-muted/50">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between gap-2">
                                    <CardTitle className="text-base font-semibold">
                                        {r.title}
                                    </CardTitle>
                                    <Badge variant="secondary" className="shrink-0">
                                        {(r.relevance * 100).toFixed(0)}% match
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {r.content}
                                </p>
                                <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                                    {r.source && <span>Source: {r.source}</span>}
                                    <span>{r.created_at}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {results.length === 0 && query && (
                        <div className="text-center py-12 text-muted-foreground">
                            No results found for &ldquo;{query}&rdquo;. Try a different description.
                        </div>
                    )}

                    {!query && (
                        <div className="text-center py-12 text-muted-foreground">
                            Enter a search query to find relevant documents.
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
