import {Pool} from 'pg';

function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export class DriversManager {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async checkIfExists() {
    try {
      await this.pool.query('SELECT 1 FROM "drivers" LIMIT 1');
      return true;
    } catch (error) {
      return false;
    }
  }

  async initDrivers(drivers: Driver[]) {
    await this.pool.query('BEGIN');
    try {
      shuffle(drivers);
      await this.pool.query(
        `CREATE TABLE IF NOT EXISTS "drivers" (
        "id" INTEGER PRIMARY KEY,
        "code" TEXT NOT NULL,
        "firstname" TEXT NOT NULL,
        "lastname" TEXT NOT NULL,
        "country" TEXT NOT NULL,
        "team" TEXT NOT NULL,
        "imgUrl" TEXT NOT NULL,
        "place" INTEGER NOT NULL
      )`
      );
      for (const driver of drivers) {
        driver.imgUrl = `static/${driver.code.toLowerCase()}.png`;
        driver.place = drivers.indexOf(driver) + 1;
        await this.pool.query(
          'INSERT INTO "drivers" ("id", "code", "firstname", "lastname", "country", "team", "imgUrl", "place") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
          [driver.id, driver.code, driver.firstname, driver.lastname, driver.country, driver.team, driver.imgUrl, driver.place]
        );
      }
      await this.pool.query('COMMIT');
    } catch (err) {
      await this.pool.query('ROLLBACK');
      throw err;
    }
  }

  async getDrivers() {
    const res = await this.pool.query('SELECT * FROM drivers ORDER BY place ASC');
    return res.rows;
  }

  async performOvertake(driverId: number, overtakes: number) {
    await this.pool.query('BEGIN');
    try {
      for (let i = 0; i < overtakes; i++) {
        // Find the driver who is currently in the place to be overtaken
        const driverToOvertake = await this.pool.query('SELECT "id" FROM "drivers" WHERE "place" = (SELECT "place" FROM "drivers" WHERE "id" = $1) - 1', [driverId]);

        // Check if there is a driver to overtake
        if (driverToOvertake.rows.length > 0) {
          // Decrease the place of the driver overtaking
          await this.pool.query('UPDATE "drivers" SET "place" = "place" - 1 WHERE "id" = $1', [driverId]);

          // Increase the place of the driver being overtaken
          await this.pool.query('UPDATE "drivers" SET "place" = "place" + 1 WHERE "id" = $1', [driverToOvertake.rows[0].id]);
        } else {
          // No driver to overtake, break the loop
          break;
        }
      }

      await this.pool.query('COMMIT');
    } catch (err) {
      await this.pool.query('ROLLBACK');
      throw err;
    }
  }
}

interface Driver {
  id: number;
  code: string;
  firstname: string;
  lastname: string;
  country: string;
  team: string;
  imgUrl: string;
  place: number;
}
