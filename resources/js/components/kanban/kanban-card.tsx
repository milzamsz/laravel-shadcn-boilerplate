import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Task } from './kanban-store';

const priorityVariant: Record<Task['priority'], 'default' | 'secondary' | 'destructive'> = {
    low: 'secondary',
    medium: 'default',
    high: 'destructive',
};

interface KanbanCardProps {
    task: Task;
    onDelete: (id: string) => void;
}

export function KanbanCard({ task, onDelete }: KanbanCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={`cursor-default ${isDragging ? 'shadow-lg' : ''}`}
        >
            <CardContent className="p-3">
                <div className="flex items-start gap-2">
                    <div
                        {...attributes}
                        {...listeners}
                        className="mt-0.5 cursor-grab text-muted-foreground hover:text-foreground"
                    >
                        <GripVertical className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-tight">{task.title}</p>
                        {task.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {task.description}
                            </p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                            <Badge variant={priorityVariant[task.priority]} className="text-xs capitalize">
                                {task.priority}
                            </Badge>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                onClick={() => onDelete(task.id)}
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
