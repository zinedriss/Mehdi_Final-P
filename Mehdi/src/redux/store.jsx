import { configureStore } from "@reduxjs/toolkit";
import weatherApiSlice from './weatherSlice.jsx'


export const store = configureStore({
    reducer : {
          weather : weatherApiSlice,
    },
});
