import {Pool} from 'pg';
import {DriversManager} from "./DriversManager";
import {readFileSync} from "fs";
import path from "path";
import dotenv from 'dotenv';

dotenv.config();

// PostgreSQL pool configuration
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT),
});

const data = readFileSync(path.join(__dirname, '/data/drivers.json'));
const drivers = JSON.parse(data.toString());
const driversManager = new DriversManager(pool);
driversManager.checkIfExists()
  .then(exists => {
    if (exists) {
      console.log('Table already exists, if you want to reinitialize it, drop it')
    } else {
      driversManager.initDrivers(drivers)
        .then(() => console.log('Data initialized'))
        .catch(e => console.error(e));
    }
  })
  .catch(e => console.error(e));
