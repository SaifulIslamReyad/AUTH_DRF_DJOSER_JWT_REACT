import { combineReducers } from "redux";
import authReducer from "./auth";

export default combineReducers({
  auth: authReducer,
});




// Combines multiple reducers into one root reducer.
// Right now we only have authReducer.
// In Redux store, the auth slice of state will look like:
// state = {
//   auth: {
//     access: "...",
//     refresh: "...",
//     isAuthenticated: false,
//     user: {},
//     loading: false,
//     error: null,
//   }
// }