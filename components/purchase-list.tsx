"use client"

import type { PurchaseWithDetails } from "@/lib/db"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2, ShoppingCart, Eye } from "lucide-react"
import Link from "next/link"
import { deletePurchase } from "@/app/actions/purchase-actions"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

interface PurchaseListProps {
  purchases: PurchaseWithDetails[]
}

export function PurchaseList({ purchases }: PurchaseListProps) {
  const router = useRouter()

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this purchase record?")) {
      try {
        await deletePurchase(id)
        router.refresh()
      } catch (error) {
        console.error("[v0] Error deleting purchase:", error)
        alert("Failed to delete purchase")
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (purchases.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No purchases recorded yet</h3>
        <p className="text-muted-foreground mb-4">Start recording customer paint purchases</p>
        <Link href="/purchases/new">
          <Button>Record Purchase</Button>
        </Link>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Paint</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {purchases.map((purchase) => (
          <TableRow key={purchase.id}>
            <TableCell className="font-medium">{formatDate(purchase.purchase_date)}</TableCell>
            <TableCell>{purchase.customer_name}</TableCell>
            <TableCell>
              <div>
                <div className="font-medium">{purchase.color_name}</div>
                <div className="text-sm text-muted-foreground">{purchase.product_type}</div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">
                {purchase.size} {purchase.unit}
              </Badge>
            </TableCell>
            <TableCell className="max-w-xs truncate">
              {purchase.notes || <span className="text-muted-foreground">-</span>}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Link href={`/purchases/${purchase.id}`}>
                  <Button variant="ghost" size="icon" title="View details">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(purchase.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
