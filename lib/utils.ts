import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface Formulation {
  id: number
  paint_id: number
  component_name: string
  quantity: number
  unit: string
  sort_order: number
  created_at: string
}

// Helper function to scale formulation quantities
export function scaleFormulation(formulation: Formulation, targetSize: number, baseSize = 1): Formulation {
  const scaleFactor = targetSize / baseSize
  // Ensure quantity is a number even if it comes from DB as string
  const baseQuantity =
    typeof formulation.quantity === "string" ? Number.parseFloat(formulation.quantity) : formulation.quantity
  return {
    ...formulation,
    quantity: Number.parseFloat((baseQuantity * scaleFactor).toFixed(3)),
  }
}