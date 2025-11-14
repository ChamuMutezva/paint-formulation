import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PaintForm } from "@/components/paint-form"
import { notFound } from "next/navigation"
import { getPaintWithFormulations } from "@/lib/queries"

export default async function EditPaintPage({ params }: Readonly<{ params: { id: string } }>) {
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
