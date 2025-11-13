"use client"

import { scaleFormulation } from "@/lib/utils"
import type { PaintWithFormulation } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Palette, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { deletePaint } from "@/app/actions/paint-actions"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PaintCatalogProps {
  paints: PaintWithFormulation[]
}

export function PaintCatalog({ paints }: PaintCatalogProps) {
  const router = useRouter()

  const handleDelete = async (id: number, colorName: string) => {
    if (
      confirm(
        `Are you sure you want to delete ${colorName}? This will also delete its formulations and purchase records.`,
      )
    ) {
      try {
        await deletePaint(id)
        router.refresh()
      } catch (error) {
        console.error("[v0] Error deleting paint:", error)
        alert("Failed to delete paint")
      }
    }
  }

  if (paints.length === 0) {
    return (
      <div className="text-center py-12">
        <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No paints in catalog</h3>
        <p className="text-muted-foreground mb-4">Get started by adding your first paint color</p>
        <Link href="/paints/new">
          <Button>Add Paint Color</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {paints.map((paint) => (
        <PaintCard key={paint.id} paint={paint} onDelete={handleDelete} />
      ))}
    </div>
  )
}

function PaintCard({ paint, onDelete }: { paint: PaintWithFormulation; onDelete: (id: number, name: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const [customSize, setCustomSize] = useState(paint.base_size.toString())
  const [scaledFormulations, setScaledFormulations] = useState(() =>
    paint.formulations.map((f) => ({
      ...f,
      quantity: typeof f.quantity === "string" ? Number.parseFloat(f.quantity) : f.quantity,
    })),
  )
  const handleSizeChange = (newSize: string) => {
    setCustomSize(newSize)
    const size = Number.parseFloat(newSize) || paint.base_size
    const scaled = paint.formulations.map((f) => scaleFormulation(f, size, paint.base_size))
    setScaledFormulations(scaled)
  }

  const totalQuantity = scaledFormulations.reduce((sum, f) => sum + f.quantity, 0)

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{paint.color_name}</CardTitle>
            <CardDescription>{paint.product_type}</CardDescription>
          </div>
          <div className="flex gap-1">
            <Link href={`/paints/${paint.id}/edit`}>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => onDelete(paint.id, paint.color_name)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
        {paint.description && <p className="text-sm text-muted-foreground mt-2">{paint.description}</p>}
      </CardHeader>
      <CardContent className="flex-1">
        {paint.formulations.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No formulation added yet</p>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`size-${paint.id}`} className="text-sm">
                Calculate for size:
              </Label>
              <div className="flex gap-2">
                <Input
                  id={`size-${paint.id}`}
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={customSize}
                  onChange={(e) => handleSizeChange(e.target.value)}
                  className="flex-1"
                />
                <Badge variant="secondary" className="self-center">
                  {paint.base_unit}
                </Badge>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={() => setExpanded(!expanded)} className="w-full">
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
                {scaledFormulations.map((formulation, idx) => (
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
                    {totalQuantity.toFixed(3)} {paint.base_unit}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
