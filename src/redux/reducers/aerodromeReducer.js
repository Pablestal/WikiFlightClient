import { INITIALIZEAER, AERODROMERROR, DELETEAERODROME } from "../actions";

const initialData = { aerodromes: "" };

export default function(state = initialData, action) {
  switch (action.type) {
    case INITIALIZEAER:
      return {
        ...state,
        aerodromes: action.payload.aerodromes
      };

    case DELETEAERODROME:
      const numIndex = parseInt(action.payload.id);
      return {
        ...state,
        aerodromes: state.aerodromes.filter(
          aerodromes => aerodromes.id !== numIndex
        )
      };

    case AERODROMERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
}
