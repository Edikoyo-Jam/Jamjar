export function getCookies() {
  const pairs = document.cookie.split(";");
  const cookies: Record<string, string> = {};
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split("=");
    cookies[(pair[0] + "").trim()] = unescape(pair.slice(1).join("="));
  }
  return cookies;
}

export function hasCookie() {
  const pairs = document.cookie.split(";");
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split("=");
    if (pair[0] == "token") {
      return true;
    }
  }
  return false;
}
