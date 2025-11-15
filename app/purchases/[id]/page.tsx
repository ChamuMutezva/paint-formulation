import type React from "react";
import { scaleFormulation } from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { getPurchaseDetails } from "@/lib/queries";

export default async function PurchaseDetailPage({
    params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
    const { id } = await params;
    const data = await getPurchaseDetails(id);

    if (!data) {
        notFound();
    }

    const { purchase, customer, paint, formulations } = data;

    // Scale formulations to the purchased size
    const scaledFormulations = formulations.map((f) =>
        scaleFormulation(f, purchase.size, paint.base_size)
    );

    const totalQuantity = scaledFormulations.reduce(
        (sum, f) => sum + f.quantity,
        0
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-border">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center gap-4">
                        <Link href="/purchases">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">
                                Purchase Details
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                View purchase and formulation information
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Purchase Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Purchase Date</Label>
                                <p className="text-lg font-medium">
                                    {formatDate(purchase.purchase_date)}
                                </p>
                            </div>

                            <div>
                                <Label>Customer</Label>
                                <p className="text-lg font-medium">
                                    {customer.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {customer.customer_type === "company"
                                        ? "Company"
                                        : "Individual"}
                                </p>
                            </div>

                            <div>
                                <Label>Size Ordered</Label>
                                <Badge className="text-base mt-1">
                                    {purchase.size} {purchase.unit}
                                </Badge>
                            </div>

                            {purchase.notes && (
                                <div>
                                    <Label>Notes</Label>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {purchase.notes}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Paint Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Color Name</Label>
                                <p className="text-lg font-medium">
                                    {paint.color_name}
                                </p>
                            </div>

                            <div>
                                <Label>Product Type</Label>
                                <p className="text-lg font-medium">
                                    {paint.product_type}
                                </p>
                            </div>

                            {paint.description && (
                                <div>
                                    <Label>Description</Label>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {paint.description}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>
                            Formulation for {purchase.size} {purchase.unit}
                        </CardTitle>
                        <CardDescription>
                            Scaled from base formula ({paint.base_size}{" "}
                            {paint.base_unit})
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {scaledFormulations.length === 0 ? (
                            <p className="text-muted-foreground italic">
                                No formulation available for this paint
                            </p>
                        ) : (
                            <div className="space-y-4">
                                <div className="grid gap-3">
                                    {scaledFormulations.map(
                                        (formulation, idx) => (
                                            <div
                                                key={idx}
                                                className="flex justify-between items-center p-4 bg-muted rounded-lg"
                                            >
                                                <span className="font-medium">
                                                    {formulation.component_name}
                                                </span>
                                                <Badge
                                                    variant="secondary"
                                                    className="text-base"
                                                >
                                                    {formulation.quantity.toFixed(
                                                        3
                                                    )}{" "}
                                                    {formulation.unit}
                                                </Badge>
                                            </div>
                                        )
                                    )}
                                </div>

                                <div className="border-t border-border pt-4 flex justify-between items-center">
                                    <span className="text-lg font-semibold">
                                        Total:
                                    </span>
                                    <Badge className="text-base">
                                        {totalQuantity.toFixed(3)}{" "}
                                        {purchase.unit}
                                    </Badge>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex gap-3 mt-6">
                    <Link href="/purchases">
                        <Button variant="outline">Back to Purchases</Button>
                    </Link>
                    <Link href="/search">
                        <Button>Search More</Button>
                    </Link>
                </div>
            </main>
        </div>
    );
}

function Label({ children }: { children: React.ReactNode }) {
    return (
        <div className="text-sm font-medium text-muted-foreground mb-1">
            {children}
        </div>
    );
}
