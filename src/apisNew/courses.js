import {
  ApiDELETE,
  ApiGet,
  ApiPOST,
  ApiPOST_FORMDATA,
  ApiPUT,
} from "@/apis/config/API";

export function getCourses({ page, perPage, params }) {
  const URL = `/courses/list?page=${page}&perPage=${perPage}`;
  return ApiGet({ link: URL, params: params });
}

export function getInvites({ page, perPage }) {
  const URL = `/courses/invites?page=${page}&perPage=${perPage}`;
  return ApiGet({ link: URL });
}

export function updateStudent(id, studentId, status = "pending") {
  const URL = `/courses/${id}/students/${studentId}`;
  return ApiPUT({ link: URL, body: status });
}

export function updateStatusStudent(id, studentId, status = "pending") {
  const URL = `/courses/approve/student?courseId=${id}&studentId=${studentId}&status=${status}`;
  return ApiPUT({ link: URL });
}

export function getStudents(id, { page, perPage }) {
  const URL = `/courses/${id}/students?page=${page}&perPage=${perPage}`;
  return ApiGet({ link: URL });
}

export function getCourseById(id) {
  const URL = `/courses/${id}/detail`;
  return ApiGet({ link: URL });
}

export function getQuiz(id, flashsetId, params) {
  const URL = `/courses/${id}/flashsets/${flashsetId}/quiz?`;
  return ApiGet({ link: URL, params });
}

export function myCourses(params) {
  const URL = `/courses/list/me`;
  return ApiGet({ link: URL, params });
}

export function create(data) {
  const URL = `/courses/create`;
  return ApiPOST_FORMDATA({ link: URL, body: data });
}

export function del(id) {
  const URL = `/courses/delete?id=${id}`;
  return ApiDELETE({ link: URL });
}

export function update(id, data) {
  const URL = `/courses/edit?id=${id}`;
  return ApiPUT({ link: URL, body: data });
}

export function addStudent(id, emails, status = "pending") {
  const URL = `/courses/create/students?courseId=${id}`;
  return ApiPOST({ link: URL, body: { emails, status } });
}

export function delStudent(id, studentId) {
  const URL = `/courses/delete/student?courseId=${id}&studentId=${studentId}`;
  return ApiDELETE({ link: URL });
}

export function getFlashsets(id, { page, perPage }) {
  const URL = `/courses/${id}/list/flashsets?page=${page}&perPage=${perPage}`;
  return ApiGet({ link: URL });
}

export function addFlashsets(id, flashsetsIds) {
  const URL = `/courses/create/flashsets?courseId=${id}`;
  return ApiPOST({ link: URL, body: { flashsetsIds: flashsetsIds } });
}

export function createQuiz(id, flashsetId, types, number) {
  const URL = `/courses/create/quiz?courseId=${id}&flashsetId=${flashsetId}`;
  return ApiPOST({ link: URL, body: types });
}

export function delCourseFlashsets(id, flashsetId) {
  const URL = `/courses/delete/flashset?courseId=${id}&flashsetId=${flashsetId}`;
  return ApiDELETE({ link: URL });
}

export function createToken(id) {
  const URL = `/courses/token?courseId=${id}`;
  return ApiGet({ link: URL });
}

export function joinToken(token) {
  const URL = `/courses/submit/access_code?token=${token}`;
  return ApiPOST({ link: URL });
}
