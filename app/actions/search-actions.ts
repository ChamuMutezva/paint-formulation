"use server"

import { sql , scaleFormulation} from "@/lib/db"

export async function searchByCustomer(customerName: string) {
  try {
    // Search for customer (case-insensitive partial match)
    const customerResult = await sql`
      SELECT * FROM customers 
      WHERE LOWER(name) LIKE LOWER(${"%" + customerName + "%"})
      LIMIT 1
    `

    if (customerResult.length === 0) {
      return { customer: null, purchases: [] }
    }

    const customer = customerResult[0]

    // Get all purchases for this customer with paint details
    const purchasesResult = await sql`
      SELECT 
        p.*,
        pa.color_name,
        pa.product_type,
        pa.base_size,
        pa.base_unit
      FROM purchases p
      JOIN paints pa ON p.paint_id = pa.id
      WHERE p.customer_id = ${customer.id}
      ORDER BY p.purchase_date DESC
    `

    // For each purchase, get the scaled formulation
    const purchasesWithFormulations = await Promise.all(
      purchasesResult.map(async (purchase: any) => {
        const formulationsResult = await sql`
          SELECT * FROM formulations 
          WHERE paint_id = ${purchase.paint_id}
          ORDER BY sort_order ASC
        `

        // Scale formulations to the purchased size
        const scaledFormulations = formulationsResult.map((f: any) =>
          scaleFormulation(f, purchase.size, purchase.base_size),
        )

        return {
          ...purchase,
          formulations: scaledFormulations,
        }
      }),
    )

    return {
      customer,
      purchases: purchasesWithFormulations,
    }
  } catch (error) {
    console.error("[v0] Error searching by customer:", error)
    throw new Error("Failed to search by customer")
  }
}

export async function searchByColor(colorName: string) {
  try {
    // Search for paint color (case-insensitive partial match)
    const paintResult = await sql`
      SELECT * FROM paints 
      WHERE LOWER(color_name) LIKE LOWER(${"%" + colorName + "%"})
      LIMIT 1
    `

    if (paintResult.length === 0) {
      return { paint: null, baseFormulations: [], customers: [] }
    }

    const paint = paintResult[0]

    // Get base formulation
    const formulationsResult = await sql`
      SELECT * FROM formulations 
      WHERE paint_id = ${paint.id}
      ORDER BY sort_order ASC
    `

    // Get all customers who purchased this color
    const customersResult = await sql`
      SELECT 
        p.id as purchase_id,
        p.size,
        p.unit,
        p.purchase_date,
        p.notes,
        c.name as customer_name,
        c.customer_type
      FROM purchases p
      JOIN customers c ON p.customer_id = c.id
      WHERE p.paint_id = ${paint.id}
      ORDER BY p.purchase_date DESC
    `

    return {
      paint,
      baseFormulations: formulationsResult,
      customers: customersResult,
    }
  } catch (error) {
    console.error("[v0] Error searching by color:", error)
    throw new Error("Failed to search by color")
  }
}
