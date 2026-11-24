import { randomUUID } from "node:crypto";
import { getLogicalDay } from "@panal/motor";
import { hashPassword, verifyPassword } from "../auth/password.js";
import { checkLoginAttempts, clearFailedLogins, recordFailedLogin } from "../auth/session.js";
import { isUniqueViolation } from "../db/client.js";
import { throwError } from "../errors.js";
import { createUser, findUserByEmail } from "../repositories/userRepository.js";
import { syncSettingsHistory, toIso } from "./profileService.js";

export async function registerUser(db, { name, email, password, timeZone }, now) {
  const passwordHash = await hashPassword(password);
  try {
    return await db.transaction(async (tx) => {
      const user = await createUser(tx, {
        id: randomUUID(),
        name,
        email,
        passwordHash,
        createdAt: toIso(now),
        timeZone,
      });
      await syncSettingsHistory(tx, user, getLogicalDay(now, user.timeZone));
      return user;
    });
  } catch (error) {
    if (isUniqueViolation(error, "personas_correo_key")) {
      throwError("email_taken");
    }
    throw error;
  }
}

export async function authenticateUser(db, { email, password }, now) {
  await checkLoginAttempts(db, email, now);
  const user = await findUserByEmail(db, email);
  const isValid = await verifyPassword(password, user?.passwordHash);
  if (!user || !isValid) {
    await recordFailedLogin(db, email, now);
    throwError("invalid_credentials");
  }
  await clearFailedLogins(db, email);
  return user;
}
