"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"

interface PurchaseData {
  customer_id: number
  paint_id: number
  size: number
  unit: string
  purchase_date: string
  notes?: string
}

export async function createPurchase(data: PurchaseData) {
  try {
    await sql`
      INSERT INTO purchases (customer_id, paint_id, size, unit, purchase_date, notes)
      VALUES (${data.customer_id}, ${data.paint_id}, ${data.size}, ${data.unit}, 
              ${data.purchase_date}, ${data.notes || null})
    `
    revalidatePath("/purchases")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error creating purchase:", error)
    throw new Error("Failed to create purchase")
  }
}

export async function deletePurchase(id: number) {
  try {
    await sql`
      DELETE FROM purchases WHERE id = ${id}
    `
    revalidatePath("/purchases")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting purchase:", error)
    throw new Error("Failed to delete purchase")
  }
}
