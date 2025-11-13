import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Palette, ShoppingCart, BarChart3, Search } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">Paint Formulation Manager</h1>
          <p className="text-muted-foreground mt-1">Color matching and tinting management system</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/customers">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Customers</CardTitle>
                </div>
                <CardDescription>Manage customer records and company details</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Add, view, and edit customer information</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/paints">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Palette className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Paint Catalog</CardTitle>
                </div>
                <CardDescription>Browse colors and formulations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">View paint colors and their mixing recipes</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/purchases">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Record Purchase</CardTitle>
                </div>
                <CardDescription>Log new customer paint purchases</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Link customers to their paint orders</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/search">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Search</CardTitle>
                </div>
                <CardDescription>Find customers and formulations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Search by customer or color name</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/reports">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Reports</CardTitle>
                </div>
                <CardDescription>View analytics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Popular colors and customer trends</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}
