"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Building2, User } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface CustomerSearchResultsProps {
  results: {
    customer: any
    purchases: any[]
  }
}

export function CustomerSearchResults({ results }: Readonly<CustomerSearchResultsProps>) {
  const { customer, purchases } = results

  if (!customer) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No customer found with that name</p>
        </CardContent>
      </Card>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {customer.customer_type === "company" ? (
                <Building2 className="h-6 w-6 text-primary" />
              ) : (
                <User className="h-6 w-6 text-primary" />
              )}
              <div>
                <CardTitle>{customer.name}</CardTitle>
                <CardDescription>
                  {customer.customer_type === "company" ? "Company" : "Individual"}
                  {customer.phone && ` • ${customer.phone}`}
                  {customer.email && ` • ${customer.email}`}
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary">
              {purchases.length} {purchases.length === 1 ? "purchase" : "purchases"}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-3">Purchase History</h3>
        {purchases.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No purchases found for this customer</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {purchases.map((purchase: any) => (
              <PurchaseCard key={purchase.id} purchase={purchase} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function PurchaseCard({ purchase }: { purchase: any }) {
  const [expanded, setExpanded] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const totalQuantity = purchase.formulations.reduce((sum: number, f: any) => sum + f.quantity, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{purchase.color_name}</CardTitle>
            <CardDescription>{purchase.product_type}</CardDescription>
          </div>
          <Badge variant="secondary">
            {purchase.size} {purchase.unit}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">Purchased: {formatDate(purchase.purchase_date)}</div>
      </CardHeader>
      <CardContent>
        <Button variant="outline" size="sm" onClick={() => setExpanded(!expanded)} className="w-full mb-3">
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" />
              Hide Formulation
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              View Formulation
            </>
          )}
        </Button>

        {expanded && (
          <div className="space-y-2 p-3 bg-muted rounded-lg">
            <div className="font-medium text-sm mb-2">Components:</div>
            {purchase.formulations.map((formulation: any, idx: number) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{formulation.component_name}</span>
                <span className="font-medium">
                  {formulation.quantity.toFixed(3)} {formulation.unit}
                </span>
              </div>
            ))}
            <div className="border-t border-border pt-2 mt-2 flex justify-between text-sm font-semibold">
              <span>Total:</span>
              <span>
                {totalQuantity.toFixed(3)} {purchase.unit}
              </span>
            </div>
          </div>
        )}

        <Link href={`/purchases/${purchase.id}`} className="block mt-3">
          <Button variant="ghost" size="sm" className="w-full">
            View Full Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
