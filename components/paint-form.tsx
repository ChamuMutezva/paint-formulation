"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, GripVertical } from "lucide-react"
import { createPaint, updatePaint } from "@/app/actions/paint-actions"
import type { Paint, Formulation } from "@/lib/db"
import { ImageFormulationExtractor } from "./image-formulation-extractor"

interface PaintWithFormulation extends Paint {
  formulations: Formulation[]
}

interface PaintFormProps {
  paint?: PaintWithFormulation
}

interface FormulationInput {
  component_name: string
  quantity: string
  unit: string
  sort_order: number
}

export function PaintForm({ paint }: PaintFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    color_name: paint?.color_name || "",
    product_type: paint?.product_type || "",
    base_size: paint?.base_size?.toString() || "1",
    base_unit: paint?.base_unit || "litre",
    description: paint?.description || "",
  })

  const [formulations, setFormulations] = useState<FormulationInput[]>(
    paint?.formulations.map((f, idx) => ({
      component_name: f.component_name,
      quantity: f.quantity.toString(),
      unit: f.unit,
      sort_order: idx,
    })) || [{ component_name: "", quantity: "", unit: "litre", sort_order: 0 }],
  )

  const addFormulation = () => {
    setFormulations([
      ...formulations,
      { component_name: "", quantity: "", unit: "litre", sort_order: formulations.length },
    ])
  }

  const removeFormulation = (index: number) => {
    setFormulations(formulations.filter((_, i) => i !== index))
  }

  const updateFormulation = (index: number, field: keyof FormulationInput, value: string) => {
    const updated = [...formulations]
    updated[index] = { ...updated[index], [field]: value }
    setFormulations(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const paintData = {
        ...formData,
        base_size: Number.parseFloat(formData.base_size) || 1,
      }

      const formulationData = formulations
        .filter((f) => f.component_name && f.quantity)
        .map((f, idx) => ({
          component_name: f.component_name,
          quantity: Number.parseFloat(f.quantity) || 0,
          unit: f.unit,
          sort_order: idx,
        }))

      if (paint) {
        await updatePaint(paint.id, paintData, formulationData)
      } else {
        await createPaint(paintData, formulationData)
      }
      router.push("/paints")
      router.refresh()
    } catch (error) {
      console.error("[v0] Error saving paint:", error)
      alert("Failed to save paint")
    } finally {
      setLoading(false)
    }
  }

   const handleExtractedData = (data: any) => {
    setFormData({
      color_name: data.colorName,
      product_type: data.productType,
      base_size: data.baseSize.toString(),
      base_unit: data.baseUnit,
      description: data.description || "",
    })

    setFormulations(
      data.components.map((comp: any, idx: number) => ({
        component_name: comp.name,
        quantity: comp.quantity.toString(),
        unit: comp.unit,
        sort_order: idx,
      }))
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!paint && (
        <ImageFormulationExtractor onExtracted={handleExtractedData} />
      )}
      <Card>
        <CardHeader>
          <CardTitle>Paint Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="color_name">Color Name *</Label>
              <Input
                id="color_name"
                value={formData.color_name}
                onChange={(e) => setFormData({ ...formData, color_name: e.target.value })}
                placeholder="e.g., Pipe Blue"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product_type">Product Type *</Label>
              <Input
                id="product_type"
                value={formData.product_type}
                onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
                placeholder="e.g., QD Enamel"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="base_size">Base Size *</Label>
              <Input
                id="base_size"
                type="number"
                step="0.1"
                min="0.1"
                value={formData.base_size}
                onChange={(e) => setFormData({ ...formData, base_size: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">The size your formulation is calculated for</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="base_unit">Unit</Label>
              <Input
                id="base_unit"
                value={formData.base_unit}
                onChange={(e) => setFormData({ ...formData, base_unit: e.target.value })}
                placeholder="litre"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Any additional details about this paint..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Formulation Components</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addFormulation}>
              <Plus className="h-4 w-4 mr-2" />
              Add Component
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {formulations.length === 0 && <p className="text-sm text-muted-foreground italic">No components added yet</p>}

          {formulations.map((formulation, index) => (
            <div key={index} className="flex gap-3 items-start p-4 bg-muted rounded-lg">
              <div className="pt-3">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 grid gap-3 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor={`component-${index}`}>Component Name</Label>
                  <Input
                    id={`component-${index}`}
                    value={formulation.component_name}
                    onChange={(e) => updateFormulation(index, "component_name", e.target.value)}
                    placeholder="e.g., Ford Tractor Blue"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                  <Input
                    id={`quantity-${index}`}
                    type="number"
                    step="0.001"
                    min="0"
                    value={formulation.quantity}
                    onChange={(e) => updateFormulation(index, "quantity", e.target.value)}
                    placeholder="0.8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`unit-${index}`}>Unit</Label>
                  <Input
                    id={`unit-${index}`}
                    value={formulation.unit}
                    onChange={(e) => updateFormulation(index, "unit", e.target.value)}
                    placeholder="litre"
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFormulation(index)}
                className="mt-8"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}

          {formulations.length > 0 && (
            <div className="text-sm text-muted-foreground bg-accent/50 p-3 rounded-lg">
              <strong>Total:</strong>{" "}
              {formulations.reduce((sum, f) => sum + (Number.parseFloat(f.quantity) || 0), 0).toFixed(3)}{" "}
              {formData.base_unit}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : paint ? "Update Paint" : "Add Paint"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
