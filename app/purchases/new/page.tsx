import { sql } from "@/lib/db"
import type { Customer, Paint } from "@/lib/db"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PurchaseForm } from "@/components/purchase-form"

async function getCustomersAndPaints() {
  try {
    const customers = await sql`
      SELECT * FROM customers ORDER BY name ASC
    `
    const paints = await sql`
      SELECT * FROM paints ORDER BY color_name ASC
    `
    return {
      customers: customers as Customer[],
      paints: paints as Paint[],
    }
  } catch (error) {
    console.error("[v0] Error fetching data:", error)
    return { customers: [], paints: [] }
  }
}

export default async function NewPurchasePage() {
  const { customers, paints } = await getCustomersAndPaints()

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
              <h1 className="text-3xl font-bold text-foreground">Record New Purchase</h1>
              <p className="text-muted-foreground mt-1">Log a customer paint purchase</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Purchase Information</CardTitle>
          </CardHeader>
          <CardContent>
            <PurchaseForm customers={customers} paints={paints} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
