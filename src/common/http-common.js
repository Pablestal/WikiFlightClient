import axios from "axios";
import { getToken } from "../redux/actions";
import { notify } from "react-notify-toast";

const baseURL = "http://localhost:8080/api/";

const HTTP = axios.create({
  baseURL: baseURL
});

const onUnauthorized = () => {
  notify.show("Access denied", "error", 3000);
};
const onResponseSuccess = response => response;

// si el servidor nos devuelve un 401 o 403,
// estamos intentando acceder a un recurso sin
// los permisos correctos
const onResponseFailure = err => {
  const status = err.response.status;
  if (status === 401 || status === 403) {
    onUnauthorized();
  }
  return Promise.reject(err);
};

// en cada request hay que añadir el token de autenticación
// si es que lo tenemos

const onRequest = config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

HTTP.interceptors.response.use(onResponseSuccess, onResponseFailure);
HTTP.interceptors.request.use(onRequest);
export { HTTP, baseURL };
