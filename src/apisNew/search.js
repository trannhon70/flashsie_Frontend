import { ApiGet } from "@/apis/config/API";

export function search(searchText, perPage) {
  const URL = `/search/list?searchText=${searchText}&perPage=${perPage}`;
  return ApiGet({ link: URL });
}
