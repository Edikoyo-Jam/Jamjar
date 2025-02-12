import { getCookie } from "@/helpers/cookie";
import { BASE_URL } from "./config";

export async function assignMod(userSlug: string, mod: boolean) {
  return fetch(`${BASE_URL}/mod`, {
      body: JSON.stringify({
        targetname: userSlug,
        mod,
        username: getCookie("user"),
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${getCookie(
          "token"
        )}`,
      },
      credentials: "include",
    }
  );
}

export async function assignAdmin(userSlug: string, admin: boolean) {
  if (!admin) return assignMod(userSlug, true);

  return fetch(`${BASE_URL}/mod`, {
      body: JSON.stringify({
        targetname: userSlug,
        admin: true,
        username: getCookie("user"),
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${getCookie(
          "token"
        )}`,
      },
      credentials: "include",
    }
  );
}