import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import authReducer from "./authReducer";
import aerodromeReducer from "./aerodromeReducer";

const rootReducer = combineReducers({
  form: formReducer,
  auth: authReducer,
  aerod: aerodromeReducer
});

export default rootReducer;
