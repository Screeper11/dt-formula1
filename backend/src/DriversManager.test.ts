import {DriversManager} from './DriversManager';
import {Pool} from 'pg';

describe('DriversManager', () => {
  let pool: Pool;
  let driversManager: DriversManager;
  let mockQuery: jest.Mock;

  beforeEach(() => {
    pool = new Pool();
    driversManager = new DriversManager(pool);
    mockQuery = jest.fn();
    pool.query = mockQuery;
  });

  describe('lockDatabase', () => {
    it('should lock the database for exclusive access', async () => {
      mockQuery.mockResolvedValueOnce({});
      await driversManager.lockDatabase();
      expect(mockQuery).toHaveBeenCalledWith('BEGIN; LOCK TABLE "drivers" IN ACCESS EXCLUSIVE MODE;');
    });
  });

  describe('unlockDatabase', () => {
    it('should unlock the database by committing the transaction', async () => {
      mockQuery.mockResolvedValueOnce({});
      await driversManager.unlockDatabase();
      expect(mockQuery).toHaveBeenCalledWith('COMMIT;');
    });
  });

  describe('checkIfExists', () => {
    it('should return true if the drivers table exists', async () => {
      mockQuery.mockResolvedValueOnce({rowCount: 1});
      const exists = await driversManager.checkIfExists();
      expect(exists).toBeTruthy();
    });

    it('should return false if the drivers table does not exist', async () => {
      mockQuery.mockRejectedValueOnce({code: '42P01'});
      const exists = await driversManager.checkIfExists();
      expect(exists).toBeFalsy();
    });

    it('should throw an error for any other error', async () => {
      const error = new Error('Unexpected error');
      mockQuery.mockRejectedValueOnce(error);
      await expect(driversManager.checkIfExists()).rejects.toThrow(error);
    });
  });

  describe('getDrivers', () => {
    it('should retrieve drivers ordered by place', async () => {
      const drivers = [{id: 1, place: 1}, {id: 2, place: 2}];
      mockQuery.mockResolvedValueOnce({rows: drivers});

      const result = await driversManager.getDrivers();

      expect(result).toEqual(drivers);
      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM drivers ORDER BY place ASC');
    });
  });

  describe('performOvertake', () => {
    it('should perform an overtake operation', async () => {
      const driverId = 1;
      const overtakes = 1;
      const nextDriverToOvertake = {id: 2, place: 1};

      mockQuery.mockResolvedValueOnce({}); // For BEGIN; LOCK TABLE
      mockQuery.mockResolvedValueOnce({rows: [nextDriverToOvertake]}); // For SELECT next driver
      mockQuery.mockResolvedValueOnce({}); // For UPDATE current driver
      mockQuery.mockResolvedValueOnce({}); // For UPDATE next driver
      mockQuery.mockResolvedValueOnce({}); // For COMMIT; to unlock the database

      await driversManager.performOvertake(driverId, overtakes);

      expect(mockQuery).toHaveBeenCalledTimes(5);
      expect(mockQuery).toHaveBeenCalledWith('UPDATE "drivers" SET "place" = "place" - 1 WHERE "id" = $1', [driverId]);
      expect(mockQuery).toHaveBeenCalledWith('UPDATE "drivers" SET "place" = "place" + 1 WHERE "id" = $1', [nextDriverToOvertake.id]);
    });
  });
});
