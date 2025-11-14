import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PurchaseList } from "@/components/purchase-list";
import { getPurchases } from "@/lib/queries";

export default async function PurchasesPage() {
    const purchases = await getPurchases();

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
                                Purchase Records
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                View and manage customer paint purchases
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-semibold">All Purchases</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {purchases.length}{" "}
                            {purchases.length === 1 ? "purchase" : "purchases"}{" "}
                            recorded
                        </p>
                    </div>
                    <Link href="/purchases/new">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Record Purchase
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Purchase History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PurchaseList purchases={purchases} />
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
