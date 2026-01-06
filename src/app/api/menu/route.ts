import { NextResponse } from 'next/server';
import db, { initDB } from '@/lib/db';

export async function GET() {
    try {
        // Ensure DB is seeded
        initDB();

        const menu = db.prepare('SELECT * FROM menu').all();
        // Convert popular (0/1) to boolean
        const formattedMenu = menu.map((item: any) => ({
            ...item,
            popular: Boolean(item.popular),
            stock: Number(item.stock),
            price: Number(item.price)
        }));

        return NextResponse.json(formattedMenu);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
    }
}
