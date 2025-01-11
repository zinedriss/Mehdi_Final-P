import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_KEY = "891386664a64a4ab04e363e0aa0c4b1d";
const API_BASE_URL = "https://api.openweathermap.org/data/2.5";

// Fetch current weather data
export const fetchData = createAsyncThunk(
  "weather/fetchData",
  async ({ cityName }, { rejectWithValue }) => {
    const url = `${API_BASE_URL}/weather?q=${cityName}&appid=${API_KEY}`;
    try {
      const response = await axios.get(url);
      const data = response.data;

      return {
        wind: data.wind.speed,
        feelsLike: Math.round(data.main.feels_like - 273.15),
        humidity: Math.round(data.main.humidity),
        country: data.sys.country,
        description: data.weather[0].description,
        clouds: Math.round(data.main.temp - 273.15),
        tempMin: Math.round(data.main.temp_min - 273.15),
        tempMax: Math.round(data.main.temp_max - 273.15),
        city: data.name,
        weatherTitle: data.weather[0].main,
        iconWeather: data.weather[0].icon,
      };
    } catch (error) {
      console.error("Error fetching current weather data:", error);
      return rejectWithValue(
        error.response?.data || "Failed to fetch weather data"
      );
    }
  }
);

// Fetch today's hourly forecast
export const GetHours = createAsyncThunk(
  "weather/GetHours",
  async ({ lat, lon }, { rejectWithValue }) => {
    const url = `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    try {
      const response = await axios.get(url);
      const forecastData = response.data.list;

      const today = new Date().setHours(0, 0, 0, 0);
      const filteredData = forecastData.filter((entry) => {
        const forecastDate = new Date(entry.dt * 1000).setHours(0, 0, 0, 0);
        return forecastDate === today;
      });

      return filteredData.map((entry) => ({
        hour: new Date(entry.dt * 1000).getHours(),
        temperature: Math.round(entry.main.temp),
        weatherDescription: entry.weather[0].description,
        weatherIconCode: entry.weather[0].icon,
        kolchi: entry,
      }));
    } catch (error) {
      console.error("Error fetching hourly forecast:", error);
      return rejectWithValue(
        error.response?.data || "Failed to fetch hourly forecast"
      );
    }
  }
);

// Fetch latitude and longitude
export const GetLatLon = createAsyncThunk(
  "weather/GetLatLon",
  async ({ cityName }, { rejectWithValue }) => {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${API_KEY}`;
    try {
      const response = await axios.get(url);
      const { lat, lon } = response.data[0];
      return { lat, lon };
    } catch (error) {
      console.error("Error fetching latitude and longitude:", error);
      return rejectWithValue(
        error.response?.data || "Failed to fetch location data"
      );
    }
  }
);

// Fetch tomorrow's hourly forecast
export const GetTomorrowHours = createAsyncThunk(
  "weather/GetTomorrowHours",
  async ({ lat, lon }, { rejectWithValue }) => {
    const url = `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

    try {
      const response = await axios.get(url);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDate = tomorrow.toISOString().split("T")[0];

      const hourlyForecast = response.data.list
        .filter((entry) => entry.dt_txt.startsWith(tomorrowDate))
        .map((entry) => ({
          hour: new Date(entry.dt * 1000).getHours(),
          temperature: Math.round(entry.main.temp),
          weatherIconCode: entry.weather[0].icon,
          weatherDescription: entry.weather[0].description,
        }));

      return hourlyForecast;
    } catch (error) {
      console.error("Error fetching tomorrow's hourly forecast:", error);
      return rejectWithValue(
        error.response?.data || "Failed to fetch tomorrow's forecast"
      );
    }
  }
);

export const weatherDays = createAsyncThunk(
  "weather/weatherDays",
  async ({ lat, lon }, { rejectWithValue }) => {
    try {
      const API_KEY = "891386664a64a4ab04e363e0aa0c4b1d";
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );

      // Organize forecast data by date
      const groupedData = response.data.list.reduce((acc, entry) => {
        const date = entry.dt_txt.split(" ")[0]; // Extract date (YYYY-MM-DD)

        if (!acc[date]) acc[date] = [];
        acc[date].push({
          temperature: Math.round(entry.main.temp),
          iconWeather: entry.weather[0].icon,
        });

        return acc;
      }, {});

      return groupedData;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCity = createAsyncThunk(
  "location/fetchCity",
  async (_, thunkAPI) => {
    try {
      const getUserLocation = () => {
        return new Promise((resolve, reject) => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                resolve({ latitude, longitude });
              },
              (error) => {
                reject(error.message);
              }
            );
          } else {
            reject("Geolocation is not supported by this browser.");
          }
        });
      };

      const location = await getUserLocation();

      // Call reverse geocoding API to get the city
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse`,
        {
          params: {
            lat: location.latitude,
            lon: location.longitude,
            format: "json",
          },
        }
      );

      return (
        response.data.address.city ||
        response.data.address.town ||
        response.data.address.village
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const weatherApiSlice = createSlice({
  name: "weather",
  initialState: {
    temperature: null,
    geo: null,
    hoursData: [],
    tomorrowHoursData: [],
    forecast: {},

    loading: false,
    error: null,
    city: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.temperature = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GetHours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetHours.fulfilled, (state, action) => {
        state.loading = false;
        state.hoursData = action.payload;
      })
      .addCase(GetHours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GetLatLon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetLatLon.fulfilled, (state, action) => {
        state.loading = false;
        state.geo = action.payload;
      })
      .addCase(GetLatLon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GetTomorrowHours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetTomorrowHours.fulfilled, (state, action) => {
        state.loading = false;
        state.tomorrowHoursData = action.payload;
      })
      .addCase(GetTomorrowHours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(weatherDays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(weatherDays.fulfilled, (state, action) => {
        state.loading = false;
        state.forecast = action.payload;
      })
      .addCase(weatherDays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch forecast data.";
      })
      .addCase(fetchCity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCity.fulfilled, (state, action) => {
        state.loading = false;
        state.city = action.payload;
      })
      .addCase(fetchCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch forecast data.";
      });
  },
});

export default weatherApiSlice.reducer;
