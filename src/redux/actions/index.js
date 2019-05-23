import { HTTP } from "../../common/http-common";
export const AUTHENTICATED = "authenticated_user";
export const UNAUTHENTICATED = "unauthenticated_user";
export const AUTHENTICATION_ERROR = "authentication_error";
export const ISAUTHENTICATED = "already_authenticated";

export function getToken() {
  return localStorage.getItem("token");
}

export function signInAction({ login, password }, history) {
  return async dispatch => {
    try {
      const res = await HTTP.post(`authenticate`, {
        login,
        password
      });
      localStorage.setItem("token", res.data.token);
      const req = await HTTP.get("account");
      dispatch({
        type: AUTHENTICATED,
        payload: {
          login: req.data.login,
          authority: req.data.authority
        }
      });
      history.push("/");
    } catch (error) {
      dispatch({
        type: AUTHENTICATION_ERROR,
        payload: "Invalid userName or password"
      });
    }
  };
}

export function signOutAction() {
  localStorage.clear();
  return {
    type: UNAUTHENTICATED
  };
}
