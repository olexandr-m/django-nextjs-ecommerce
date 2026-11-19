import { combineReducers } from "@reduxjs/toolkit";
import { baseApiSlice } from "./base-api-slice";

export const rootReducer = combineReducers({
  [baseApiSlice.reducerPath]: baseApiSlice.reducer,
});
