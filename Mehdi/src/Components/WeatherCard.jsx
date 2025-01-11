import '../index.css';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchData } from '../redux/weatherSlice';
import moment from 'moment';
import { IconButton } from '@mui/material';

function WeatherCard() {
  const dateAndTime = moment().format('LLLL');
  const data = useSelector((state) => state.weather.temperature);
  const dispatch = useDispatch();

  useEffect(() => {
    // Provide a default city name for the initial fetch
    dispatch(fetchData({ cityName: "ifrane" }));
  }, [dispatch]);

  // Handle loading or undefined data
  if (!data) {
    return (
      <div className="w-[90%] max-w-[23rem] h-[28rem] md:h-[32rem] glassCard p-4 flex justify-center items-center mx-auto">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-[90%] max-w-[23rem] h-[28rem] md:h-[32rem] glassCard p-4 mx-auto">
      <div className="flex w-full justify-center items-center gap-4 mt-6 md:mt-8 mb-2">
        <div className="flex flex-col md:flex-row justify-center items-center">
          <p className="font-bold text-5xl md:text-7xl flex justify-center items-center">
            {data.clouds}&deg;C
          </p>
          <IconButton>
            <img
              src={`http://openweathermap.org/img/wn/${data.iconWeather}@2x.png`}
              alt="Weather Icon"
              className="w-12 h-12 md:w-16 md:h-16"
            />
          </IconButton>
        </div>
      </div>
      <div className="font-bold text-center text-2xl md:text-3xl">
        {data.city}
      </div>
      <div className="w-full flex justify-center items-center mt-4">
        <p className="text-sm md:text-base">{dateAndTime}</p>
      </div>
      <div className="w-full flex justify-between items-center mt-4 gap-2 md:gap-4">
        <span className="flex-1 text-center p-2 font-bold bg-blue-600 shadow rounded-lg text-sm md:text-base">
          Wind Speed
          <p className="font-normal">{data.wind} km/h</p>
        </span>
        <span className="flex-1 text-center p-2 font-bold rounded-lg bg-green-600 text-sm md:text-base">
          Humidity
          <p className="font-normal">{data.humidity} %</p>
        </span>
      </div>
      <div className="w-full p-3 mt-4 flex justify-between items-center text-sm md:text-lg">
        <p className="font-semibold">Min: {data.tempMin}&deg;C</p>
        <p className="font-semibold">Max: {data.tempMax}&deg;C</p>
      </div>
      <hr className="bg-slate-600" />
      <div className="w-full p-4 flex justify-center items-center text-xl md:text-3xl font-semibold">
        {data.description}
      </div>
    </div>
  );
}

export default WeatherCard;
