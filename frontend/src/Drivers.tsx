import React, {useEffect, useState} from 'react';
import {Flipper, Flipped} from 'react-flip-toolkit';
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

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(`${backendEndpoint}/api/drivers`);
      const sortedByPlace = response.data.sort((a: Driver, b: Driver) => a.place - b.place);
      setDrivers(sortedByPlace);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOvertake = async (driverId: number) => {
    try {
      await axios.post(`${backendEndpoint}/api/drivers/${driverId}/overtake`);
      await fetchDrivers();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDrivers().catch(e => console.error(e));
  }, []);

  const positionColors = ['#FFD700', '#949494', '#CD7F32'];

  return (
    <div className="flex flex-col justify-around max-h-screen">
      <h1 className="text-6xl text-center font-semibold m-8">Drivers</h1>
      <Flipper flipKey={drivers.map(driver => driver.id).join(",")} className="grow grid grid-cols-1 gap-4 overflow-auto">
        {drivers.map((driver, index) => (
          <Flipped key={driver.id} flipId={driver.id}>
            <div key={driver.id}
               className=" flex flex-row justify-between items-center bg-gradient-to-r from-gray-100 to-blue-50 p-4 shadow-md rounded-md border border-gray-200 mx-4">
            <div className="mx-auto"><p className="text-3xl font-bold w-16"
                                        style={{color: positionColors[index]}}>#{driver.place}</p>
            </div>
            <div className="relative">
              <img src={`${backendEndpoint}/${driver.imgUrl}`} alt="Driver" className="w-auto h-36 rounded-md mx-6"/>
              <div className="absolute -bottom-1 right-4 bg-white rounded p-1 w-12 border-black border-2">
                <p className="text-gray-600 text-center">{driver.code}</p>
              </div>
            </div>
            <div className="grow">
              <div className="flex flex-row items-center">
                <img src={`https://flagsapi.com/${driver.country}/flat/64.png`} alt="Country Flag"
                     className="h-10 mr-2"/>
                <h2 className="text-xl font-semibold">{driver.firstname} {driver.lastname}</h2>
              </div>
              <p className="text-gray-600">{driver.team}</p>
            </div>
            <button onClick={() => handleOvertake(driver.id)} disabled={driver.place === 1}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none disabled:bg-gray-300">
              Overtake
            </button>
          </div>
          </Flipped>
        ))}
      </Flipper>
    </div>
  );
}

export default Drivers;
