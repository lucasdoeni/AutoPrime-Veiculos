import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import dotenv from 'dotenv';
import pool from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());

// Ensure uploads folder exists and serve statically
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Multer storage for real car photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'car-' + uniqueSuffix + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit per photo
});

// Helper: format vehicle from database rows
function formatVehicle(v, images = [], badges = [], features = []) {
  return {
    id: v.id,
    brand: v.brand,
    model: v.model,
    version: v.version || '',
    year: Number(v.year),
    price: Number(v.price),
    mileage: Number(v.mileage),
    category: v.category,
    transmission: v.transmission || '',
    fuel: v.fuel || '',
    color: v.color || '',
    plateEnd: v.plate_end || '',
    doors: Number(v.doors || 4),
    featured: Boolean(v.featured),
    engine: v.engine || '',
    torque: v.torque || '',
    acceleration: v.acceleration || '',
    topSpeed: v.top_speed || '',
    consumption: v.consumption || '',
    description: v.description || '',
    images,
    badges,
    features,
    createdAt: v.created_at,
    updatedAt: v.updated_at
  };
}

// ---------------------------------------------------------------------
// 1. GET ALL VEHICLES
// ---------------------------------------------------------------------
app.get('/api/vehicles', async (req, res) => {
  try {
    const [vehicles] = await pool.query(
      'SELECT * FROM vehicles ORDER BY featured DESC, year DESC, created_at DESC'
    );

    // Fetch related images, badges, and features in batches
    const [images] = await pool.query(
      'SELECT vehicle_id, image_url FROM vehicle_images ORDER BY display_order ASC'
    );
    const [badges] = await pool.query('SELECT vehicle_id, badge FROM vehicle_badges');
    const [features] = await pool.query('SELECT vehicle_id, feature FROM vehicle_features');

    const imageMap = {};
    images.forEach(img => {
      if (!imageMap[img.vehicle_id]) imageMap[img.vehicle_id] = [];
      imageMap[img.vehicle_id].push(img.image_url);
    });

    const badgeMap = {};
    badges.forEach(b => {
      if (!badgeMap[b.vehicle_id]) badgeMap[b.vehicle_id] = [];
      badgeMap[b.vehicle_id].push(b.badge);
    });

    const featureMap = {};
    features.forEach(f => {
      if (!featureMap[f.vehicle_id]) featureMap[f.vehicle_id] = [];
      featureMap[f.vehicle_id].push(f.feature);
    });

    const formatted = vehicles.map(v => 
      formatVehicle(
        v, 
        imageMap[v.id] || [], 
        badgeMap[v.id] || [], 
        featureMap[v.id] || []
      )
    );

    res.json(formatted);
  } catch (err) {
    console.error('Erro ao listar veículos:', err);
    res.status(500).json({ error: 'Erro ao consultar banco de dados MySQL.' });
  }
});

// ---------------------------------------------------------------------
// 2. GET SINGLE VEHICLE
// ---------------------------------------------------------------------
app.get('/api/vehicles/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vehicles WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Veículo não encontrado.' });
    }

    const [images] = await pool.query(
      'SELECT image_url FROM vehicle_images WHERE vehicle_id = ? ORDER BY display_order ASC', 
      [req.params.id]
    );
    const [badges] = await pool.query(
      'SELECT badge FROM vehicle_badges WHERE vehicle_id = ?', 
      [req.params.id]
    );
    const [features] = await pool.query(
      'SELECT feature FROM vehicle_features WHERE vehicle_id = ?', 
      [req.params.id]
    );

    res.json(formatVehicle(
      rows[0],
      images.map(i => i.image_url),
      badges.map(b => b.badge),
      features.map(f => f.feature)
    ));
  } catch (err) {
    console.error('Erro ao buscar veículo:', err);
    res.status(500).json({ error: 'Erro no servidor MySQL.' });
  }
});

// ---------------------------------------------------------------------
// 3. CREATE VEHICLE (COM TRANSAÇÃO SQL)
// ---------------------------------------------------------------------
app.post('/api/vehicles', async (req, res) => {
  const v = req.body;
  if (!v.brand || !v.model || !v.price || !v.year) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes (marca, modelo, ano, preço).' });
  }

  const id = v.id || `${v.brand.toLowerCase()}-${v.model.toLowerCase().replace(/\s+/g, '-')}-${v.year}-${Date.now().toString().slice(-4)}`;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      `INSERT INTO vehicles (
        id, brand, model, version, year, price, mileage, category, 
        transmission, fuel, color, plate_end, doors, featured, 
        engine, torque, acceleration, top_speed, consumption, description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        v.brand,
        v.model,
        v.version || '',
        v.year,
        v.price,
        v.mileage || 0,
        v.category || 'Outros',
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

    // Images
    if (Array.isArray(v.images)) {
      for (let i = 0; i < v.images.length; i++) {
        if (v.images[i]) {
          await conn.query(
            'INSERT INTO vehicle_images (vehicle_id, image_url, display_order) VALUES (?, ?, ?)',
            [id, v.images[i], i]
          );
        }
      }
    }

    // Badges
    if (Array.isArray(v.badges)) {
      for (const b of v.badges) {
        if (b) {
          await conn.query(
            'INSERT INTO vehicle_badges (vehicle_id, badge) VALUES (?, ?)',
            [id, b]
          );
        }
      }
    }

    // Features
    if (Array.isArray(v.features)) {
      for (const f of v.features) {
        if (f) {
          await conn.query(
            'INSERT INTO vehicle_features (vehicle_id, feature) VALUES (?, ?)',
            [id, f]
          );
        }
      }
    }

    await conn.commit();
    res.status(201).json({ success: true, id, message: 'Veículo cadastrado no MySQL com sucesso!' });
  } catch (err) {
    await conn.rollback();
    console.error('Erro ao cadastrar veículo:', err);
    res.status(500).json({ error: 'Falha ao salvar veículo no MySQL.' });
  } finally {
    conn.release();
  }
});

// ---------------------------------------------------------------------
// 4. UPDATE VEHICLE
// ---------------------------------------------------------------------
app.put('/api/vehicles/:id', async (req, res) => {
  const { id } = req.params;
  const v = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      `UPDATE vehicles SET 
        brand = ?, model = ?, version = ?, year = ?, price = ?, mileage = ?, 
        category = ?, transmission = ?, fuel = ?, color = ?, plate_end = ?, 
        doors = ?, featured = ?, engine = ?, torque = ?, acceleration = ?, 
        top_speed = ?, consumption = ?, description = ?
      WHERE id = ?`,
      [
        v.brand,
        v.model,
        v.version || '',
        v.year,
        v.price,
        v.mileage || 0,
        v.category || 'Outros',
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
        v.description || '',
        id
      ]
    );

    // Replace images if provided
    if (Array.isArray(v.images)) {
      await conn.query('DELETE FROM vehicle_images WHERE vehicle_id = ?', [id]);
      for (let i = 0; i < v.images.length; i++) {
        if (v.images[i]) {
          await conn.query(
            'INSERT INTO vehicle_images (vehicle_id, image_url, display_order) VALUES (?, ?, ?)',
            [id, v.images[i], i]
          );
        }
      }
    }

    // Replace badges if provided
    if (Array.isArray(v.badges)) {
      await conn.query('DELETE FROM vehicle_badges WHERE vehicle_id = ?', [id]);
      for (const b of v.badges) {
        if (b) {
          await conn.query(
            'INSERT INTO vehicle_badges (vehicle_id, badge) VALUES (?, ?)',
            [id, b]
          );
        }
      }
    }

    // Replace features if provided
    if (Array.isArray(v.features)) {
      await conn.query('DELETE FROM vehicle_features WHERE vehicle_id = ?', [id]);
      for (const f of v.features) {
        if (f) {
          await conn.query(
            'INSERT INTO vehicle_features (vehicle_id, feature) VALUES (?, ?)',
            [id, f]
          );
        }
      }
    }

    await conn.commit();
    res.json({ success: true, message: 'Veículo atualizado com sucesso no MySQL!' });
  } catch (err) {
    await conn.rollback();
    console.error('Erro ao atualizar veículo:', err);
    res.status(500).json({ error: 'Falha ao atualizar no MySQL.' });
  } finally {
    conn.release();
  }
});

// ---------------------------------------------------------------------
// 5. DELETE VEHICLE
// ---------------------------------------------------------------------
app.delete('/api/vehicles/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM vehicles WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Veículo não encontrado.' });
    }
    res.json({ success: true, message: 'Veículo removido do estoque MySQL.' });
  } catch (err) {
    console.error('Erro ao deletar veículo:', err);
    res.status(500).json({ error: 'Erro ao deletar no MySQL.' });
  }
});

// ---------------------------------------------------------------------
// 6. TOGGLE FEATURED
// ---------------------------------------------------------------------
app.patch('/api/vehicles/:id/featured', async (req, res) => {
  try {
    await pool.query('UPDATE vehicles SET featured = NOT featured WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Status de destaque atualizado.' });
  } catch (err) {
    console.error('Erro ao alterar destaque:', err);
    res.status(500).json({ error: 'Erro no servidor.' });
  }
});

// ---------------------------------------------------------------------
// 7. FILE UPLOAD (FOTOS REAIS DE CARROS)
// ---------------------------------------------------------------------
app.post('/api/upload', upload.array('photos', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    const host = req.protocol + '://' + req.get('host');
    const urls = req.files.map(file => `${host}/uploads/${file.filename}`);

    res.json({
      success: true,
      urls,
      count: urls.length
    });
  } catch (err) {
    console.error('Erro no upload de foto:', err);
    res.status(500).json({ error: 'Falha ao processar upload de imagem.' });
  }
});

// ---------------------------------------------------------------------
// 8. LEADS (PROPOSTAS, AVALIAÇÃO DE USADOS & CONTATOS)
// ---------------------------------------------------------------------
app.post('/api/leads', async (req, res) => {
  const { 
    clientName, 
    clientPhone, 
    clientEmail, 
    leadType = 'contact', 
    vehicleId, 
    vehicleInterest,
    tradeInBrand,
    tradeInModel,
    tradeInYear,
    tradeInMileage,
    notes 
  } = req.body;

  if (!clientName || !clientPhone) {
    return res.status(400).json({ error: 'Nome e telefone são obrigatórios.' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO leads (
        client_name, client_phone, client_email, lead_type, vehicle_id, 
        vehicle_interest, trade_in_brand, trade_in_model, trade_in_year, 
        trade_in_mileage, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        clientName, 
        clientPhone, 
        clientEmail || '', 
        leadType, 
        vehicleId || null, 
        vehicleInterest || '',
        tradeInBrand || '',
        tradeInModel || '',
        tradeInYear || null,
        tradeInMileage || null,
        notes || ''
      ]
    );

    res.status(201).json({ 
      success: true, 
      leadId: result.insertId,
      message: 'Proposta registrada com sucesso! Entraremos em contato.' 
    });
  } catch (err) {
    console.error('Erro ao salvar lead:', err);
    res.status(500).json({ error: 'Erro ao registrar proposta.' });
  }
});

// ---------------------------------------------------------------------
// 9. AUTH LOGIN
// ---------------------------------------------------------------------
app.post('/api/auth/login', async (req, res) => {
  const adminKey = process.env.ADMIN_KEY || 'admin123';
  if (password === adminKey) {
    return res.json({
      success: true,
      token: 'jwt-token-autoprime-' + Date.now(),
      user: {
        username: username || 'admin',
        name: 'Administrador AutoPrime',
        role: 'admin'
      }
    });
  }

  res.status(401).json({ error: 'Senha incorreta.' });
});

// ---------------------------------------------------------------------
// 10. INVENTORY STATS
// ---------------------------------------------------------------------
app.get('/api/stats', async (req, res) => {
  try {
    const [totals] = await pool.query(`
      SELECT 
        COUNT(*) as totalVehicles,
        SUM(price) as totalValue,
        AVG(price) as avgPrice,
        SUM(featured) as totalFeatured
      FROM vehicles
    `);

    const [categories] = await pool.query(`
      SELECT category, COUNT(*) as count 
      FROM vehicles 
      GROUP BY category
    `);

    const [leadsCount] = await pool.query(`SELECT COUNT(*) as count FROM leads`);

    res.json({
      totalVehicles: Number(totals[0].totalVehicles || 0),
      totalValue: Number(totals[0].totalValue || 0),
      avgPrice: Number(totals[0].avgPrice || 0),
      totalFeatured: Number(totals[0].totalFeatured || 0),
      categories,
      totalLeads: Number(leadsCount[0].count || 0)
    });
  } catch (err) {
    console.error('Erro ao buscar estatísticas:', err);
    res.status(500).json({ error: 'Erro ao gerar métricas.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 AutoPrime Backend API rodando com MySQL na porta ${PORT}`);
  console.log(`📡 URL da API: http://localhost:${PORT}/api/vehicles`);
});
