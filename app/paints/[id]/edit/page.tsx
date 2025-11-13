import { sql } from "@/lib/db"
import type { Paint, Formulation } from "@/lib/db"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PaintForm } from "@/components/paint-form"
import { notFound } from "next/navigation"

async function getPaintWithFormulations(id: string) {
  try {
    const paintResult = await sql`
      SELECT * FROM paints WHERE id = ${id}
    `

    if (paintResult.length === 0) return null

    const formulationResult = await sql`
      SELECT * FROM formulations 
      WHERE paint_id = ${id}
      ORDER BY sort_order ASC
    `

    return {
      ...(paintResult[0] as Paint),
      formulations: formulationResult as Formulation[],
    }
  } catch (error) {
    console.error("[v0] Error fetching paint:", error)
    return null
  }
}

export default async function EditPaintPage({ params }: { params: { id: string } }) {
  const paint = await getPaintWithFormulations(params.id)

  if (!paint) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/paints">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Edit Paint Color</h1>
              <p className="text-muted-foreground mt-1">Update paint information and formulation</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <PaintForm paint={paint} />
      </main>
    </div>
  )
}
