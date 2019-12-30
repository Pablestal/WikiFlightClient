import { INITIALIZEROUTE, ROUTEERROR, DELETEROUTE } from "../actions";

const initialData = { routes: "" };

export default function(state = initialData, action) {
  switch (action.type) {
    case INITIALIZEROUTE:
      return {
        ...state,
        routes: action.payload.routes
      };

    case DELETEROUTE:
      const numIndex = parseInt(action.payload.id);
      return {
        ...state,
        routes: state.routes.filter(routes => routes.id !== numIndex)
      };

    case ROUTEERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
}
