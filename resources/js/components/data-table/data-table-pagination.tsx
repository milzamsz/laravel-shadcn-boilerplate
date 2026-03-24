import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface DataTablePaginationProps {
    meta: PaginationMeta;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
}

export function DataTablePagination({ meta, onPageChange, onPerPageChange }: DataTablePaginationProps) {
    return (
        <div className="flex items-center justify-between px-2">
            <div className="text-sm text-muted-foreground">
                {meta.total > 0 ? (
                    <>Showing {meta.from}–{meta.to} of {meta.total} results</>
                ) : (
                    'No results'
                )}
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Rows per page</span>
                    <Select
                        value={String(meta.per_page)}
                        onValueChange={(v) => onPerPageChange(Number(v))}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[10, 20, 50].map((n) => (
                                <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground">
                        Page {meta.current_page} of {meta.last_page}
                    </span>
                    <Button variant="outline" size="icon" className="h-8 w-8"
                        onClick={() => onPageChange(1)} disabled={meta.current_page === 1}>
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8"
                        onClick={() => onPageChange(meta.current_page - 1)} disabled={meta.current_page === 1}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8"
                        onClick={() => onPageChange(meta.current_page + 1)} disabled={meta.current_page === meta.last_page}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8"
                        onClick={() => onPageChange(meta.last_page)} disabled={meta.current_page === meta.last_page}>
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
