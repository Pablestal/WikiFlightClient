import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import authReducer from "./authReducer";
import aerodromeReducer from "./aerodromeReducer";
import aircraftReducer from "./aircraftReducer";
import flightReducer from "./flightReducer";
import routetReducer from "./routeReducer";

const rootReducer = combineReducers({
  form: formReducer,
  auth: authReducer,
  aerod: aerodromeReducer,
  airc: aircraftReducer,
  flight: flightReducer,
  route: routetReducer
});

export default rootReducer;
