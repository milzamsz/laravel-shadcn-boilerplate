import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Head, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const productSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    category: z.string().min(1, 'Category is required'),
    price: z.coerce.number().min(0, 'Price must be positive'),
    status: z.enum(['active', 'inactive', 'draft']),
    description: z.string().max(1000).optional(),
});

type ProductForm = z.infer<typeof productSchema>;

interface Product {
    id: number;
    name: string;
    category: string;
    price: string;
    status: 'active' | 'inactive' | 'draft';
    description?: string;
}

const CATEGORIES = ['Electronics', 'Clothing', 'Food', 'Books', 'Sports', 'Toys', 'Beauty', 'Home'];

export default function ProductForm({ product }: { product: Product | null }) {
    const isEditing = product !== null;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Products', href: '/products' },
        { title: isEditing ? 'Edit Product' : 'New Product', href: '#' },
    ];

    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<ProductForm>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: product?.name ?? '',
            category: product?.category ?? '',
            price: product ? parseFloat(product.price) : 0,
            status: product?.status ?? 'draft',
            description: product?.description ?? '',
        },
    });

    const onSubmit = (data: ProductForm) => {
        if (isEditing) {
            router.put(`/products/${product.id}`, data, {
                onSuccess: () => toast.success('Product updated.'),
                onError: () => toast.error('Failed to update product.'),
            });
        } else {
            router.post('/products', data, {
                onSuccess: () => toast.success('Product created.'),
                onError: () => toast.error('Failed to create product.'),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? 'Edit Product' : 'New Product'} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 max-w-2xl">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        {isEditing ? 'Edit Product' : 'New Product'}
                    </h2>
                    <p className="text-muted-foreground">
                        {isEditing ? 'Update product details.' : 'Add a new product to your catalog.'}
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Product Details</CardTitle>
                        <CardDescription>Fill in the information below.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" {...register('name')} placeholder="Product name" />
                                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select
                                        value={watch('category')}
                                        onValueChange={(v) => setValue('category', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map((c) => (
                                                <SelectItem key={c} value={c}>{c}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price">Price ($)</Label>
                                    <Input id="price" type="number" step="0.01" {...register('price')} placeholder="0.00" />
                                    {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select
                                    value={watch('status')}
                                    onValueChange={(v) => setValue('status', v as 'active' | 'inactive' | 'draft')}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    {...register('description')}
                                    placeholder="Optional product description"
                                    rows={3}
                                />
                                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isEditing ? 'Update Product' : 'Create Product'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => router.get('/products')}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
