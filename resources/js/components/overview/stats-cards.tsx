import { TrendingUp, TrendingDown, Users, Package, DollarSign, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StatsCardsProps {
    totalRevenue?: number;
    totalProducts?: number;
    totalUsers?: number;
    activeProducts?: number;
}

export function StatsCards({
    totalRevenue = 45231.89,
    totalProducts = 0,
    totalUsers = 0,
    activeProducts = 0,
}: StatsCardsProps) {
    const stats = [
        {
            title: 'Total Revenue',
            value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            change: '+20.1% from last month',
            trend: 'up' as const,
            icon: DollarSign,
        },
        {
            title: 'Total Users',
            value: `+${totalUsers.toLocaleString()}`,
            change: '+180.1% from last month',
            trend: 'up' as const,
            icon: Users,
        },
        {
            title: 'Products',
            value: `+${totalProducts.toLocaleString()}`,
            change: `${activeProducts} active`,
            trend: 'up' as const,
            icon: Package,
        },
        {
            title: 'Active Now',
            value: '+573',
            change: '+201 since last hour',
            trend: 'up' as const,
            icon: Activity,
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="flex items-center gap-1 mt-1">
                            {stat.trend === 'up' ? (
                                <TrendingUp className="h-3 w-3 text-emerald-500" />
                            ) : (
                                <TrendingDown className="h-3 w-3 text-red-500" />
                            )}
                            <p className="text-xs text-muted-foreground">{stat.change}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
