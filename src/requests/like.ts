import { getCookie } from "@/helpers/cookie";
import { BASE_URL } from "./config";

export async function postLike(parentId: number, isComment: boolean) {
  return fetch(`${BASE_URL}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${getCookie("token")}`,
    },
    credentials: "include",
    body: JSON.stringify({
      username: getCookie("user"),
      postId: !isComment ? parentId : 0,
      commentId: isComment ? parentId : 0,
    }),
  });
}