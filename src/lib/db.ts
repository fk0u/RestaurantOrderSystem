import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'restaurant.db');
const db = new Database(dbPath);

// Initialize Database Schema
export function initDB() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS menu (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price INTEGER NOT NULL,
            description TEXT,
            image TEXT,
            category TEXT,
            stock INTEGER DEFAULT 0,
            popular BOOLEAN DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            table_id TEXT,
            total_amount INTEGER NOT NULL,
            payment_method TEXT,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER,
            menu_id INTEGER,
            quantity INTEGER,
            price INTEGER,
            FOREIGN KEY(order_id) REFERENCES orders(id),
            FOREIGN KEY(menu_id) REFERENCES menu(id)
        );
    `);

    // Seed Data or Update if Counts Mismatch
    const count = db.prepare('SELECT count(*) as count FROM menu').get() as { count: number };
    const menuData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/mocks/menu.json'), 'utf-8'));

    if (count.count === 0 || count.count !== menuData.length) {
        console.log('Seeding/Updating database...');
        try {
            // Nuke menu table to clean slate (simple approach for dev)
            if (count.count > 0) {
                db.prepare('DELETE FROM menu').run();
                // Reset sequence if possible, or just ignore ID gaps
                try { db.prepare('DELETE FROM sqlite_sequence WHERE name="menu"').run(); } catch (e) { }
            }

            const insert = db.prepare(`
                INSERT INTO menu (id, name, price, description, image, category, stock, popular)
                VALUES (@id, @name, @price, @description, @image, @category, @stock, @popular)
            `);

            const insertMany = db.transaction((items) => {
                for (const item of items) {
                    insert.run({
                        ...item,
                        popular: item.popular ? 1 : 0
                    });
                }
            });

            insertMany(menuData);
            console.log(`Database seeded with ${menuData.length} items.`);
        } catch (error) {
            console.error('Failed to seed database:', error);
        }
    }
}

export default db;
