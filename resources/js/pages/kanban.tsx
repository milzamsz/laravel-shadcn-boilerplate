import { useState } from 'react';
import { Head } from '@inertiajs/react';
import {
    DndContext,
    type DragEndEvent,
    type DragOverEvent,
    DragOverlay,
    type DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { KanbanColumn } from '@/components/kanban/kanban-column';
import { KanbanCard } from '@/components/kanban/kanban-card';
import { useKanbanStore, type Task, type TaskStatus } from '@/components/kanban/kanban-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kanban', href: '/kanban' },
];

const COLUMNS: TaskStatus[] = ['todo', 'in-progress', 'done'];

export default function KanbanPage() {
    const { tasks, addTask, moveTask, deleteTask, reorderTasks } = useKanbanStore();
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [open, setOpen] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'medium' as Task['priority'],
    });

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const handleDragStart = ({ active }: DragStartEvent) => {
        setActiveTask(tasks.find((t) => t.id === active.id) ?? null);
    };

    const handleDragOver = ({ active, over }: DragOverEvent) => {
        if (!over) return;
        const activeTask = tasks.find((t) => t.id === active.id);
        if (!activeTask) return;

        // Over a column droppable
        if (COLUMNS.includes(over.id as TaskStatus)) {
            if (activeTask.status !== over.id) {
                moveTask(active.id as string, over.id as TaskStatus);
            }
        }
    };

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        setActiveTask(null);
        if (!over || active.id === over.id) return;

        // Reorder within same column
        const activeTask = tasks.find((t) => t.id === active.id);
        const overTask = tasks.find((t) => t.id === over.id);
        if (activeTask && overTask && activeTask.status === overTask.status) {
            reorderTasks(active.id as string, over.id as string);
        }
    };

    const handleAddTask = () => {
        if (!newTask.title.trim()) return;
        addTask({ ...newTask, status: 'todo' });
        toast.success('Task added.');
        setNewTask({ title: '', description: '', priority: 'medium' });
        setOpen(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kanban" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Kanban Board</h2>
                        <p className="text-muted-foreground">Drag and drop to manage tasks.</p>
                    </div>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Task</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input
                                        value={newTask.title}
                                        onChange={(e) => setNewTask((p) => ({ ...p, title: e.target.value }))}
                                        placeholder="Task title"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description (optional)</Label>
                                    <Input
                                        value={newTask.description}
                                        onChange={(e) => setNewTask((p) => ({ ...p, description: e.target.value }))}
                                        placeholder="Short description"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Priority</Label>
                                    <Select
                                        value={newTask.priority}
                                        onValueChange={(v) => setNewTask((p) => ({ ...p, priority: v as Task['priority'] }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={handleAddTask} className="w-full">
                                    Add Task
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex gap-4 overflow-x-auto pb-4">
                        {COLUMNS.map((status) => (
                            <KanbanColumn
                                key={status}
                                status={status}
                                tasks={tasks.filter((t) => t.status === status)}
                                onDelete={(id) => {
                                    deleteTask(id);
                                    toast.success('Task deleted.');
                                }}
                            />
                        ))}
                    </div>
                    <DragOverlay>
                        {activeTask ? (
                            <KanbanCard task={activeTask} onDelete={() => {}} />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>
        </AppLayout>
    );
}
