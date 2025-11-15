import {
    ArrowLeft,
    TrendingUp,
    Users,
    Palette,
    ShoppingCart,
} from "lucide-react";
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
import { getReportData } from "@/lib/queries";

export default async function ReportsPage() {    
    let data;
    let error: string | null = null;
    try {
        data = await getReportData();
    } catch (err) {
        error =
            err instanceof Error ? err.message : "Failed to load report data.";
        data = {
            totalCustomers: 0,
            totalPaints: 0,
            totalPurchases: 0,
            monthlyTrend: [],
            popularColors: [],
            activeCustomers: [],
            recentPurchases: [],
        };
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatMonth = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-border">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center gap-4 mb-2">
                        <Link href="/">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">
                                Reports & Analytics
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Business insights and trends
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Error Display */}
                {error && (
                    <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <p className="text-destructive font-medium">{error}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Showing placeholder data. Please try refreshing the
                            page.
                        </p>
                    </div>
                )}
                {/* Summary Cards */}
                <div className="grid gap-6 md:grid-cols-3 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Customers
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {data.totalCustomers}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Registered in system
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Paint Colors
                            </CardTitle>
                            <Palette className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {data.totalPaints}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                In catalog
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Purchases
                            </CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {data.totalPurchases}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                All time
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Monthly Trend */}
                {data.monthlyTrend.length > 0 && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Monthly Purchase Trend
                            </CardTitle>
                            <CardDescription>
                                Last 6 months activity
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {data.monthlyTrend.map(
                                    (month: any, idx: number) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-4"
                                        >
                                            <div className="w-32 text-sm font-medium">
                                                {formatMonth(month.month)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="h-8 bg-primary/20 rounded-lg relative overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary rounded-lg flex items-center justify-end px-3"
                                                        style={{
                                                            width: `${Math.max(
                                                                (Number(
                                                                    month.purchase_count
                                                                ) /
                                                                    Math.max(
                                                                        ...data.monthlyTrend.map(
                                                                            (
                                                                                m: any
                                                                            ) =>
                                                                                Number(
                                                                                    m.purchase_count
                                                                                )
                                                                        )
                                                                    )) *
                                                                    100,
                                                                10
                                                            )}%`,
                                                        }}
                                                    >
                                                        <span className="text-sm font-semibold text-primary-foreground">
                                                            {
                                                                month.purchase_count
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Most Popular Colors */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Most Popular Colors</CardTitle>
                            <CardDescription>
                                Top selling paint colors
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {data.popularColors.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">
                                    No purchase data available
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {data.popularColors.map(
                                        (color: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Badge
                                                        variant="secondary"
                                                        className="w-8 h-8 rounded-full flex items-center justify-center"
                                                    >
                                                        {idx + 1}
                                                    </Badge>
                                                    <div>
                                                        <div className="font-medium">
                                                            {color.color_name}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {color.product_type}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold">
                                                        {color.purchase_count}{" "}
                                                        sales
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {Number(
                                                            color.total_volume
                                                        ).toFixed(1)}
                                                        L total
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Most Active Customers */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Most Active Customers</CardTitle>
                            <CardDescription>
                                Top customers by purchase count
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {data.activeCustomers.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">
                                    No customer data available
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {data.activeCustomers.map(
                                        (customer: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Badge
                                                        variant="secondary"
                                                        className="w-8 h-8 rounded-full flex items-center justify-center"
                                                    >
                                                        {idx + 1}
                                                    </Badge>
                                                    <div>
                                                        <div className="font-medium">
                                                            {customer.name}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {customer.customer_type ===
                                                            "company"
                                                                ? "Company"
                                                                : "Individual"}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold">
                                                        {
                                                            customer.purchase_count
                                                        }{" "}
                                                        purchases
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Last:{" "}
                                                        {formatDate(
                                                            customer.last_purchase
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest 10 purchases</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {data.recentPurchases.length === 0 ? (
                            <p className="text-muted-foreground text-center py-8">
                                No recent purchases
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {data.recentPurchases.map(
                                    (purchase: any, idx: number) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-3 bg-muted rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <div className="font-medium">
                                                    {purchase.customer_name}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {purchase.color_name} -{" "}
                                                    {purchase.product_type}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Badge variant="secondary">
                                                    {purchase.size}{" "}
                                                    {purchase.unit}
                                                </Badge>
                                                <div className="text-sm text-muted-foreground min-w-24 text-right">
                                                    {formatDate(
                                                        purchase.purchase_date
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
