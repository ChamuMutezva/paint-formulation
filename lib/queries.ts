import { sql } from "@/lib/db";
import type {
    Purchase,
    PurchaseWithDetails,
    Customer,
    Paint,
    Formulation,
} from "@/lib/db";

export async function getReportData() {
    try {
        // Total counts
        const customerCount =
            await sql`SELECT COUNT(*) as count FROM customers`;
        const paintCount = await sql`SELECT COUNT(*) as count FROM paints`;
        const purchaseCount =
            await sql`SELECT COUNT(*) as count FROM purchases`;

        // Most popular colors
        const popularColors = await sql`
      SELECT 
        pa.color_name,
        pa.product_type,
        COUNT(p.id) as purchase_count,
        SUM(p.size) as total_volume
      FROM purchases p
      JOIN paints pa ON p.paint_id = pa.id
      GROUP BY pa.id, pa.color_name, pa.product_type
      ORDER BY purchase_count DESC, total_volume DESC
      LIMIT 10
    `;

        // Most active customers
        const activeCustomers = await sql`
      SELECT 
        c.name,
        c.customer_type,
        COUNT(p.id) as purchase_count,
        MAX(p.purchase_date) as last_purchase
      FROM customers c
      JOIN purchases p ON c.id = p.customer_id
      GROUP BY c.id, c.name, c.customer_type
      ORDER BY purchase_count DESC
      LIMIT 10
    `;

        // Recent activity
        const recentPurchases = await sql`
      SELECT 
        p.purchase_date,
        c.name as customer_name,
        pa.color_name,
        pa.product_type,
        p.size,
        p.unit
      FROM purchases p
      JOIN customers c ON p.customer_id = c.id
      JOIN paints pa ON p.paint_id = pa.id
      ORDER BY p.purchase_date DESC, p.created_at DESC
      LIMIT 10
    `;

        // Monthly trend (last 6 months)
        const monthlyTrend = await sql`
      SELECT 
        DATE_TRUNC('month', purchase_date) as month,
        COUNT(*) as purchase_count
      FROM purchases
      WHERE purchase_date >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', purchase_date)
      ORDER BY month DESC
    `;

        return {
            totalCustomers: Number(customerCount[0].count),
            totalPaints: Number(paintCount[0].count),
            totalPurchases: Number(purchaseCount[0].count),
            popularColors,
            activeCustomers,
            recentPurchases,
            monthlyTrend,
        };
    } catch (error) {
        console.error("Error fetching report data:", error);
        return {
            totalCustomers: 0,
            totalPaints: 0,
            totalPurchases: 0,
            popularColors: [],
            activeCustomers: [],
            recentPurchases: [],
            monthlyTrend: [],
        };
    }
}

export async function getPurchases(): Promise<PurchaseWithDetails[]> {
    try {
        const purchases = await sql`
      SELECT 
        p.*,
        c.name as customer_name,
        pa.color_name,
        pa.product_type
      FROM purchases p
      JOIN customers c ON p.customer_id = c.id
      JOIN paints pa ON p.paint_id = pa.id
      ORDER BY p.purchase_date DESC, p.created_at DESC
    `;
        return purchases as PurchaseWithDetails[];
    } catch (error) {
        console.error("[v0] Error fetching purchases:", error);
        return [];
    }
}

export async function getCustomersAndPaints() {
    try {
        const customers = await sql`
      SELECT * FROM customers ORDER BY name ASC
    `;
        const paints = await sql`
      SELECT * FROM paints ORDER BY color_name ASC
    `;
        return {
            customers: customers as Customer[],
            paints: paints as Paint[],
        };
    } catch (error) {
        console.error("[v0] Error fetching data:", error);
        return { customers: [], paints: [] };
    }
}

export async function getPurchaseDetails(id: string) {
    try {
        const purchaseResult = await sql`
      SELECT * FROM purchases WHERE id = ${id}
    `;

        if (purchaseResult.length === 0) return null;

        const purchase = purchaseResult[0] as Purchase;

        const customerResult = await sql`
      SELECT * FROM customers WHERE id = ${purchase.customer_id}
    `;

        const paintResult = await sql`
      SELECT * FROM paints WHERE id = ${purchase.paint_id}
    `;

        const formulationResult = await sql`
      SELECT * FROM formulations 
      WHERE paint_id = ${purchase.paint_id}
      ORDER BY sort_order ASC
    `;

        return {
            purchase,
            customer: customerResult[0] as Customer,
            paint: paintResult[0] as Paint,
            formulations: formulationResult as Formulation[],
        };
    } catch (error) {
        console.error("[v0] Error fetching purchase details:", error);
        return null;
    }
}

export async function getPaintsWithFormulations() {
    try {
        const paints = await sql`
      SELECT * FROM paints 
      ORDER BY color_name ASC
    `;

        const formulations = await sql`
      SELECT * FROM formulations 
      ORDER BY paint_id, sort_order ASC
    `;

        // Group formulations by paint_id
        const paintsWithFormulations = (paints as Paint[]).map((paint) => ({
            ...paint,
            formulations: (formulations as Formulation[]).filter(
                (f) => f.paint_id === paint.id
            ),
        }));

        return paintsWithFormulations;
    } catch (error) {
        console.error("Error fetching paints:", error);
        return [];
    }
}

export async function getPaintWithFormulations(id: string) {
    try {
        const paintResult = await sql`
      SELECT * FROM paints WHERE id = ${id}
    `;

        if (paintResult.length === 0) return null;

        const formulationResult = await sql`
      SELECT * FROM formulations 
      WHERE paint_id = ${id}
      ORDER BY sort_order ASC
    `;

        return {
            ...(paintResult[0] as Paint),
            formulations: formulationResult as Formulation[],
        };
    } catch (error) {
        console.error("[v0] Error fetching paint:", error);
        return null;
    }
}

export async function getCustomers(): Promise<Customer[]> {
    try {
        const customers = await sql`
      SELECT * FROM customers 
      ORDER BY name ASC
    `;
        return customers as Customer[];
    } catch (error) {
        console.error("[v0] Error fetching customers:", error);
        return [];
    }
}

export async function getCustomer(id: string): Promise<Customer | null> {
  try {
    const result = await sql`
      SELECT * FROM customers WHERE id = ${id}
    `
    return (result[0] as Customer) || null
  } catch (error) {
    console.error("[v0] Error fetching customer:", error)
    return null
  }
}
