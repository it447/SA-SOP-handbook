import { getSessionUserId, isAdminSessionValid } from "./sessionStore";
import { getUserById, type KbUser } from "./userStore";

export const SESSION_COOKIE = "session";
export const ADMIN_SESSION_COOKIE = "admin_session";

/**
 * Resolves a session cookie value to the logged-in user, or null.
 * Swallows malformed-token errors (e.g. a stale/garbage cookie value that
 * isn't a valid UUID) rather than throwing — treat those the same as "no
 * session" instead of 500ing the whole request.
 */
export async function getUserFromSessionToken(token: string | undefined): Promise<KbUser | null> {
  if (!token) return null;
  try {
    const userId = await getSessionUserId(token);
    if (!userId) return null;
    return await getUserById(userId);
  } catch {
    return null;
  }
}

export async function isValidAdminToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    return await isAdminSessionValid(token);
  } catch {
    return false;
  }
}
