import { BASE_URL } from "./config";

export async function getTags() {
	return fetch(`${BASE_URL}/tags`);
}