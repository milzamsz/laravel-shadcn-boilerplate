import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const sales = [
    { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '+$1,999.00', initials: 'OM' },
    { name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: '+$39.00', initials: 'JL' },
    { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: '+$299.00', initials: 'IN' },
    { name: 'William Kim', email: 'will@email.com', amount: '+$99.00', initials: 'WK' },
    { name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: '+$39.00', initials: 'SD' },
];

export function RecentSales() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>You made 265 sales this month.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {sales.map((sale) => (
                        <div key={sale.email} className="flex items-center gap-4">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback>{sale.initials}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1 min-w-0">
                                <p className="text-sm font-medium leading-none truncate">{sale.name}</p>
                                <p className="text-sm text-muted-foreground truncate">{sale.email}</p>
                            </div>
                            <div className="ml-auto font-medium text-sm">{sale.amount}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
