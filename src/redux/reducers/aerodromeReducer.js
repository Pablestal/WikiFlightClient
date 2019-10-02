import { INITIALIZEAER, INITIALIZATIONERROR } from "../actions";

const initialData = [];

export default function(state = initialData, action) {
  switch (action.type) {
    case INITIALIZEAER:
      return {
        ...state,
        ...action.payload
      };

    case INITIALIZATIONERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
}
