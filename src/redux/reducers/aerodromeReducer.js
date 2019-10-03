import { INITIALIZEAER, AERODROMERROR } from "../actions";

const initialData = { aerodromes: "" };

export default function(state = initialData, action) {
  switch (action.type) {
    case INITIALIZEAER:
      return {
        ...state,
        aerodromes: action.payload.aerodromes
      };
    case AERODROMERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
}
