import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const SCRYPT_PARAMS = { N: 2 ** 14, r: 8, p: 1 };
const KEY_LENGTH = 64;

let dummyHashPromise = null;

function deriveKey(password, salt, params) {
  return new Promise((resolve, reject) => {
    scrypt(password.normalize("NFC"), salt, KEY_LENGTH, params, (error, derivedKey) =>
      error ? reject(error) : resolve(derivedKey),
    );
  });
}

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const derived = await deriveKey(password, salt, SCRYPT_PARAMS);
  const { N, r, p } = SCRYPT_PARAMS;
  return ["scrypt", N, r, p, salt.toString("base64url"), derived.toString("base64url")].join("$");
}

function getDummyPasswordHash() {
  if (!dummyHashPromise) {
    dummyHashPromise = hashPassword(randomBytes(12).toString("base64url"));
  }
  return dummyHashPromise;
}

export async function verifyPassword(password, storedHash) {
  const targetHash = storedHash ?? (await getDummyPasswordHash());
  const [algorithm, N, r, p, salt, expected] = targetHash.split("$");
  if (algorithm !== "scrypt" || !expected) return false;
  const expectedBytes = Buffer.from(expected, "base64url");
  const derived = await deriveKey(password, Buffer.from(salt, "base64url"), {
    N: Number(N),
    r: Number(r),
    p: Number(p),
  });
  const matches =
    derived.length === expectedBytes.length && timingSafeEqual(derived, expectedBytes);
  return Boolean(storedHash) && matches;
}
