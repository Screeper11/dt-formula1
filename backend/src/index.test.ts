import request from 'supertest';
import app from './index';
import {Driver} from "./DriversManager";

describe('API endpoints', () => {
  let driverId: number;
  let initialDrivers: Driver[];
  let totalOvertakes = 0;

  it('GET /api/drivers should return a list of drivers', async () => {
    const initialResponse = await request(app).get('/api/drivers');
    expect(initialResponse.statusCode).toBe(200);
    expect(initialResponse.body).toBeInstanceOf(Array);
    initialDrivers = initialResponse.body;
    driverId = initialDrivers[20]?.id;
  });

  it('POST /api/drivers/:driverId/overtake should successfully perform an overtake', async () => {
    const response = await request(app)
      .post(`/api/drivers/${driverId}/overtake`);
    expect(response.statusCode).toBe(200);
    totalOvertakes += 1;
  });

  it('POST /api/drivers/:driverId/overtake should successfully perform a multi overtake', async () => {
    const overtakes = 3;
    const response = await request(app)
      .post(`/api/drivers/${driverId}/overtake?overtakes=${overtakes}`);
    expect(response.statusCode).toBe(200);
    totalOvertakes += overtakes;
  });

  it('POST /api/drivers/:driverId/overtake should return 400 for invalid driverId', async () => {
    const driverId = 'invalid'; // Invalid ID
    const overtakes = 2;
    const response = await request(app)
      .post(`/api/drivers/${driverId}/overtake?overtakes=${overtakes}`);
    expect(response.statusCode).toBe(400);
  });

  it('Overtake increases a driver\'s position', async () => {
    const updatedResponse = await request(app).get('/api/drivers');
    expect(updatedResponse.statusCode).toBe(200);
    expect(updatedResponse.body).toBeInstanceOf(Array);

    const initialDriver = initialDrivers.find(driver => driver.id === driverId);
    const updatedDrivers: Driver[] = updatedResponse.body;
    const updatedDriver = updatedDrivers.find(driver => driver.id === driverId);

    if (!updatedDriver || !initialDriver) throw new Error('Driver not found');
    expect(updatedDriver.place).toEqual(initialDriver.place - totalOvertakes);
  });
});
