import { ApiDELETE, ApiGet, ApiPOST } from "@/apis/config/API";

export function get() {
  const URL = `/bookmark/list`;
  return ApiGet({ link: URL });
}

export function create(parentId, parentType) {
  const URL = `/bookmark/create`;
  return ApiPOST({ link: URL, body: { parentId, parentType } });
}

export function del(parentId, parentType) {
  const URL = `/bookmark/delete?parentId=${parentId}&parentType=${parentType}`;
  return ApiDELETE({ link: URL });
}
