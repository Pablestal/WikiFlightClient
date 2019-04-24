import {
  AUTHENTICATED,
  UNAUTHENTICATED,
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
      //console.log(action.payload);
      //console.log(action.payload.login);

      let payload = action.payload;

      return {
        ...state,
        ...payload,
        authenticated: true
      };

    case UNAUTHENTICATED:
      return { ...state, authenticated: false };
    case AUTHENTICATION_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
}
