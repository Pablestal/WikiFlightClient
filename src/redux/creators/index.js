import axios from "axios";
//import { HTTP } from "../../common/http-common";

export const AUTHENTICATED = "authenticated_user";
export const UNAUTHENTICATED = "unauthenticated_user";
export const AUTHENTICATION_ERROR = "authentication_error";

// function authenticate() {
//   return HTTP.get(`account`).then(response => {
//     user.login = response.data.login;
//     user.authority = response.data.authority;
//     user.logged = true;
//     console.log(user);
//     return user;
//   });
// }
const url = "http://localhost:8080/api/";

// export function getToken() {
//   return localStorage.getItem("token");
// }

export function signInAction({ login, password }, history) {
  return async dispatch => {
    try {
      const res = await axios.post(`${url}authenticate`, {
        login,
        password
      });
      dispatch({ type: AUTHENTICATED });
      localStorage.setItem("token", res.data.token);
      history.push("/");
      // authenticate();
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
