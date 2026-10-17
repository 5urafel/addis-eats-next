import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "session";

/**
 * Retrieves the active user session from server cookies.
 * Compatible with Server Components, Server Actions, and Route Handlers.
 * @returns {Promise<{userId: string, email: string, name: string, role: string} | null>}
 */
export async function getSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      return null;
    }

    const sessionData = JSON.parse(sessionCookie);
    if (!sessionData || !sessionData.userId) {
      return null;
    }

    return sessionData;
  } catch (error) {
    return null;
  }
}

/**
 * Creates a session cookie with httpOnly, secure, and sameSite configuration options.
 * @param {{userId: string, email?: string, name?: string, role?: string}} user
 */
export async function createSession(user) {
  const cookieStore = await cookies();
  const sessionData = {
    userId: user.userId || user.id || "user-123",
    email: user.email || "user@addiseats.com",
    name: user.name || "Customer",
    role: user.role || "customer",
    createdAt: new Date().toISOString(),
  };

  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days expiration
  });

  return sessionData;
}

/**
 * Clears the session cookie to sign out the active user.
 */
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Sanitizes and validates a 'next' query string destination URL.
 * Strictly enforces that destination URLs must start with a single '/'
 * and rejects open redirects (e.g. starting with '//', '/\', 'http://', 'https://', 'javascript:').
 * 
 * @param {string | null | undefined} nextParam 
 * @returns {string} Safe relative path (defaults to '/' if invalid or untrusted)
 */
export function sanitizeNextUrl(nextParam) {
  if (!nextParam || typeof nextParam !== "string") {
    return "/";
  }

  const trimmed = nextParam.trim();

  // Reject empty string or values not starting with a slash
  if (!trimmed.startsWith("/")) {
    return "/";
  }

  // Reject protocol-relative URLs, windows path slashes, or embedded protocols
  if (
    trimmed.startsWith("//") ||
    trimmed.startsWith("/\\") ||
    trimmed.includes(":\\") ||
    trimmed.includes("://")
  ) {
    return "/";
  }

  return trimmed;
}
