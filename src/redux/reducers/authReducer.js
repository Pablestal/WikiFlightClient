import {
  AUTHENTICATED,
  UNAUTHENTICATED,
  ISAUTHENTICATED,
  AUTHENTICATION_ERROR
} from "../actions";

const initialState = {
  login: "",
  authority: "",
  authenticated: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case AUTHENTICATED:
      return {
        ...state,
        ...action.payload,
        authenticated: true
      };
    case ISAUTHENTICATED:
      return { ...state, ...action.payload };
    case UNAUTHENTICATED:
      return { ...state, authenticated: false };
    case AUTHENTICATION_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
}
