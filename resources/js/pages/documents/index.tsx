import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';

interface Document {
    id: number;
    title: string;
    content: string;
    source?: string;
    created_at: string;
}

interface PaginatedDocs {
    data: Document[];
    current_page: number;
    last_page: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Documents', href: '/documents' },
];

export default function DocumentsIndex({ documents }: { documents: PaginatedDocs }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        content: '',
        source: '',
        file: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/documents', {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this document? This cannot be undone.')) {
            router.delete(`/documents/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Documents" />

            <div className="max-w-4xl mx-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
                        <p className="text-muted-foreground mt-1">
                            Your knowledge base. Documents are automatically embedded for semantic search.
                        </p>
                    </div>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button>Add Document</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Add New Document</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Document title" required />
                                    {errors.title && (
                                        <p className="text-sm text-destructive">{errors.title}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="content">Content</Label>
                                    <Textarea id="content" value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        placeholder="Paste or type document content..."
                                        rows={6} required />
                                    {errors.content && (
                                        <p className="text-sm text-destructive">{errors.content}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="source">Source (optional)</Label>
                                    <Input id="source" value={data.source}
                                        onChange={(e) => setData('source', e.target.value)}
                                        placeholder="URL or filename" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="file">Attachment (optional)</Label>
                                    <Input id="file" type="file"
                                        onChange={(e) => setData('file', e.target.files?.[0] ?? null)} />
                                </div>
                                <Button type="submit" className="w-full" disabled={processing}>
                                    {processing ? 'Creating & Embedding...' : 'Create Document'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Document List */}
                <div className="space-y-3">
                    {documents.data.map((doc) => (
                        <Card key={doc.id}>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">{doc.title}</CardTitle>
                                    <Button variant="ghost" size="sm"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => handleDelete(doc.id)}>
                                        Delete
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {doc.content}
                                </p>
                                {doc.source && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Source: {doc.source}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}

                    {documents.data.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            No documents yet. Add your first document to start building your knowledge base.
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
