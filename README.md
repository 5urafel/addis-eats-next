# Addis Eats — Next.js Migration & Capstone

Authentic Ethiopian restaurant application built on **Next.js App Router (Next.js 16)** with server components, server actions, Zod validation, and dynamic/static rendering strategies.

---

## 📁 Project Folder Structure

```
addis-eats/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── dishes/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.js
│   │   │   │   └── route.js
│   │   │   └── orders/
│   │   │       └── route.js
│   │   ├── cart/
│   │   │   └── page.js
│   │   ├── checkout/
│   │   │   ├── CheckoutForm.jsx
│   │   │   └── page.js
│   │   ├── menu/
│   │   │   ├── [id]/
│   │   │   │   └── page.js
│   │   │   ├── CategoryBar.jsx
│   │   │   ├── DishList.js
│   │   │   ├── FilterShell.jsx
│   │   │   ├── error.js
│   │   │   ├── layout.js
│   │   │   ├── loading.js
│   │   │   └── page.js
│   │   ├── actions.js
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.js
│   │   ├── not-found.js
│   │   ├── page.js
│   │   └── providers.jsx
│   └── lib/
│       └── schema.js
├── BOUNDARY.md
├── STRATEGY.md
├── README.md
└── package.json
```

---

## 🌐 API Endpoints & Status Codes

| Endpoint | Method | Request Payload | Success Code | Error Code | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/dishes` | `GET` | None | `200 OK` | `500 Internal Error` | Fetches list of all dishes |
| `/api/dishes/[id]` | `GET` | None | `200 OK` | `404 Not Found` | Fetches details for dish by ID |
| `/api/orders` | `POST` | `{ dishId, quantity, customerName, address, notes? }` | `201 Created` | `422 Unprocessable` / `400 Bad Request` | Validates with Zod schema and records order |

---

## ⚡ Production Build Output

```
> addis-eats@0.1.0 build
> next build

▲ Next.js 16.3.5 (Turbopack)
✓ Running next.config.mjs took 20ms

  Creating an optimized production build ...
✓ Compiled successfully in 661ms
  Running TypeScript ...
  Finished TypeScript in 3ms ...
  Collecting page data using 12 workers ...
  Generating static pages using 12 workers (0/11) ...
  Generating static pages using 12 workers (2/11) 
  Generating static pages using 12 workers (5/11) 
  Generating static pages using 12 workers (8/11) 
✓ Generating static pages using 12 workers (11/11) in 726ms
  Finalizing page optimization ...

Route (app)               Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ƒ /api/dishes
├ ƒ /api/dishes/[id]
├ ƒ /api/orders
├ ○ /cart
├ ƒ /checkout
├ ○ /menu                         1m      1y
└   /menu/[id]
  ├ ● /menu/doro-wat
  ├ ● /menu/special-tibs
  └ ● /menu/beyaynetu


○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

---

## 🛠️ Execution of the 6 Migration Steps

1. **Scaffold Next.js Project**: Configured app directory with standard dependencies (`next`, `react`, `react-dom`, `zod`).
2. **Recreate Route Map**: Structured route folders (`/`, `/menu`, `/menu/[id]`, `/cart`, `/checkout`, `/api/...`).
3. **Layout & Providers**: Placed `RootLayout` in `app/layout.js` (Server) and isolated React Context inside client provider (`app/providers.jsx`).
4. **Move Screens & Async RSC Migration**: Removed client-side `useFetch` hooks; converted pages (`/menu`, `/menu/[id]`) to async Server Components with server-side data fetching.
5. **Loading, Error & Not-Found Special Files**: Added `loading.js`, `error.js`, and `not-found.js` to segment roots.
6. **Strategy & Boundary Documentation**: Created `STRATEGY.md` and `BOUNDARY.md`, verified against `next build` and curl outputs.

---

## 🧪 Verification & Failure Checks

- **Curl Endpoint Proofs**: Verified 200 OK for GET endpoints, 201 Created for valid POST payloads, 404 Not Found for missing dishes, and 422 Unprocessable Entity for invalid Zod payloads.
- **Server Actions Verification**: `placeOrder` and `cancelOrder` server actions handle form state via `useActionState`, revalidate paths on completion, and enforce authorization checks.
- **JavaScript Disabled Test**: HTML outer shells and server components render initial UI content cleanly without JavaScript enabled in browser environments.
