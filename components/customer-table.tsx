"use client"

import type { Customer } from "@/lib/db"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Building2, User } from "lucide-react"
import Link from "next/link"
import { deleteCustomer } from "@/app/actions/customer-actions"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

interface CustomerTableProps {
  customers: Customer[]
}

export function CustomerTable({ customers }: CustomerTableProps) {
  const router = useRouter()

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}? This will also delete all their purchase records.`)) {
      try {
        await deleteCustomer(id)
        router.refresh()
      } catch (error) {
        console.error("[v0] Error deleting customer:", error)
        alert("Failed to delete customer")
      }
    }
  }

  if (customers.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No customers yet</h3>
        <p className="text-muted-foreground mb-4">Get started by adding your first customer</p>
        <Link href="/customers/new">
          <Button>Add Customer</Button>
        </Link>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                {customer.customer_type === "company" ? (
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <User className="h-4 w-4 text-muted-foreground" />
                )}
                {customer.name}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={customer.customer_type === "company" ? "default" : "secondary"}>
                {customer.customer_type}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                {customer.phone && <div>{customer.phone}</div>}
                {customer.email && <div className="text-muted-foreground">{customer.email}</div>}
                {!customer.phone && !customer.email && <span className="text-muted-foreground">-</span>}
              </div>
            </TableCell>
            <TableCell className="max-w-xs truncate">
              {customer.notes || <span className="text-muted-foreground">-</span>}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Link href={`/customers/${customer.id}/edit`}>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(customer.id, customer.name)}>
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
