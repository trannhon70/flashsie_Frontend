import { config } from "@/config";
import axios from "axios";
import instance from "./config";
import { ApiPOST } from "./config/API";

const BASE_URL = config.REACT_APP_BASE_URL;
export function sendOTP(uid) {
  return instance
    .post("/auth/send-otp", { uid })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
}

export function login(data) {
  const URL = `/auth/login`;
  return ApiPOST({ link: URL, body: data });
  // return instance
  //   .post("/auth/login", data)
  //   .then((res) => {
  //     return res.data;
  //   })
  //   .catch((error) => {
  //     throw error;
  //   });
}

export function register(data) {
  return instance
    .post("/auth/register", data)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function verifyOTP({ uid, code }) {
  return axios({
    url: `${BASE_URL}/auth/otp-verify`,
    data: { uid, code },
    method: "POST",
  }).then((res) => res.data);
}
export function resetPassword(uid) {
  return instance
    .post("/auth/reset-password", { uid })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      throw error;
    });
  // return axios({
  //   url: `${BASE_URL}/auth/reset-password`,
  //   data: { uid },
  //   method: "POST",
  // }).then((res) => res.data);
}
export function updatePassword(password, token) {
  return axios({
    url: `${BASE_URL}/auth/reset-password`,
    data: { password, token },
    method: "PUT",
  }).then((res) => res.data);
}

export function changePassword(oldPassword, newPassword) {
  return axios({
    url: `${BASE_URL}/auth/change-password`,
    data: { oldPassword, newPassword },
    method: "PUT",
  }).then((res) => res.data);
}
