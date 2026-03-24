import { create } from 'zustand';

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: 'low' | 'medium' | 'high';
}

interface KanbanStore {
    tasks: Task[];
    addTask: (task: Omit<Task, 'id'>) => void;
    moveTask: (taskId: string, newStatus: TaskStatus) => void;
    deleteTask: (taskId: string) => void;
    reorderTasks: (activeId: string, overId: string) => void;
}

const initialTasks: Task[] = [
    { id: '1', title: 'Design new landing page', description: 'Create mockups and prototype', status: 'todo', priority: 'high' },
    { id: '2', title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions', status: 'todo', priority: 'medium' },
    { id: '3', title: 'Write API documentation', status: 'todo', priority: 'low' },
    { id: '4', title: 'Implement authentication', description: 'JWT + refresh tokens', status: 'in-progress', priority: 'high' },
    { id: '5', title: 'Database optimization', description: 'Add indexes, review queries', status: 'in-progress', priority: 'medium' },
    { id: '6', title: 'Setup project structure', status: 'done', priority: 'low' },
    { id: '7', title: 'Initial deployment', description: 'Deploy to staging environment', status: 'done', priority: 'medium' },
];

export const useKanbanStore = create<KanbanStore>((set) => ({
    tasks: initialTasks,

    addTask: (task) =>
        set((state) => ({
            tasks: [...state.tasks, { ...task, id: crypto.randomUUID() }],
        })),

    moveTask: (taskId, newStatus) =>
        set((state) => ({
            tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
        })),

    deleteTask: (taskId) =>
        set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== taskId),
        })),

    reorderTasks: (activeId, overId) =>
        set((state) => {
            const tasks = [...state.tasks];
            const activeIdx = tasks.findIndex((t) => t.id === activeId);
            const overIdx = tasks.findIndex((t) => t.id === overId);
            if (activeIdx === -1 || overIdx === -1) return state;
            const [moved] = tasks.splice(activeIdx, 1);
            tasks.splice(overIdx, 0, moved);
            return { tasks };
        }),
}));
