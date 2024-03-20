import {
  ApiPOST,
  ApiPOSTNoToken,
  ApiPUT,
  ApiPUTNoToken,
} from "@/apis/config/API";

export function login(data) {
  const URL = `/auth/login`;
  return ApiPOSTNoToken({ link: URL, body: data });
}

export function changePassword(oldPassword, newPassword, confirmPassword) {
  const URL = `/auth/change-password`;
  return ApiPOST({
    link: URL,
    body: { oldPassword, newPassword, confirmPassword },
  });
}

export function sendOTP(uid) {
  const URL = `/auth/send-otp`;
  return ApiPOSTNoToken({ link: URL, body: { uid } });
}

export function verifyOTP({ uid, code }) {
  const URL = `/auth/verify-otp`;
  return ApiPOSTNoToken({ link: URL, body: { uid, code } });
}

export function register(data) {
  const URL = `/auth/register`;
  return ApiPOSTNoToken({ link: URL, body: data });
}

export function resetPassword(uid) {
  const URL = `/auth/send-reset-password`;
  return ApiPOSTNoToken({ link: URL, body: { uid } });
}

export function updatePassword(password, token) {
  const URL = `/auth/verify-reset-password`;
  return ApiPUTNoToken({ link: URL, body: { password, token } });
}
