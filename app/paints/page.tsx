import { sql } from "@/lib/db"
import type { Paint, Formulation } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { PaintCatalog } from "@/components/paint-catalog"

async function getPaintsWithFormulations() {
  try {
    const paints = await sql`
      SELECT * FROM paints 
      ORDER BY color_name ASC
    `

    const formulations = await sql`
      SELECT * FROM formulations 
      ORDER BY paint_id, sort_order ASC
    `

    // Group formulations by paint_id
    const paintsWithFormulations = (paints as Paint[]).map((paint) => ({
      ...paint,
      formulations: (formulations as Formulation[]).filter((f) => f.paint_id === paint.id),
    }))

    return paintsWithFormulations
  } catch (error) {
    console.error("[v0] Error fetching paints:", error)
    return []
  }
}

export default async function PaintsPage() {
  const paints = await getPaintsWithFormulations()

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
              <h1 className="text-3xl font-bold text-foreground">Paint Catalog</h1>
              <p className="text-muted-foreground mt-1">Browse colors and their formulations</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">All Paint Colors</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {paints.length} {paints.length === 1 ? "color" : "colors"} in catalog
            </p>
          </div>
          <Link href="/paints/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Paint Color
            </Button>
          </Link>
        </div>

        <PaintCatalog paints={paints} />
      </main>
    </div>
  )
}
