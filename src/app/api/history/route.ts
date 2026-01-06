import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
    try {
        // Fetch all orders
        const orders = db.prepare(`
            SELECT * FROM orders ORDER BY created_at DESC
        `).all();

        // Fetch items for each order
        const ordersWithItems = orders.map((order: any) => {
            const items = db.prepare(`
                SELECT oi.quantity, oi.price, m.name, m.image, m.id 
                FROM order_items oi
                JOIN menu m ON oi.menu_id = m.id
                WHERE oi.order_id = ?
            `).all(order.id);

            return {
                ...order,
                id: order.id.toString(), // Convert to string for frontend compatibility if needed
                date: order.created_at,
                total: order.total_amount,
                method: order.payment_method,
                tableId: order.table_id,
                items: items.map((i: any) => ({
                    id: i.id,
                    name: i.name,
                    price: i.price,
                    image: i.image,
                    quantity: i.quantity
                }))
            };
        });

        return NextResponse.json(ordersWithItems);
    } catch (error) {
        console.error('Failed to fetch history:', error);
        return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    // This is optional if we want to support client-side sync, 
    // but primarily orders are created via /api/order. 
    // We can leave this empty or handle sync if needed.
    return NextResponse.json({ message: 'Use /api/order to create orders' });
}
