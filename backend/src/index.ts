import express from 'express';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import {DriversManager} from "./DriversManager";

// Config server
const app = express();
const port = process.env.PORT || 3001;
app.use(cors())

// Load data
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, '/data/img')));
const driversManager: DriversManager = (() => {
  try {
    const data = fs.readFileSync(path.join(__dirname, '/data/drivers.json'));
    const drivers = JSON.parse(data.toString());
    return new DriversManager(drivers);
  } catch (err) {
    throw err;
  }
})();


app.get('/api/drivers', (req, res) => {
  res.json(driversManager.drivers);
});

app.post('/api/drivers/:driverId/overtake', (req, res) => {
  const driverId = parseInt(req.params.driverId);
  console.log(`Received overtake request for driverId: ${driverId}`);

  const overtakes = req.query.overtakes ? parseInt(req.query.overtakes as string) : 1;
  console.log(`Number of overtakes requested: ${overtakes}`);

  const driver = driversManager.findDriverById(driverId);

  if (driver === undefined) {
    console.error(`Driver with ID ${driverId} not found.`);
    res.status(400).send();
    return;
  }

  if (!driversManager.canOvertake(driver)) {
    console.error(`Driver with ID ${driverId} cannot overtake.`);
    res.status(400).send();
    return;
  }

  driversManager.performOvertake(driver, overtakes);
  console.log(`Driver ${driverId} performed ${overtakes} overtakes.`);
  res.status(200).send();
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
