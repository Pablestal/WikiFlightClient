import { HTTP } from "../../common/http-common";
export const AUTHENTICATED = "authenticated_user";
export const UNAUTHENTICATED = "unauthenticated_user";
export const AUTHENTICATION_ERROR = "authentication_error";
export const ISAUTHENTICATED = "already_authenticated";
export const INITIALIZEAER = "initialized_aerodromes";
export const AERODROMERROR = "aerodrome_error";
export const DELETEAERODROME = "delete_aerodrome";
export const INITIALIZEAIRC = "initialized_aircraft";
export const AIRCRAFTERROR = "aircraft_error";
export const DELETEAIRCRAFT = "delete_aircraft";

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

export function initializeAircAction(aircrafts) {
  return async dispatch => {
    try {
      dispatch({
        type: INITIALIZEAIRC,
        payload: {
          aircrafts: aircrafts
        }
      });
    } catch (error) {
      dispatch({
        type: AIRCRAFTERROR,
        payload: "Not possible to load aircrafts."
      });
    }
  };
}

export function initializeAerAction(aerodromes) {
  return async dispatch => {
    try {
      dispatch({
        type: INITIALIZEAER,
        payload: {
          aerodromes: aerodromes
        }
      });
    } catch (error) {
      dispatch({
        type: AERODROMERROR,
        payload: "Not possible to load aerodromes."
      });
    }
  };
}

export function deleteAerAction(aerodrome) {
  return async dispatch => {
    try {
      dispatch({
        type: DELETEAERODROME,
        payload: {
          id: aerodrome.id
        }
      });
    } catch (error) {
      dispatch({
        type: AERODROMERROR,
        payload: "Not possible to delete aerodrome."
      });
    }
  };
}
