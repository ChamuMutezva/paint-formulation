import { sql } from "@/lib/db"
import type { Customer } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CustomerTable } from "@/components/customer-table"

async function getCustomers(): Promise<Customer[]> {
  try {
    const customers = await sql`
      SELECT * FROM customers 
      ORDER BY name ASC
    `
    return customers as Customer[]
  } catch (error) {
    console.error("[v0] Error fetching customers:", error)
    return []
  }
}

export default async function CustomersPage() {
  const customers = await getCustomers()

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
              <h1 className="text-3xl font-bold text-foreground">Customers</h1>
              <p className="text-muted-foreground mt-1">Manage customer and company records</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">All Customers</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {customers.length} {customers.length === 1 ? "customer" : "customers"} registered
            </p>
          </div>
          <Link href="/customers/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Customer List</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerTable customers={customers} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
