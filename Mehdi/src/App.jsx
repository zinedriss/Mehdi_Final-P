import "./App.css";
import search from "./assets/icons/search.svg";
import { BackgroundLayout, WeatherCard, MiniCard } from "./Components";
import Today from "./Components/Today";
import Tomorrow from "./Components/Tomorrow";
import { useState, useEffect } from "react";
import {
  fetchCity,
  fetchData,
  GetHours,
  GetLatLon,
  GetTomorrowHours,
  weatherDays,
} from "./redux/weatherSlice";
import FilterDramaIcon from "@mui/icons-material/FilterDrama";
import Button from "@mui/material/Button";
import NightsStayOutlinedIcon from "@mui/icons-material/NightsStayOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import Switch from "@mui/material/Switch";
import { useDispatch, useSelector } from "react-redux";

function App() {
  const city = useSelector((state) => state.weather.city);
  useEffect(() => {
    if (city) {
      setCityName(city);
    }
  }, [city]);
  const getLL = useSelector((state) => state.weather.geo);
  const lat = getLL?.lat;
  const lon = getLL?.lon;

  const [cityName, setCityName] = useState(city || "rabat");
  const [inputValue, setInputValue] = useState("");
  const dispatch = useDispatch();

  const handleSearch = () => {
    setCityName(inputValue);
    setInputValue("");
  };

  useEffect(() => {
    dispatch(fetchCity());
  }, [dispatch]);

  useEffect(() => {
    // Dispatch action to fetch weather data when cityName is set
    dispatch(fetchData({ cityName }));
    dispatch(GetLatLon({ cityName }));
  }, [cityName, dispatch]);
  useEffect(() => {
    if (lat && lon) {
      dispatch(GetHours({ lat, lon }));
      dispatch(GetTomorrowHours({ lat, lon }));
      dispatch(weatherDays({ lat, lon }));
    }
  }, [lat, lon, dispatch]);

  return (
    <div className="w-full h-screen text-white px-4 md:px-8">
      <nav className="w-full border-b-2 border-gray-400 p-3 flex flex-wrap sm:flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <FilterDramaIcon />
          <h1 className="font-bold tracking-wide text-2xl md:text-3xl xl:text-4xl">
            Weather{" "}
          </h1>
        </div>

        <div className="bg-white w-full sm:w-[20rem] shadow-2xl rounded flex items-center p-2 gap-2">
          <img
            src={search}
            onClick={() => {
              setCityName(inputValue);
              handleSearch();
            }}
            alt="search"
            className="w-[1.5rem] h-[1.5rem] cursor-pointer"
          />
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.currentTarget.value)}
            type="text"
            placeholder="Search city"
            className="focus:outline-none w-full text-[#212121] text-sm md:text-lg"
          />
        </div>

        <div className="mode flex items-center gap-2">
          <button>
            <LightModeOutlinedIcon className="light" />
          </button>
          <Switch />
          <button>
            <NightsStayOutlinedIcon className="dark" />
          </button>
        </div>
      </nav>

      <BackgroundLayout />

      <main className="w-full flex flex-wrap gap-6 py-4 px-4 md:px-[10%] items-center justify-center">
        <WeatherCard />

        <div className="flex flex-col md:flex-row justify-center gap-4 w-full md:w-[60%]">
          <MiniCard />
        </div>
        <hr className=" line bg-white w-full" />
        <div className="w-full flex justify-center my-4">
          <Button className="button-t" variant="contained" color="success">
            Today
          </Button>
        </div>

        <div className="w-full flex justify-center flex-wrap">
          <Today />
        </div>

        <div className="w-full flex justify-center my-4">
          <Button className="button-t" variant="contained" color="success">
            Tomorrow
          </Button>
        </div>

        <div className="w-full flex justify-center flex-wrap">
          <Tomorrow />
        </div>
      </main>
    </div>
  );
}

export default App;
