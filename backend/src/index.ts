import express from 'express';
import path from 'path';
import fs from 'fs';
import {DriversManager} from "./DriversManager";

const app = express();
const port = 3001;

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
  res.json(driversManager);
});

app.post('/api/drivers/:driverId/overtake', (req, res) => {
  const driverId = parseInt(req.params.driverId);
  const driver = driversManager.findDriverById(driverId);

  if (driver === undefined || !driversManager.canOvertake(driver)) {
    res.status(400).send();
    return;
  }

  driversManager.performOvertake(driver);
  res.status(200).send();
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
