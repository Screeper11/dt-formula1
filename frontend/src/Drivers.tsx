import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {backendEndpoint} from "./env";

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

function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);

  // TODO handle errors
  // TODO handle when first is trying to overtake
  const fetchDrivers = async () => {
    const response = await axios.get(`${backendEndpoint}/api/drivers`);
    const sortedByPlace = response.data.sort((a:Driver, b:Driver) => a.place - b.place);
    setDrivers(sortedByPlace);
  };

  const handleOvertake = async (driverId: number) => {
    await axios.post(`${backendEndpoint}/api/drivers/${driverId}/overtake`);
    await fetchDrivers();
  };

  useEffect(() => {
    fetchDrivers().catch(e => console.error(e));
  }, []);

  return (
    <main>
      <h1 className="text-3xl font-semibold mb-4">DRIVERS</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map((driver) => (
          <div
            className="bg-white p-4 shadow-md rounded-md"
            key={driver.id}
          >
            <img
              src={`${backendEndpoint}/${driver.imgUrl}`}
              alt="Driver"
              className="w-full h-auto rounded-md"
            />
            <h2 className="text-xl font-semibold mt-2">
              {driver.firstname} {driver.lastname}
            </h2>
            <p className="text-gray-600">Team: {driver.team}</p>
            <p className="text-gray-600">Current Place: {driver.place}</p>
            <button
              onClick={() => handleOvertake(driver.id)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Overtake
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Drivers;
