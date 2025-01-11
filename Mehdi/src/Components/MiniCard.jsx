// Redux
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { weatherDays } from "../redux/weatherSlice";

export default function MiniCard() {
  // Access data from Redux store
  const { forecast, loading, error } = useSelector((state) => state.weather);

  const dispatch = useDispatch();

  // Fetch weather data when the component loads
  useEffect(() => {
    dispatch(weatherDays()); // Replace with the default or dynamic city name
  }, [dispatch]);

  // Handle loading or error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!forecast) return <p>No forecast data available.</p>;

  // Prepare cards for the 5-day forecast
  const cards = Object.keys(forecast)
    .slice(0, 5) // Get only the first 5 days
    .map((day, index) => {
      const dayData = forecast[day];
      const avgTemp = Math.round(
        dayData.reduce((acc, item) => acc + item.temperature, 0) /
          dayData.length
      );
      const icon = dayData[0].iconWeather;

      // Convert date string to a day name
      const dateObj = new Date(day);
      const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });

      return (
        <div
          key={index}
          className="glassCard  flex-shrink-0 justify-between items-center m-2 min-w-[10rem] max-w-[12rem] h-[10rem] p-4 flex flex-col"
        >
          {/* Add day name */}
          <p className="text-center text-2xl mb-2 ">{dayName}</p>
          <hr className="bg-white w-full" />
          <div className="w-full flex justify-center items-center flex-1">
            <img
              src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
              alt="Weather icon"
              className="w-[4rem] h-[4rem]"
            />
          </div>
          <p className="text-center font-bold">{avgTemp}&deg;C</p>
        </div>
      );
    });

  return (
    <div className="w-full mx-auto py-4">
      {/* Add the title */}
      <h2 className="text-start text-4xl pl-8 text-white font-bold mb-4">
        Next 5 Days
      </h2>
      <div className="daysCard flex flex-wrap lg:flex-wrap gap-x-4">
        {cards}
      </div>
    </div>
  );
}
