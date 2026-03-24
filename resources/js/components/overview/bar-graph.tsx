import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
    { name: 'Electronics', sales: 186 },
    { name: 'Clothing', sales: 305 },
    { name: 'Food', sales: 237 },
    { name: 'Books', sales: 73 },
    { name: 'Sports', sales: 209 },
    { name: 'Toys', sales: 214 },
    { name: 'Beauty', sales: 142 },
    { name: 'Home', sales: 189 },
];

export function BarGraph() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Units sold per product category this month</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 11 }}
                            className="fill-muted-foreground"
                        />
                        <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                            }}
                        />
                        <Bar
                            dataKey="sales"
                            fill="hsl(var(--primary))"
                            radius={[4, 4, 0, 0]}
                            name="Sales"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
