import pool from './db.js';
import { vehiclesData } from '../src/data/vehiclesData.js';

async function seedDatabase() {
  console.log('--- Iniciando Seed do Banco MySQL AutoPrime ---');

  try {
    const connection = await pool.getConnection();

    // Check existing count
    const [existing] = await connection.query('SELECT COUNT(*) as count FROM vehicles');
    console.log(`Veículos atuais no MySQL: ${existing[0].count}`);

    if (existing[0].count === 0) {
      console.log(`Populando ${vehiclesData.length} veículos iniciais no MySQL...`);

      for (const v of vehiclesData) {
        // Insert vehicle
        await connection.query(
          `INSERT INTO vehicles (
            id, brand, model, version, year, price, mileage, category, 
            transmission, fuel, color, plate_end, doors, featured, 
            engine, torque, acceleration, top_speed, consumption, description
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            v.id,
            v.brand,
            v.model,
            v.version || '',
            v.year,
            v.price,
            v.mileage || 0,
            v.category,
            v.transmission || '',
            v.fuel || '',
            v.color || '',
            v.plateEnd || '',
            v.doors || 4,
            v.featured ? 1 : 0,
            v.engine || '',
            v.torque || '',
            v.acceleration || '',
            v.topSpeed || '',
            v.consumption || '',
            v.description || ''
          ]
        );

        // Insert images
        if (Array.isArray(v.images)) {
          for (let i = 0; i < v.images.length; i++) {
            await connection.query(
              'INSERT INTO vehicle_images (vehicle_id, image_url, display_order) VALUES (?, ?, ?)',
              [v.id, v.images[i], i]
            );
          }
        }

        // Insert badges
        if (Array.isArray(v.badges)) {
          for (const b of v.badges) {
            await connection.query(
              'INSERT INTO vehicle_badges (vehicle_id, badge) VALUES (?, ?)',
              [v.id, b]
            );
          }
        }

        // Insert features
        if (Array.isArray(v.features)) {
          for (const f of v.features) {
            await connection.query(
              'INSERT INTO vehicle_features (vehicle_id, feature) VALUES (?, ?)',
              [v.id, f]
            );
          }
        }

        console.log(`✓ Inserido: ${v.brand} ${v.model} (${v.year})`);
      }

      console.log('🎉 Todos os veículos foram cadastrados com sucesso no MySQL!');
    } else {
      console.log('O banco de dados já possui veículos cadastrados. Seed concluído.');
    }

    connection.release();
    process.exit(0);
  } catch (err) {
    console.error('Erro ao popular banco MySQL:', err);
    process.exit(1);
  }
}

seedDatabase();
