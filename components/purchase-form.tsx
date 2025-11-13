"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createPurchase } from "@/app/actions/purchase-actions"
import type { Customer, Paint } from "@/lib/db"
import Link from "next/link"

interface PurchaseFormProps {
  customers: Customer[]
  paints: Paint[]
}

export function PurchaseForm({ customers, paints }: PurchaseFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    customer_id: "",
    paint_id: "",
    size: "",
    unit: "litre",
    purchase_date: new Date().toISOString().split("T")[0],
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await createPurchase({
        customer_id: Number.parseInt(formData.customer_id),
        paint_id: Number.parseInt(formData.paint_id),
        size: Number.parseFloat(formData.size),
        unit: formData.unit,
        purchase_date: formData.purchase_date,
        notes: formData.notes,
      })
      router.push("/purchases")
      router.refresh()
    } catch (error) {
      console.error("[v0] Error saving purchase:", error)
      alert("Failed to save purchase")
    } finally {
      setLoading(false)
    }
  }

  if (customers.length === 0 || paints.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold mb-2">Setup Required</h3>
        <p className="text-muted-foreground mb-4">
          {customers.length === 0 && "You need to add customers first. "}
          {paints.length === 0 && "You need to add paint colors first."}
        </p>
        <div className="flex gap-3 justify-center">
          {customers.length === 0 && (
            <Link href="/customers/new">
              <Button>Add Customer</Button>
            </Link>
          )}
          {paints.length === 0 && (
            <Link href="/paints/new">
              <Button>Add Paint</Button>
            </Link>
          )}
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="customer_id">Customer *</Label>
        <Select
          value={formData.customer_id}
          onValueChange={(value) => setFormData({ ...formData, customer_id: value })}
          required
        >
          <SelectTrigger id="customer_id">
            <SelectValue placeholder="Select a customer" />
          </SelectTrigger>
          <SelectContent>
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id.toString()}>
                {customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Don't see the customer?{" "}
          <Link href="/customers/new" className="text-primary hover:underline">
            Add new customer
          </Link>
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paint_id">Paint Color *</Label>
        <Select
          value={formData.paint_id}
          onValueChange={(value) => setFormData({ ...formData, paint_id: value })}
          required
        >
          <SelectTrigger id="paint_id">
            <SelectValue placeholder="Select a paint color" />
          </SelectTrigger>
          <SelectContent>
            {paints.map((paint) => (
              <SelectItem key={paint.id} value={paint.id.toString()}>
                {paint.color_name} - {paint.product_type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Don't see the color?{" "}
          <Link href="/paints/new" className="text-primary hover:underline">
            Add new paint
          </Link>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="size">Size *</Label>
          <Input
            id="size"
            type="number"
            step="0.1"
            min="0.1"
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            placeholder="25"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Input
            id="unit"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            placeholder="litre"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="purchase_date">Purchase Date *</Label>
        <Input
          id="purchase_date"
          type="date"
          value={formData.purchase_date}
          onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any special instructions or details..."
          rows={4}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Recording..." : "Record Purchase"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
