"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"

interface PaintData {
  color_name: string
  product_type: string
  base_size: number
  base_unit: string
  description?: string
}

interface FormulationData {
  component_name: string
  quantity: number
  unit: string
  sort_order: number
}

export async function createPaint(paintData: PaintData, formulations: FormulationData[]) {
  try {
    // Insert paint
    const result = await sql`
      INSERT INTO paints (color_name, product_type, base_size, base_unit, description)
      VALUES (${paintData.color_name}, ${paintData.product_type}, ${paintData.base_size}, 
              ${paintData.base_unit}, ${paintData.description || null})
      RETURNING id
    `

    const paintId = result[0].id

    // Insert formulations
    for (const formulation of formulations) {
      await sql`
        INSERT INTO formulations (paint_id, component_name, quantity, unit, sort_order)
        VALUES (${paintId}, ${formulation.component_name}, ${formulation.quantity}, 
                ${formulation.unit}, ${formulation.sort_order})
      `
    }

    revalidatePath("/paints")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error creating paint:", error)
    throw new Error("Failed to create paint")
  }
}

export async function updatePaint(id: number, paintData: PaintData, formulations: FormulationData[]) {
  try {
    // Update paint
    await sql`
      UPDATE paints 
      SET color_name = ${paintData.color_name},
          product_type = ${paintData.product_type},
          base_size = ${paintData.base_size},
          base_unit = ${paintData.base_unit},
          description = ${paintData.description || null},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `

    // Delete existing formulations
    await sql`
      DELETE FROM formulations WHERE paint_id = ${id}
    `

    // Insert new formulations
    for (const formulation of formulations) {
      await sql`
        INSERT INTO formulations (paint_id, component_name, quantity, unit, sort_order)
        VALUES (${id}, ${formulation.component_name}, ${formulation.quantity}, 
                ${formulation.unit}, ${formulation.sort_order})
      `
    }

    revalidatePath("/paints")
    revalidatePath(`/paints/${id}/edit`)
    return { success: true }
  } catch (error) {
    console.error("[v0] Error updating paint:", error)
    throw new Error("Failed to update paint")
  }
}

export async function deletePaint(id: number) {
  try {
    await sql`
      DELETE FROM paints WHERE id = ${id}
    `
    revalidatePath("/paints")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting paint:", error)
    throw new Error("Failed to delete paint")
  }
}
