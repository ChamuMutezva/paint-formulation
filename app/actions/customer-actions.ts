"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"

interface CustomerData {
  name: string
  customer_type: string
  phone?: string
  email?: string
  notes?: string
}

export async function createCustomer(data: CustomerData) {
  try {
    await sql`
      INSERT INTO customers (name, customer_type, phone, email, notes)
      VALUES (${data.name}, ${data.customer_type}, ${data.phone || null}, ${data.email || null}, ${data.notes || null})
    `
    revalidatePath("/customers")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error creating customer:", error)
    throw new Error("Failed to create customer")
  }
}

export async function updateCustomer(id: number, data: CustomerData) {
  try {
    await sql`
      UPDATE customers 
      SET name = ${data.name},
          customer_type = ${data.customer_type},
          phone = ${data.phone || null},
          email = ${data.email || null},
          notes = ${data.notes || null},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `
    revalidatePath("/customers")
    revalidatePath(`/customers/${id}/edit`)
    return { success: true }
  } catch (error) {
    console.error("[v0] Error updating customer:", error)
    throw new Error("Failed to update customer")
  }
}

export async function deleteCustomer(id: number) {
  try {
    await sql`
      DELETE FROM customers WHERE id = ${id}
    `
    revalidatePath("/customers")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting customer:", error)
    throw new Error("Failed to delete customer")
  }
}
