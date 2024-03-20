import {
  ApiDELETE,
  ApiGet,
  ApiPOST,
  ApiPOST_FORMDATA,
  ApiPUT,
} from "@/apis/config/API";

export function getFlashsets({ page, perPage, params }) {
  const URL = `/flashsets/list?page=${page}&perPage=${perPage}`;
  return ApiGet({ link: URL, params: params });
}

export function getFlashcardsByRole({
  page,
  perPage,
  filter_role,
  search_name,
  category,
}) {
  const newcategory = category === "all" ? "" : category;
  const URL = `/flashsets/list/role?page=${page}&perPage=${perPage}`;
  return ApiGet({
    link: URL,
    params: {
      page,
      perPage,
      filter_role,
      search_name,
      category: newcategory,
    },
  });
}

export function getFlashsetById(id, courseId) {
  const newCourseId = courseId ? courseId : "";
  const URL = `/flashsets/${id}`;
  return ApiGet({ link: URL, params: { courseId: newCourseId } });
}

export function getFlashcards({ id, page, perPage }) {
  const URL = `/flashsets/${id}/cards?page=${page}&perPage=${perPage}`;
  return ApiGet({ link: URL });
}

export function create(data) {
  const URL = `/flashsets/create`;
  return ApiPOST_FORMDATA({ link: URL, body: data });
}

export function del(id) {
  const URL = `/flashsets/delete?id=${id}`;
  return ApiDELETE({ link: URL });
}

export function getTeacherDistributed(flashet_id) {
  const URL = `/users/list/distributed?flashset_id=${flashet_id}`;
  return ApiGet({ link: URL });
}

export function flashsetsDistributed(body) {
  const URL = `/flashsets/distributed`;
  return ApiPOST({ link: URL, body: body });
}

export function update(id, data) {
  const URL = `/flashsets/edit?id=${id}`;
  return ApiPUT({ link: URL, body: data });
}

export function getMyFlashsets({ page, perPage, q, type }) {
  const search = q ? q : "";
  const newType = type;
  let URL = `/flashsets/list/me?page=${page}&perPage=${perPage}&search=${search}`;
  if (newType !== "" && newType !== "all") {
    URL += `&type=${newType}`;
  }
  return ApiGet({ link: URL });
}

export function histories(id, type, flashcards, courseId) {
  const newCourseId = courseId ? courseId : "";
  const URL = `/flashsets/${id}/histories?courseId=${newCourseId}`;
  return ApiPOST({ link: URL, body: { flashcards, type } });
  
}
