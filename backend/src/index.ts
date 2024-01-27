import express from 'express';
import path from 'path';
import cors from 'cors';
import {Pool} from 'pg';
import {DriversManager} from './DriversManager';
import dotenv from 'dotenv';

dotenv.config();

// Config server
const app = express();
const port = process.env.PORT || 3001;
app.use(cors());

// PostgreSQL pool configuration
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT),
});

// Load data
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, '/data/img')));
const driversManager = new DriversManager(pool);

app.get('/api/drivers', async (req, res) => {
  console.log(`[${req.ip}] GET /api/drivers`)
  try {
    const drivers = await driversManager.getDrivers();
    res.json(drivers);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

app.post('/api/drivers/:driverId/overtake', async (req, res) => {
  const driverId = parseInt(req.params.driverId);
  const overtakes = req.query.overtakes ? parseInt(req.query.overtakes as string) : 1;
  console.log(`[${req.ip}] POST /api/drivers/${driverId}/overtake [overtakes=${overtakes}]`)

  try {
    await driversManager.performOvertake(driverId, overtakes);
    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(400).send();
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
