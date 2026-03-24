import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Bell, CheckCheck, Package, User, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Notifications', href: '/notifications' },
];

type NotifType = 'product' | 'account' | 'security' | 'alert';

interface Notification {
    id: number;
    type: NotifType;
    title: string;
    message: string;
    time: string;
    read: boolean;
}

const iconMap: Record<NotifType, React.ElementType> = {
    product: Package,
    account: User,
    security: ShieldCheck,
    alert: AlertTriangle,
};

const colorMap: Record<NotifType, string> = {
    product: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
    account: 'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
    security: 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400',
    alert: 'bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400',
};

const initialNotifications: Notification[] = [
    { id: 1, type: 'product', title: 'New product added', message: 'Product "Wireless Headphones" has been published successfully.', time: '2 minutes ago', read: false },
    { id: 2, type: 'alert', title: 'Low stock warning', message: 'Product "Running Shoes" has only 3 items left in stock.', time: '1 hour ago', read: false },
    { id: 3, type: 'security', title: 'Login from new device', message: 'A login was detected from a new device in Jakarta, ID.', time: '3 hours ago', read: false },
    { id: 4, type: 'account', title: 'Profile updated', message: 'Your profile information has been updated successfully.', time: '1 day ago', read: true },
    { id: 5, type: 'product', title: 'Product review', message: 'A customer left a 5-star review on "Laptop Stand Pro".', time: '2 days ago', read: true },
    { id: 6, type: 'security', title: 'Password changed', message: 'Your account password was changed successfully.', time: '3 days ago', read: true },
    { id: 7, type: 'alert', title: 'System maintenance', message: 'Scheduled maintenance will occur on March 26 from 2–4 AM.', time: '4 days ago', read: true },
    { id: 8, type: 'account', title: 'Email verified', message: 'Your email address has been verified.', time: '5 days ago', read: true },
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(initialNotifications);

    const unread = notifications.filter((n) => !n.read);
    const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    const markRead = (id: number) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

    const renderList = (items: Notification[]) => (
        <div className="space-y-2">
            {items.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <Bell className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p>No notifications</p>
                </div>
            )}
            {items.map((n) => {
                const Icon = iconMap[n.type];
                return (
                    <Card
                        key={n.id}
                        className={`cursor-pointer transition-colors hover:bg-muted/50 ${!n.read ? 'border-primary/30 bg-primary/5' : ''}`}
                        onClick={() => markRead(n.id)}
                    >
                        <CardContent className="p-4">
                            <div className="flex gap-3">
                                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${colorMap[n.type]}`}>
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium">{n.title}</p>
                                        {!n.read && <Badge className="h-1.5 w-1.5 rounded-full p-0 bg-primary" />}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifications" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-6 max-w-2xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
                        {unread.length > 0 && (
                            <Badge>{unread.length} new</Badge>
                        )}
                    </div>
                    {unread.length > 0 && (
                        <Button variant="outline" size="sm" onClick={markAllRead}>
                            <CheckCheck className="mr-2 h-4 w-4" />
                            Mark all read
                        </Button>
                    )}
                </div>

                <Tabs defaultValue="all">
                    <TabsList>
                        <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
                        <TabsTrigger value="unread">Unread ({unread.length})</TabsTrigger>
                    </TabsList>
                    <Separator className="mt-3 mb-4" />
                    <TabsContent value="all">{renderList(notifications)}</TabsContent>
                    <TabsContent value="unread">{renderList(unread)}</TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
