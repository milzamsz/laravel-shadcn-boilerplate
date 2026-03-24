import { Head } from '@inertiajs/react';
import { AreaGraph } from '@/components/overview/area-graph';
import { BarGraph } from '@/components/overview/bar-graph';
import { RecentSales } from '@/components/overview/recent-sales';
import { StatsCards } from '@/components/overview/stats-cards';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
];

interface DashboardProps {
    totalRevenue?: number;
    totalProducts?: number;
    totalUsers?: number;
    activeProducts?: number;
}

export default function Dashboard({
    totalRevenue,
    totalProducts,
    totalUsers,
    activeProducts,
}: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 overflow-x-auto">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
                </div>

                <StatsCards
                    totalRevenue={totalRevenue}
                    totalProducts={totalProducts}
                    totalUsers={totalUsers}
                    activeProducts={activeProducts}
                />

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <div className="lg:col-span-4">
                        <AreaGraph />
                    </div>
                    <div className="lg:col-span-3">
                        <RecentSales />
                    </div>
                </div>

                <BarGraph />
            </div>
        </AppLayout>
    );
}
