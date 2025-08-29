import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import api from "./middlewares/api";
import reducer from "./reducer";

export default function () {
  return configureStore({
    reducer,
    middleware: [...getDefaultMiddleware(), api],
  });
}


// store file
// Configures the Redux store using Redux Toolkit.
// Adds:
// reducer → root reducer (auth slice here)
// Middleware:
// Default middleware from RTK (includes thunk, serializable checks, etc.)
// custom api middleware, which handles API actions (apiCallBegun).