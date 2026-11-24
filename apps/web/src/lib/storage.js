function parseStoredValue(raw, fallback) {
  if (raw === null || raw === undefined) return fallback;
  if (typeof fallback === "string") return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function serializeValue(value) {
  return typeof value === "string" ? value : JSON.stringify(value);
}

export function readStorage(key, fallback = null) {
  try {
    return parseStoredValue(localStorage.getItem(key), fallback);
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, serializeValue(value));
    }
  } catch {
    return;
  }
}

export function removeStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    return;
  }
}

export function readSessionStorage(key, fallback = null) {
  try {
    return parseStoredValue(sessionStorage.getItem(key), fallback);
  } catch {
    return fallback;
  }
}

export function writeSessionStorage(key, value) {
  try {
    if (value === null || value === undefined) {
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, serializeValue(value));
    }
  } catch {
    return;
  }
}

export function removeSessionStorage(key) {
  try {
    sessionStorage.removeItem(key);
  } catch {
    return;
  }
}
