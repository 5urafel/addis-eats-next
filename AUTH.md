# AUTH.md — Authentication & Authorization Architecture

This document specifies the multi-layered security architecture, session handling, protected routes, and defense-in-depth proofs for **Addis Eats** (built on Next.js 16 App Router).

---

## 🔐 1. Session Cookie Specification

| Parameter | Configuration | Security Purpose |
| :--- | :--- | :--- |
| **Cookie Name** | `session` | Standard session cookie identifier. |
| **`httpOnly`** | `true` | Prevents client-side JavaScript (`document.cookie`) from accessing session tokens, eliminating XSS token theft. |
| **`secure`** | `process.env.NODE_ENV === "production"` | Enforces HTTPS-only transmission in production environments. |
| **`sameSite`** | `"lax"` | Mitigates Cross-Site Request Forgery (CSRF) while preserving top-level navigation convenience. |
| **`path`** | `"/"` | Ensures session cookie availability across all application paths. |
| **`maxAge`** | `604800` (7 days) | Defines standard expiration window for active sessions. |

### Session Helper Interface (`lib/session.js` & `src/lib/session.js`)
- **`getSession()`**: Asynchronously reads the `session` cookie via Next.js `cookies()` and parses the active session object `{ userId, email, name, role }`. Returns `null` if unauthenticated or invalid.
- **`createSession(user)`**: Encodes user metadata into JSON and sets the `httpOnly`, `secure`, `sameSite: "lax"` cookie.
- **`destroySession()`**: Deletes the `session` cookie to terminate active user sessions upon sign-out.
- **`sanitizeNextUrl(nextParam)`**: Validates and sanitizes destination parameters to prevent Open Redirect vulnerabilities.

---

## 🛡️ 2. Multi-Layer Defense-in-Depth Architecture

Addis Eats enforces security across **three distinct layers**:

```
[ Request ] 
   │
   ▼
┌────────────────────────────────────────────────────────┐
│ Layer 1: Middleware (`middleware.js`)                  │
│ • Narrow matcher (`/checkout`, `/orders`, `/kitchen`) │
│ • Unauthenticated request -> Redirect to `/signin`     │
│ • Preserves destination in `next` query parameter       │
└──────────────────────────┬─────────────────────────────┘
                           │ Passed
                           ▼
┌────────────────────────────────────────────────────────┐
│ Layer 2: Server Component / Page (`getSession()`)      │
│ • Executes on server before HTML rendering              │
│ • Verifies active session & server-side role check     │
│ • Enforces `/kitchen` staff role strictly on server    │
└──────────────────────────┬─────────────────────────────┘
                           │ Passed
                           ▼
┌────────────────────────────────────────────────────────┐
│ Layer 3: Server Action / Handler (`order.userId`)      │
│ • Validates record ownership on every read and write   │
│ • Rejects unauthorized mutations (`403 Forbidden`)     │
└────────────────────────────────────────────────────────┘
```

---

## 📋 3. Protected Route & Layer Proof Matrix

| Protected Route / Handler | Security Layer 1: Middleware | Security Layer 2: Server Component / Page | Security Layer 3: Server Action / Handler | What Each Layer Proves |
| :--- | :--- | :--- | :--- | :--- |
| **`/checkout`** | Rejects unauthenticated traffic; redirects to `/signin?next=/checkout` | `getSession()` verifies session on server before rendering checkout UI | `placeOrder` action attaches `session.userId` to new order records | **Layer 1** proves request carries session cookie.<br>**Layer 2** proves identity before page mount.<br>**Layer 3** proves order creation is bound to authenticated user. |
| **`/orders`** | Rejects unauthenticated traffic; redirects to `/signin?next=/orders` | `getSession()` fetches session; scopes order list to `order.userId === session.userId` | N/A (Server Component renders scoped view) | **Layer 1** proves user is authenticated.<br>**Layer 2** proves user cannot query or view other user accounts.<br>**Layer 3** (via `cancelOrder`) proves ownership on write. |
| **`/orders/[id]`** | Rejects unauthenticated traffic; redirects to `/signin?next=/orders/[id]` | `getSession()` reads session; checks `order.userId === session.userId` || `staff` | `cancelOrder` action verifies record owner before state mutation | **Layer 1** proves active cookie exists.<br>**Layer 2** proves user owns target order before sending tracker payload.<br>**Layer 3** prevents unauthorized order cancellation. |
| **`/kitchen`** | Rejects unauthenticated traffic & non-staff; redirects to `/signin` | `getSession()` verifies `session.role === "staff"` server-side before rendering markup | `updateOrderStatus` verifies `session.role === "staff"` before state change | **Layer 1** filters non-staff at network edge.<br>**Layer 2** proves staff authorization server-side (markup hidden from non-staff).<br>**Layer 3** proves staff role on status mutation. |
| **`POST /api/orders`** | N/A (Direct API call) | N/A (API Endpoint) | `getSession()` verifies session; attaches `session.userId` to order | Proves order creation cannot be forged with fake user ID. |
| **`GET /api/orders/[id]`** | N/A (Direct API call) | N/A (API Endpoint) | `getSession()` verifies session & checks `order.userId === session.userId` || `staff` | Proves API endpoints enforce record-level ownership checks (returns 403 Forbidden for other accounts). |

---

## 🌐 4. Open Redirect Protection (`sanitizeNextUrl`)

### Threat Model
Attacker crafts a link such as `/signin?next=https://attacker.com/phishing` or `/signin?next=//attacker.com`. If un-validated, successful sign-in would redirect the user to an external phishing site.

### Validation Rule & Implementation
`sanitizeNextUrl(nextParam)` enforces:
1. Must be a string starting with a single forward slash (`/`).
2. Must NOT start with protocol-relative slashes (`//`) or backslashes (`/\\`).
3. Must NOT contain domain schemes (`://` or `:\\`).
4. Rejects any invalid or suspicious string and defaults redirect to `/`.

### Test Cases & Verification Results

| Input `next` Parameter | `sanitizeNextUrl` Output | Security Result | Proof / Explanation |
| :--- | :--- | :--- | :--- |
| `/checkout` | `/checkout` | ✅ Allowed | Valid relative route path |
| `/orders/ord-101` | `/orders/ord-101` | ✅ Allowed | Valid nested relative route path |
| `/kitchen` | `/kitchen` | ✅ Allowed | Valid staff relative route path |
| `https://attacker-site.com` | `/` | 🛡️ Rejected & Reset | Rejects external domain scheme |
| `//attacker-site.com` | `/` | 🛡️ Rejected & Reset | Rejects protocol-relative open redirect |
| `/\\attacker-site.com` | `/` | 🛡️ Rejected & Reset | Rejects Windows backslash bypass attempt |
| `javascript:alert(1)` | `/` | 🛡️ Rejected & Reset | Rejects script URI scheme |

---

## 🧪 5. End-to-End Test Matrix & Verification Commands

### Test 1: Middleware Route Protection
- **Action**: Unauthenticated browser visits `/checkout` or `/orders`.
- **Expected Result**: Immediate HTTP 307 redirect to `/signin?next=%2Fcheckout` or `/signin?next=%2Forders`.

### Test 2: Account Ownership & Data Isolation
- **Action**: Sign in as Customer (`user-123`). Visit `/orders`.
- **Expected Result**: Displays orders for `user-123` (`ord-101`, `ord-102`). Order `ord-201` (belonging to `user-456`) is omitted.
- **Action**: Direct URL navigation to `/orders/ord-201` while logged in as `user-123`.
- **Expected Result**: Renders 403 Forbidden page ("You do not have permission to view order record ord-201").

### Test 3: Write Ownership Protection
- **Action**: Call `cancelOrder` server action targeting `ord-201` from `user-123` session.
- **Expected Result**: Server action returns `{ success: false, error: "Forbidden: You do not own this order record", status: 403 }`.

### Test 4: Server-Side Staff Role Enforcement
- **Action**: Sign in as Customer (`user-123`). Visit `/kitchen`.
- **Expected Result**: Redirected or shown 403 Forbidden ("The /kitchen dashboard is restricted exclusively to staff members"). Markup for kitchen dashboard is NOT rendered.
- **Action**: Sign in as Staff (`staff-999`). Visit `/kitchen`.
- **Expected Result**: Full access to Kitchen Management Dashboard, displaying all orders and status update controls.
