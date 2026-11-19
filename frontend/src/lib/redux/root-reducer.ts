import { combineReducers } from "@reduxjs/toolkit";
import { baseApiSlice } from "./base-api-slice";
import authReducer from "@/features/auth/slices/auth-slice";

export const rootReducer = combineReducers({
  [baseApiSlice.reducerPath]: baseApiSlice.reducer,
  auth: authReducer,
});
