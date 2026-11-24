import { createHash, randomBytes } from "node:crypto";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { throwError } from "../errors.js";
import {
  createSession,
  deleteFailedLogins,
  deleteSession,
  findRecentFailedLogins,
  findUserBySession,
  insertFailedLogin,
  renewSession,
} from "../repositories/userRepository.js";

export const SESSION_COOKIE = "panal_sesion";

const DAY_MS = 24 * 60 * 60 * 1000;
export const SESSION_DURATION_MS = 30 * DAY_MS;
const RENEW_THRESHOLD_MS = SESSION_DURATION_MS - DAY_MS;

export const MAX_FAILED_ATTEMPTS = 5;
export const FAILED_ATTEMPTS_WINDOW_MS = 10 * 60 * 1000;

export function hashSessionToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

function setSessionCookie(c, token) {
  setCookie(c, SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "Lax",
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function openSession(c, db, userId, now) {
  const token = randomBytes(32).toString("base64url");
  await createSession(db, {
    idHash: hashSessionToken(token),
    userId,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + SESSION_DURATION_MS).toISOString(),
  });
  setSessionCookie(c, token);
}

export async function closeSession(c, db) {
  const token = getCookie(c, SESSION_COOKIE);
  if (token) await deleteSession(db, hashSessionToken(token));
  deleteCookie(c, SESSION_COOKIE, {
    path: "/",
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export function loadSessionMiddleware({ db, clock }) {
  return async (c, next) => {
    const token = getCookie(c, SESSION_COOKIE);
    let user = null;
    if (token && token.length <= 128) {
      const now = clock();
      const idHash = hashSessionToken(token);
      const found = await findUserBySession(db, idHash, new Date(now).toISOString());
      if (found) {
        const { sessionExpiresAt, ...userData } = found;
        user = userData;
        if (Date.parse(sessionExpiresAt) - now < RENEW_THRESHOLD_MS) {
          await renewSession(db, idHash, new Date(now + SESSION_DURATION_MS).toISOString());
          setSessionCookie(c, token);
        }
      }
    }
    c.set("user", user);
    await next();
  };
}

export async function requireAuth(c, next) {
  if (!c.get("user")) throwError("unauthorized");
  await next();
}

export function getCurrentUser(c) {
  return c.get("user");
}

export async function checkLoginAttempts(db, email, now) {
  const attempts = await findRecentFailedLogins(
    db,
    email,
    new Date(now - FAILED_ATTEMPTS_WINDOW_MS).toISOString(),
    MAX_FAILED_ATTEMPTS,
  );
  if (attempts.length < MAX_FAILED_ATTEMPTS) return;
  const oldestMs = Date.parse(attempts[attempts.length - 1]);
  const retryAfter = Math.max(1, Math.ceil((oldestMs + FAILED_ATTEMPTS_WINDOW_MS - now) / 1000));
  throwError("too_many_attempts", { retryAfter });
}

export async function recordFailedLogin(db, email, now) {
  await insertFailedLogin(
    db,
    email,
    new Date(now).toISOString(),
    new Date(now - FAILED_ATTEMPTS_WINDOW_MS).toISOString(),
  );
}

export async function clearFailedLogins(db, email) {
  await deleteFailedLogins(db, email);
}
