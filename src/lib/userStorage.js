/**
 * LocalStorage User Store Utility for Addis Eats.
 * Handles client-side user persistence, lookup, and credential validation.
 */

export const USERS_STORAGE_KEY = "addis_eats_users";
export const ACTIVE_USER_STORAGE_KEY = "addis_eats_active_user";

export const DEFAULT_USERS = [
  {
    id: "user-123",
    name: "Abebe Bikila",
    email: "user@addiseats.com",
    password: "password123",
    role: "customer",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "user-456",
    name: "Tigist Alemu",
    email: "user-456@addiseats.com",
    password: "password123",
    role: "customer",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "staff-999",
    name: "Chef Worku (Kitchen Staff)",
    email: "staff@addiseats.com",
    password: "password123",
    role: "staff",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

/**
 * Retrieves all registered users from localStorage.
 * Seeds with default demo users if storage is empty or uninitialized.
 * @returns {Array<{id: string, name: string, email: string, password: string, role: string, createdAt: string}>}
 */
export function getStoredUsers() {
  if (typeof window === "undefined") {
    return DEFAULT_USERS;
  }

  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      // Seed default demo accounts into localStorage
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }

    return parsed;
  } catch (error) {
    console.warn("Failed to read users from localStorage", error);
    return DEFAULT_USERS;
  }
}

/**
 * Searches for a user in localStorage by email address (case-insensitive).
 * @param {string} email
 * @returns {Object|null}
 */
export function findStoredUserByEmail(email) {
  if (!email || typeof email !== "string") return null;
  const users = getStoredUsers();
  const normalized = email.trim().toLowerCase();
  return users.find((u) => u.email && u.email.toLowerCase() === normalized) || null;
}

/**
 * Adds a newly registered user to localStorage.
 * @param {{id: string, name: string, email: string, password: string, role: string}} newUser
 * @returns {boolean} true if saved, false if already exists
 */
export function addStoredUser(newUser) {
  if (typeof window === "undefined") return false;

  try {
    const users = getStoredUsers();
    const normalized = (newUser.email || "").trim().toLowerCase();

    // Prevent duplicate emails
    if (users.some((u) => u.email && u.email.toLowerCase() === normalized)) {
      return false;
    }

    const updated = [
      ...users,
      {
        ...newUser,
        email: normalized,
        createdAt: newUser.createdAt || new Date().toISOString(),
      },
    ];

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error("Failed to add user to localStorage", error);
    return false;
  }
}

/**
 * Validates sign-in credentials against localStorage:
 * 1. Verifies that the user exists in localStorage.
 * 2. If user exists, checks that the provided password matches.
 * 
 * @param {string} email
 * @param {string} password
 * @returns {{success: boolean, user?: Object, errorType?: 'NOT_FOUND'|'INVALID_PASSWORD'|'EMPTY_FIELDS', message: string}}
 */
export function verifyStoredCredentials(email, password) {
  const normalizedEmail = (email || "").trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return {
      success: false,
      errorType: "EMPTY_FIELDS",
      message: "Both email and password are required.",
    };
  }

  // 1. Check if user is in localStorage
  const user = findStoredUserByEmail(normalizedEmail);
  if (!user) {
    return {
      success: false,
      errorType: "NOT_FOUND",
      message: "No account found with this email in local storage. Please create an account first.",
    };
  }

  // 2. Check credentials (password)
  if (user.password !== password) {
    return {
      success: false,
      errorType: "INVALID_PASSWORD",
      message: "Incorrect password. Please verify your credentials and try again.",
    };
  }

  // Set as current active user in localStorage
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(user));
    }
  } catch (e) {
    // Ignore active user storage failures
  }

  return {
    success: true,
    user,
    message: "Credentials verified successfully.",
  };
}

/**
 * Removes active user reference from localStorage on logout.
 */
export function clearActiveStoredUser() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
  } catch (e) {
    // Ignore
  }
}
