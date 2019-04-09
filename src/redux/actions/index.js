import { HTTP } from "../../common/http-common";

export const AUTHENTICATED = "authenticated_user";
export const UNAUTHENTICATED = "unauthenticated_user";
export const AUTHENTICATION_ERROR = "authentication_error";

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
      HTTP.get("account").then(res => {
        console.log(res.data);
        dispatch({
          type: AUTHENTICATED,
          login: res.data.login,
          authority: res.data.authority
        });
      });
      localStorage.setItem("token", res.data.token);
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
  console.log("Logging out");
  localStorage.clear();
  return {
    type: UNAUTHENTICATED
  };
}
