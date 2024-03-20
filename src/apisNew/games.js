import {
  ApiDELETE,
  ApiGet,
  ApiPOST_FORMDATA,
  ApiPUT_FORMDATA,
} from "@/apis/config/API";

export function readAll(params) {
  const URL = `/games/list`;
  return ApiGet({ link: URL, params });
}

export function me(params) {
  const URL = `/games/list/me`;
  return ApiGet({ link: URL, params });
}

export function create(data) {
  const URL = `/games/create`;
  return ApiPOST_FORMDATA({ link: URL, body: data });
}

export function readById(id) {
  const URL = `/games/detail?id=${id}`;
  return ApiGet({ link: URL });
}

export function del(id) {
  const URL = `/games/delete?id=${id}`;
  return ApiDELETE({ link: URL });
}

export function update(id, data) {
  const URL = `/games/edit?id=${id}`;
  return ApiPUT_FORMDATA({ link: URL, body: data });
}

export function scenes(id) {
  const URL = `/games/scene?miniGameId=${id}`;
  return ApiGet({ link: URL });
}

export function cardsOfScene(gameId, sceneId) {
  const URL = `/games/scene/detail?miniGameId=${gameId}&positionScene=${sceneId}`;
  return ApiGet({ link: URL });
}

