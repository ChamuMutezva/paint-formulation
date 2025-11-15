"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Palette } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Paint, Customer, Formulation } from "@/lib/db";
import { ShareFormulation } from "./share-formulation";

interface ColorSearchResultsProps {
    results: {
        paint: Paint;
        baseFormulations: Formulation[];
        customers: Customer[];
    };
}

export function ColorSearchResults({
    results,
}: Readonly<ColorSearchResultsProps>) {
    const { paint, baseFormulations, customers } = results;
    const [showFormulation, setShowFormulation] = useState(false);

    const scaledFormulations = baseFormulations.map((f) => ({
        ...f,
        quantity:
            typeof f.quantity === "string"
                ? Number.parseFloat(f.quantity)
                : f.quantity,
    }));

    if (!paint) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">
                        No paint color found with that name
                    </p>
                </CardContent>
            </Card>
        );
    }

    const totalQuantity = scaledFormulations.reduce(
        (sum, f) => sum + f.quantity,
        0
    );
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <Palette className="h-6 w-6 text-primary" />
                            <div>
                                <CardTitle>{paint.color_name}</CardTitle>
                                <CardDescription>
                                    {paint.product_type}
                                </CardDescription>
                            </div>
                        </div>
                        <Badge variant="secondary">
                            {customers.length}{" "}
                            {customers.length === 1 ? "customer" : "customers"}
                        </Badge>
                    </div>
                    {paint.description && (
                        <p className="text-sm text-muted-foreground mt-2">
                            {paint.description}
                        </p>
                    )}
                </CardHeader>
                <CardContent>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFormulation(!showFormulation)}
                        className="w-full mb-3"
                    >
                        {showFormulation ? (
                            <>
                                <ChevronUp className="h-4 w-4 mr-2" />
                                Hide Base Formulation
                            </>
                        ) : (
                            <>
                                <ChevronDown className="h-4 w-4 mr-2" />
                                View Base Formulation
                            </>
                        )}
                    </Button>

                    {showFormulation && (
                        <div className="space-y-3">
                            <div className="space-y-2 p-3 bg-muted rounded-lg">
                                <div className="font-medium text-sm mb-2">
                                    Base formula ({paint.base_size}{" "}
                                    {paint.base_unit}):
                                </div>
                                {baseFormulations.length === 0 ? (
                                    <p className="text-sm text-muted-foreground italic">
                                        No formulation available
                                    </p>
                                ) : (
                                    <>
                                        {baseFormulations.map(
                                            (
                                                formulation: Formulation,
                                                idx: number
                                            ) => (
                                                <div
                                                    key={`${formulation.id}-${idx}`}
                                                    className="flex justify-between text-sm"
                                                >
                                                    <span className="text-muted-foreground">
                                                        {
                                                            formulation.component_name
                                                        }
                                                    </span>
                                                    <span className="font-medium">
                                                        {(() => {
                                                            const num =
                                                                Number.parseFloat(
                                                                    formulation.quantity.toString()
                                                                );
                                                            return !isNaN(num)
                                                                ? num.toFixed(3)
                                                                : "0.000";
                                                        })()}{" "}
                                                        {formulation.unit}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                        <div className="border-t border-border pt-2 mt-2 flex justify-between text-sm font-semibold">
                                            <span>Total:</span>
                                            <span>
                                                {typeof totalQuantity ===
                                                "number"
                                                    ? totalQuantity.toFixed(3)
                                                    : (
                                                          Number.parseFloat(
                                                              totalQuantity
                                                          ) || 0
                                                      ).toFixed(3)}{" "}
                                                {paint.base_unit}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                            {baseFormulations.length > 0 && (
                                <ShareFormulation
                                    paintName={paint.color_name}
                                    productType={paint.product_type}
                                    size={paint.base_size}
                                    unit={paint.base_unit}
                                    formulations={baseFormulations.map(
                                        (f: any) => ({
                                            component_name: f.component_name,
                                            quantity: Number(f.quantity),
                                            unit: f.unit,
                                        })
                                    )}
                                />
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div>
                <h3 className="text-lg font-semibold mb-3">
                    Customers Who Purchased This Color
                </h3>
                {customers.length === 0 ? (
                    <Card>
                        <CardContent className="py-8 text-center">
                            <p className="text-muted-foreground">
                                No customers have purchased this color yet
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-3">
                        {customers.map((customer: any) => (
                            <Card key={customer.purchase_id}>
                                <CardContent className="py-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="font-semibold">
                                                {customer.customer_name}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {formatDate(
                                                    customer.purchase_date
                                                )}{" "}
                                                • {customer.size}{" "}
                                                {customer.unit}
                                            </div>
                                            {customer.notes && (
                                                <div className="text-sm text-muted-foreground mt-1">
                                                    {customer.notes}
                                                </div>
                                            )}
                                        </div>
                                        <Link
                                            href={`/purchases/${customer.purchase_id}`}
                                        >
                                            <Button variant="ghost" size="sm">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
