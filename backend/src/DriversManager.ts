export class DriversManager {
  drivers: Driver[];

  constructor(drivers: Driver[]) {
    this.drivers = drivers;
    this.randomizeDriversOrder();
    this.updateDriversData();
  }

  randomizeDriversOrder() {
    this.drivers.sort(() => Math.random() - 0.5);
  }

  updateDriversData() {
    this.drivers.forEach((driver, index) => {
      driver.imgUrl = `static/${driver.code.toLowerCase()}.png`;
      driver.place = index + 1;
    });
  }

  findDriverById(id: number): Driver | undefined {
    return this.drivers.find(driver => driver.id === id);
  }

  canOvertake(driver: Driver | undefined): boolean {
    return driver !== undefined && driver.place > 1;
  }

  performOvertake(driver: Driver) {
    const overtakenDriver = this.drivers.find(d => d.place === driver.place - 1);
    if (overtakenDriver) {
      driver.place--;
      overtakenDriver.place++;
    }
  }

  compareByPlace(a: Driver, b: Driver): number {
    return a.place - b.place;
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
