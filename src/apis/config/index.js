import { config } from "@/config";
import { SessionStore } from "@/config/sesstionStore";
import axios from "axios";
const BASE_URL = config.REACT_APP_BASE_URL;

const instance = axios.create({
  baseURL: BASE_URL,

  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer" + `${SessionStore?.getUserSession()?.accessToken}`,
  },
});

instance.interceptors.request.use(
  function (config) {
    // const accessToken = SessionStore?.getUserSession()?.accessToken;
    // if (accessToken) {
    //   config.headers.Authorization = `Bearer ${accessToken}`;
    // }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(function (response) {
  if (response.headers['content-type']?.includes('application/json')) {
    return response.data;
  } else {
    return response;
  }
}, function (error) {
  return Promise.reject(error);
});
export default instance;
