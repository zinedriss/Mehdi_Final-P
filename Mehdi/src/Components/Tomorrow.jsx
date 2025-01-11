import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useSelector, useDispatch } from "react-redux";
import { GetTomorrowHours } from "../redux/weatherSlice"; // Action to fetch tomorrow's forecast
import { useEffect } from "react";

export default function Tomorrow() {
  const dispatch = useDispatch();
  const { tomorrowHoursData } = useSelector((state) => state.weather);

  useEffect(() => {
    dispatch(GetTomorrowHours());
  }, [dispatch]);

  return (
    <div className="miniCard flex flex-nowrap md:flex-row sm:overflow-x-auto gap-4 p-4">
      {tomorrowHoursData.map((data, index) => (
        <div
          key={index}
          className="forecast-item flex-shrink-0 w-[8rem] md:w-[10rem] lg:w-[12rem]"
        >
          <Card className="mb-3 shadow-lg rounded-lg">
            <Grid container alignItems="center" justifyContent="center">
              <div className="w-full bg-blue-600">
                <Grid className="mb-3">
                  <Typography
                    variant="h6"
                    component="div"
                    className="text-white font-bold flex items-center justify-center"
                  >
                    {data.hour}:00
                  </Typography>
                </Grid>
              </div>
              <Grid item xs={8}>
                <CardContent className="text-center">
                  <img
                    src={`https://openweathermap.org/img/wn/${data.weatherIconCode}@2x.png`}
                    alt={data.weatherDescription}
                    className="w-16 h-16 mx-auto"
                  />
                  <Typography
                    variant="h6"
                    component="div"
                    className="text-black font-bold"
                  >
                    {data.temperature}°C
                  </Typography>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        </div>
      ))}
    </div>
  );
}
