export function getCookies() {
  const pairs = document.cookie.split(";");
  const cookies: Record<string, string> = {};
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split("=");
    cookies[(pair[0] + "").trim()] = unescape(pair.slice(1).join("="));
  }
  return cookies;
}

export function getCookie(cookie: string) {
  const pairs = document.cookie.split(";");
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].trim().split("=");
    if (pair[0] == cookie) {
      return pair[1];
    }
  }
  return null;
}

export function hasCookie(cookie: string) {
  const pairs = document.cookie.split(";");
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].trim().split("=");
    if (pair[0] == cookie) {
      return true;
    }
  }
  return false;
}
