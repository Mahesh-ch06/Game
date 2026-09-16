export function tokenKey(code: string) {
  return `oddoneout:token:${code.toUpperCase()}`;
}

export function saveToken(code: string, token: string) {
  try {
    localStorage.setItem(tokenKey(code), token);
    localStorage.setItem("oddoneout:lastCode", code.toUpperCase());
  } catch {
    /* storage unavailable */
  }
}

export function readToken(code: string) {
  try {
    return localStorage.getItem(tokenKey(code));
  } catch {
    return null;
  }
}

export function clearToken(code: string) {
  try {
    localStorage.removeItem(tokenKey(code));
  } catch {
    /* storage unavailable */
  }
}

export function readNickname() {
  try {
    return localStorage.getItem("oddoneout:nickname") ?? "";
  } catch {
    return "";
  }
}

export function saveNickname(nickname: string) {
  try {
    localStorage.setItem("oddoneout:nickname", nickname);
  } catch {
    /* storage unavailable */
  }
}
