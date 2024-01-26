import React, {useEffect, useState} from 'react';
import {Flipper, Flipped} from 'react-flip-toolkit';
import axios from 'axios';

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
  const positionColors = ['#CBB01E', '#949494', '#CD7F32'];
  const [overtakeCounters, setOvertakeCounters] = useState(Array(21).fill(1));
  const [drivers, setDrivers] = useState<Driver[]>([]);

  const handleOvertakeCounterChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setOvertakeCounter(index, Number(event.target.value));
  };

  function setOvertakeCounter(index: number, value: number) {
    const newValues = [...overtakeCounters];
    newValues[index] = value;
    setOvertakeCounters(newValues);
  }

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/drivers`);
      const sortedByPlace = response.data.sort((a: Driver, b: Driver) => a.place - b.place);
      setDrivers(sortedByPlace);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOvertake = async (index: number, driverId: number) => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND}/api/drivers/${driverId}/overtake?overtakes=${overtakeCounters[index]}`);
      await fetchDrivers();
      setOvertakeCounter(index, 1)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDrivers().catch(e => console.error(e));
  }, []);

  return (
    <div className="flex flex-col justify-around max-h-screen">
      <h1 className="text-6xl text-center font-semibold m-8">Drivers</h1>
      <Flipper flipKey={drivers.map(driver => driver.id).join(",")}
               className="grow grid grid-cols-1 gap-4 min-w-[700px] overflow-auto select-none">
        {drivers.map((driver, index) => (
          <Flipped key={driver.id} flipId={driver.id}>
            <div key={driver.id}
                 className="flex flex-row justify-between items-center bg-gradient-to-r from-gray-100 to-blue-50 p-4 shadow-md rounded-md border border-gray-200 mx-4">
              <div className="mx-auto"><p className="text-3xl font-bold w-16"
                                          style={{color: positionColors[index]}}>#{driver.place}</p>
              </div>
              <div className="relative">
                <img draggable={false} src={`${process.env.REACT_APP_BACKEND}/${driver.imgUrl}`} alt="Driver"
                     className="w-auto h-36 rounded-md mx-6"/>
                <div className="absolute -bottom-1 right-4 bg-white rounded p-1 w-12 border-black border-2">
                  <p className="text-black font-bold text-center">{driver.code}</p>
                </div>
              </div>
              <div className="grow">
                <div className="flex flex-row items-center">
                  <img draggable={false} src={`https://flagsapi.com/${driver.country}/flat/64.png`} alt="Country Flag"
                       className="h-10 mr-2"/>
                  <h2 className="text-xl font-semibold select-text">{driver.firstname} {driver.lastname}</h2>
                </div>
                <p className="text-gray-600 select-text">{driver.team}</p>
              </div>
              <button onClick={() => handleOvertake(index, driver.id)} disabled={driver.place === 1}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none disabled:bg-gray-300">
                Overtake
              </button>
              <input
                type="number"
                className="mx-2 py-2 text-center border shadow rounded-md p-1 w-12"
                value={overtakeCounters[index]}
                min="1"
                max="20"
                onChange={handleOvertakeCounterChange(index)}
              />
              <div className="w-16">{overtakeCounters[index] > 1 ? "positions" : "position"}</div>
            </div>
          </Flipped>
        ))}
      </Flipper>
      <div className="bg-gray-100 text-center text-gray-500 text-sm p-4 border-t-2 border-bla">
        <p>Made by Bence Papp: <a className="text-blue-600 hover:underline"
                                  href="https://github.com/Screeper11/dt-formula1">DT-Formula1
          on GitHub</a>.</p>
      </div>
    </div>
  );
}

export default Drivers;
