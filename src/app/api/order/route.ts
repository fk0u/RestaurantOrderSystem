import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { tableId, items, totalAmount, paymentMethod } = body;

        // Validation
        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        // Transaction for Order + OrderItems + Stock Update
        const createOrder = db.transaction(() => {
            // 1. Create Order
            const result = db.prepare(`
                INSERT INTO orders (table_id, total_amount, payment_method, status)
                VALUES (@tableId, @totalAmount, @paymentMethod, 'pending')
            `).run({ tableId, totalAmount, paymentMethod });

            const orderId = result.lastInsertRowid;

            // 2. Create Order Items & Update Stock
            const insertItem = db.prepare(`
                INSERT INTO order_items (order_id, menu_id, quantity, price)
                VALUES (@orderId, @menuId, @quantity, @price)
            `);

            const updateStock = db.prepare(`
                UPDATE menu 
                SET stock = stock - @quantity 
                WHERE id = @menuId AND stock >= @quantity
            `);

            for (const item of items) {
                // Check stock first (Double check)
                const currentStock = db.prepare('SELECT stock FROM menu WHERE id = ?').get(item.id) as { stock: number };
                if (!currentStock || currentStock.stock < item.quantity) {
                    throw new Error(`Stock not available for item: ${item.name}`);
                }

                insertItem.run({
                    orderId,
                    menuId: item.id,
                    quantity: item.quantity,
                    price: item.price
                });

                updateStock.run({
                    quantity: item.quantity,
                    menuId: item.id
                });
            }

            return orderId;
        });

        const orderId = createOrder();

        return NextResponse.json({
            success: true,
            orderId,
            message: 'Order created successfully'
        });

    } catch (error: any) {
        console.error('Order Failed:', error);
        return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
    }
}
