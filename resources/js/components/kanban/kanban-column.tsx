import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Badge } from '@/components/ui/badge';
import { KanbanCard } from './kanban-card';
import type { Task, TaskStatus } from './kanban-store';

const columnConfig: Record<TaskStatus, { label: string; color: string }> = {
    'todo': { label: 'To Do', color: 'bg-slate-100 dark:bg-slate-800' },
    'in-progress': { label: 'In Progress', color: 'bg-blue-50 dark:bg-blue-950' },
    'done': { label: 'Done', color: 'bg-green-50 dark:bg-green-950' },
};

interface KanbanColumnProps {
    status: TaskStatus;
    tasks: Task[];
    onDelete: (id: string) => void;
}

export function KanbanColumn({ status, tasks, onDelete }: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({ id: status });
    const config = columnConfig[status];

    return (
        <div className="flex flex-col gap-3 min-w-[280px] flex-1">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">{config.label}</h3>
                <Badge variant="secondary">{tasks.length}</Badge>
            </div>
            <div
                ref={setNodeRef}
                className={`flex flex-col gap-2 rounded-lg p-2 min-h-[400px] transition-colors ${config.color} ${
                    isOver ? 'ring-2 ring-primary' : ''
                }`}
            >
                <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <KanbanCard key={task.id} task={task} onDelete={onDelete} />
                    ))}
                </SortableContext>
                {tasks.length === 0 && (
                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                        Drop tasks here
                    </div>
                )}
            </div>
        </div>
    );
}
