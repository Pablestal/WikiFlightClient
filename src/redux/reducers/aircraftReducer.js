import { INITIALIZEAIRC, AIRCRAFTERROR, DELETEAIRCRAFT } from "../actions";

const initialData = { aircrafts: "" };

export default function(state = initialData, action) {
  switch (action.type) {
    case INITIALIZEAIRC:
      return {
        ...state,
        aircrafts: action.payload.aircrafts
      };

    case DELETEAIRCRAFT:
      const numIndex = parseInt(action.payload.id);
      return {
        ...state,
        aircrafts: state.aircrafts.filter(
          aircrafts => aircrafts.id !== numIndex
        )
      };

    case AIRCRAFTERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
}
