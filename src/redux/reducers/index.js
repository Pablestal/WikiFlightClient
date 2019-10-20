import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import authReducer from "./authReducer";
import aerodromeReducer from "./aerodromeReducer";
import aircraftReducer from "./aircraftReducer";

const rootReducer = combineReducers({
  form: formReducer,
  auth: authReducer,
  aerod: aerodromeReducer,
  airc: aircraftReducer
});

export default rootReducer;
