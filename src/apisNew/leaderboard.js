import { ApiGet } from "@/apis/config/API";

export function getLeaderboard() {
  const URL = `/leaderboard/overview`;
  return ApiGet({ link: URL });
}

export function getMyScores(params) {
  const URL = `/leaderboard/me?page=${params.page}&perPage=${params.perPage}`;
  return ApiGet({ link: URL });
}
