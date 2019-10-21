import { INITIALIZEFLIGHT, FLIGHTERROR, DELETEFLIGHT } from "../actions";

const initialData = { flights: "" };

export default function(state = initialData, action) {
  switch (action.type) {
    case INITIALIZEFLIGHT:
      return {
        ...state,
        flights: action.payload.flights
      };

    case DELETEFLIGHT:
      const numIndex = parseInt(action.payload.id);
      return {
        ...state,
        flights: state.flights.filter(flights => flights.id !== numIndex)
      };

    case FLIGHTERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
}
