import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useSelector, useDispatch } from "react-redux";
import { GetHours } from "../redux/weatherSlice";
import { useEffect } from "react";

export default function Today() {
  const dispatch = useDispatch();
  const { hoursData } = useSelector((state) => state.weather);

  useEffect(() => {
    dispatch(GetHours());
  }, [dispatch, hoursData]);

  return (
    <div
      className=" miniCard
      flex
        flex-nowrap
        gap-4
        overflow-x-auto 
        sm:justify-start
        md:justify-between
        lg:grid 
        lg:grid-cols-4
        xl:grid-cols-5"
    >
      {hoursData.map((data, index) => (
        <div
          key={index}
          className="flex-shrink-0 w-[8rem] sm:w-[10rem] md:w-[12rem]"
        >
          <Card className="shadow-lg rounded-lg">
            <Grid container alignItems="center" justifyContent="center">
              {/* Hour Display */}
              <div className="w-full bg-blue-600 p-2 rounded-t-lg">
                <Typography
                  variant="h6"
                  component="div"
                  className="text-white  text-center font-bold"
                >
                  {data.hour}:00
                </Typography>
              </div>
              {/* Weather Icon and Temperature */}
              <Grid item xs={12}>
                <CardContent className="flex flex-col items-center gap-2">
                  <img
                    src={`https://openweathermap.org/img/wn/${data.weatherIconCode}@2x.png`}
                    alt={data.weatherDescription}
                    className="w-12 h-12"
                  />
                  <Typography
                    variant="h6"
                    component="div"
                    className="text-black font-bold text-center"
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
