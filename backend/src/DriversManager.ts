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

  async lockDatabase() {
    await this.pool.query('BEGIN; LOCK TABLE "drivers" IN ACCESS EXCLUSIVE MODE;');
  }

  async unlockDatabase() {
    await this.pool.query('COMMIT;');
  }

  async checkIfExists() {
    try {
      const result = await this.pool.query('SELECT 1 FROM "drivers" LIMIT 1');
      return result.rowCount && result.rowCount > 0;
    } catch (error: any) {
      if (error.code === '42P01') { // Table does not exist
        return false;
      } else {
        throw error;
      }
    }
  }


  async initDrivers(drivers: Driver[]) {
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
    await this.lockDatabase();
    try {
      shuffle(drivers);
      for (const driver of drivers) {
        driver.imgUrl = `static/${driver.code.toLowerCase()}.png`;
        driver.place = drivers.indexOf(driver) + 1;
        await this.pool.query(
          'INSERT INTO "drivers" ("id", "code", "firstname", "lastname", "country", "team", "imgUrl", "place") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
          [driver.id, driver.code, driver.firstname, driver.lastname, driver.country, driver.team, driver.imgUrl, driver.place]
        );
      }
    } catch (err) {
      await this.pool.query('ROLLBACK');
      throw err;
    } finally {
      await this.unlockDatabase();
    }
  }

  async getDrivers() {
    const res = await this.pool.query('SELECT * FROM drivers ORDER BY place ASC');
    return res.rows;
  }

  async performOvertake(driverId: number, overtakes: number) {
    await this.lockDatabase();
    try {
      for (let i = 0; i < overtakes; i++) {
        const nextDriverToOvertake = await this.pool.query('SELECT "id" FROM "drivers" WHERE "place" = (SELECT "place" FROM "drivers" WHERE "id" = $1) - 1', [driverId]);
        if (nextDriverToOvertake.rows.length == 0) {
          break;
        }

        // Decrease the place of the driver overtaking
        await this.pool.query('UPDATE "drivers" SET "place" = "place" - 1 WHERE "id" = $1', [driverId]);

        // Increase the place of the driver being overtaken
        await this.pool.query('UPDATE "drivers" SET "place" = "place" + 1 WHERE "id" = $1', [nextDriverToOvertake.rows[0].id]);
      }
    } catch (err) {
      await this.pool.query('ROLLBACK');
      throw err;
    } finally {
      await this.unlockDatabase();
    }
  }
}

export interface Driver {
  id: number;
  code: string;
  firstname: string;
  lastname: string;
  country: string;
  team: string;
  imgUrl: string;
  place: number;
}
