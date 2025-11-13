import { neon } from "@neondatabase/serverless"
import { type Formulation } from "./utils"

// Initialize the Neon client
// When you connect Neon, this will use the DATABASE_URL environment variable
export const sql = neon(process.env.DATABASE_URL || "")

// Type definitions for our database tables
export interface Customer {
  id: number
  name: string
  customer_type: "individual" | "company"
  phone?: string
  email?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Paint {
  id: number
  color_name: string
  product_type: string
  base_size: number
  base_unit: string
  description?: string
  created_at: string
  updated_at: string
}


export interface Purchase {
  id: number
  customer_id: number
  paint_id: number
  size: number
  unit: string
  purchase_date: string
  notes?: string
  created_at: string
}

// Extended types for joined queries
export interface PurchaseWithDetails extends Purchase {
  customer_name: string
  color_name: string
  product_type: string
}

export interface PaintWithFormulation extends Paint {
  formulations: Formulation[]
}
export { scaleFormulation, Formulation } from "./utils"
