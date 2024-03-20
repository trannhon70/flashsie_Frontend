import {
  ApiDELETE,
  ApiGet,
  ApiPOST,
  ApiPOST_FORMDATA,
  ApiPUT_FORMDATA,
} from "@/apis/config/API";

export function getFlashcard({ page, perPage }) {
  return axios({
    url: `/api/flashset/?page=${page}&perPage=${perPage}`,
    method: "GET",
  }).then((res) => res.data);
}

export function getFlashcardById(id) {
  const URL = `/flashcards/detail?id=${id}`;
  return ApiGet({ link: URL });
}

export function del(id) {
  const URL = `/flashcards/delete?flashcardId=${id}`;
  return ApiDELETE({ link: URL });
}

export function create(data, flashsetId) {
  const newflashsetId = flashsetId ? flashsetId : "";
  const URL = `/flashcards/create?flashsetId=${newflashsetId}`;
  return ApiPOST_FORMDATA({ link: URL, body: data });
}

export function update(id, data) {
  const URL = `/flashcards/edit?flashcardId=${id}`;
  return ApiPUT_FORMDATA({ link: URL, body: data });
}

export function importCard(data, id) {
  const URL = `/flashcards/create/import?flashsetId=${id}`;
  return ApiPOST({ link: URL, body: data });
}
