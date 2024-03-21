import {
  ApiDELETE,
  ApiGet,
  ApiPATCH,
  ApiPOST,
  ApiPUT,
} from "@/apis/config/API";

export function update(data) {
  const URL = `/users/edit/profile`;
  return ApiPUT({ link: URL, body: data });
}

export function getProfile() {
  const URL = `/users/profile`;
  return ApiGet({ link: URL });
}

export function getFriends(params) {
  const URL = `/users/list/friends?page=${params.page}&perPage=${params.perPage}`;
  return ApiGet({ link: URL });
}

export function getUsers(params) {
  const URL = `/users/list`;
  return ApiGet({ link: URL, params: params });
}

export function updateType(id, data) {
  const URL = `/users/edit/profile?id=${id}`;
  return ApiPATCH({ link: URL, body: data });
}

export function importUsers(data) {
  const URL = `/users/create/import`;
  return ApiPOST({ link: URL, body: data });
}

export function addFriend(id) {
  const URL = `/users/friend/request?recipientId=${id}`;
  return ApiPOST({ link: URL });
}

export function deleteUser(id) {
  const URL = `/users/delete?userId=${id}`;
  return ApiDELETE({ link: URL });
}

export function unFriend(id) {
  const URL = `/users/friendship/delete?recipientId=${id}`;
  return ApiDELETE({ link: URL });
}

export function acceptFriend(id) {
  const URL = `/users/friend/accept?recipientId=${id}`;
  return ApiPOST({ link: URL });
}

export function get(id) {
  return axios({
    url: `/api/users/${id}`,
    method: 'GET',
  }).then((res) => res.data)
}