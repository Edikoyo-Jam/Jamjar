import { BASE_URL } from "./config";

export async function signup(username: string, password: string) {
  return fetch(`${BASE_URL}/signup`, {
      body: JSON.stringify({ username, password }),
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );
}

export async function login(username: string, password: string) {
  return fetch(`${BASE_URL}/login`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
}

export async function logout() {
  return fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include"
  });
}