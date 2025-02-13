import { getCookie } from "@/helpers/cookie";
import { BASE_URL } from "./config";

export async function getSelf() {
  return fetch(`${BASE_URL}/self?username=${getCookie("user")}`, {
    headers: { authorization: `Bearer ${getCookie("token")}` },
    credentials: "include",
  });
}

export async function getUser(userSlug: string) {
  return fetch(`${BASE_URL}/user?targetUserSlug=${userSlug}`);
}

export async function searchUsers(query: string) {
  return fetch(`${BASE_URL}/user/search?q=${query}`, {
    headers: { authorization: `Bearer ${getCookie("token")}` },
    credentials: "include",
  });
}

export async function updateUser(
  userSlug: string,
  name: string,
  bio: string,
  profilePicture: string | null,
  bannerPicture: string | null
) {
  return fetch(`${BASE_URL}/user`, {
    body: JSON.stringify({
      slug: userSlug,
      name,
      bio,
      profilePicture: profilePicture,
      bannerPicture: bannerPicture,
    }),
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${getCookie("token")}`,
    },
  });
}
