import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export async function GET(req) {
  try {
    // Verificar token de seguridad
    const token = req.nextUrl.searchParams.get('token');
    if (token !== 'migrate-secret-key-2025') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const TURSO_URL = process.env.TURSO_DATABASE_URL;
    const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

    if (!TURSO_URL || !TURSO_TOKEN) {
      return NextResponse.json({ error: 'Missing Turso config' }, { status: 500 });
    }

    // Conectar a BD local
    let products = [];
    let combos = [];
    let config = [];

    try {
      const dbPath = resolve(process.cwd(), 'local.db');
      const localDb = new Database(dbPath);
      
      products = localDb.prepare('SELECT * FROM products').all();
      combos = localDb.prepare('SELECT * FROM combos').all();
      config = localDb.prepare('SELECT * FROM config').all();
      
      localDb.close();
    } catch (err) {
      console.warn('Warning: Could not read local.db, using sample data:', err.message);
      // Fallback a datos de ejemplo si local.db no existe
      products = [
        { id: 1, name: 'Asado Completo', description: 'Asado con chorizo, morcilla y costillar', price: 85000, category: 'Asados', image: null, available: 1, sort_order: 1 },
        { id: 2, name: 'Pollo a la Parrilla', description: 'Medio pollo fresco a la parrilla', price: 45000, category: 'Aves', image: null, available: 1, sort_order: 2 },
      ];
      combos = [];
      config = [];
    }

    // Conectar a Turso
    const tursoClient = createClient({
      url: TURSO_URL,
      authToken: TURSO_TOKEN,
    });

    let migratedProducts = 0;
    let migratedCombos = 0;
    let migratedConfig = 0;
    const errors = [];

    // Migrar productos
    for (const product of products) {
      try {
        await tursoClient.execute({
          sql: 'INSERT INTO products (name, description, price, category, image, available, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
          args: [
            product.name,
            product.description,
            product.price,
            product.category,
            product.image,
            product.available,
            product.sort_order
          ]
        });
        migratedProducts++;
      } catch (err) {
        errors.push(`Product ${product.name}: ${err.message}`);
      }
    }

    // Migrar combos
    for (const combo of combos) {
      try {
        await tursoClient.execute({
          sql: 'INSERT INTO combos (id, name, description, price, items, image, highlighted) VALUES (?, ?, ?, ?, ?, ?, ?)',
          args: [
            combo.id,
            combo.name,
            combo.description,
            combo.price,
            combo.items,
            combo.image,
            combo.highlighted
          ]
        });
        migratedCombos++;
      } catch (err) {
        errors.push(`Combo ${combo.id}: ${err.message}`);
      }
    }

    // Migrar config
    for (const item of config) {
      try {
        await tursoClient.execute({
          sql: 'INSERT INTO config (key, value) VALUES (?, ?)',
          args: [item.key, item.value]
        });
        migratedConfig++;
      } catch (err) {
        errors.push(`Config ${item.key}: ${err.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Migration completed',
      stats: {
        products: { found: products.length, migrated: migratedProducts },
        combos: { found: combos.length, migrated: migratedCombos },
        config: { found: config.length, migrated: migratedConfig }
      },
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
