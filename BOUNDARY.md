# Server and Client Component Boundaries in Addis Eats

## Overview
This document defines the architecture and component boundaries for Addis Eats in Next.js App Router. Each component is deliberately placed on either the **Server** or **Client** side to optimize bundle size, data fetching performance, and user interactivity.

---

## Component Boundaries

| Component | File Path | Side | Rationale & Responsibility |
| :--- | :--- | :--- | :--- |
| **RootLayout** | `src/app/layout.js` | **Server** | Renders static HTML outer structure (`<html>`, `<body>`, `<header>`, `<footer>`). Keeps the page shell server-rendered. |
| **Providers** | `src/app/providers.jsx` | **Client (`"use client"`)** | Wraps `{children}` with `CartProvider` using React Context (`createContext`, `useState`). Isolated into its own file to prevent `RootLayout` from becoming a client component. |
| **HomePage** | `src/app/page.js` | **Server** | Static home page presentation. No client state or event handlers required. |
| **MenuLayout** | `src/app/menu/layout.js` | **Server** | Route layout shell for `/menu`. Pure server wrapper passing `{children}`. |
| **MenuPage** | `src/app/menu/page.js` | **Server (async)** | Async Server Component that fetches/awaits dishes directly on the server (`getDishes`). Contains no client hooks (`useFetch`, `useState`), no client loading/error state logic. Passes `<DishList>` to `<FilterShell>` via `children`. |
| **DishList** | `src/app/menu/DishList.js` | **Server** | Renders dish cards and static details. Pure server component that receives `dishes` as props and is rendered on the server into HTML/RSC payload. |
| **FilterShell** | `src/app/menu/FilterShell.jsx` | **Client (`"use client"`)** | Interactive shell component managing category filtering state (`useState`). Accepts `children` (`DishList`) to avoid importing Server Components into Client Components. |
| **CategoryBar** | `src/app/menu/CategoryBar.jsx` | **Client (`"use client"`)** | Interactive leaf component rendering selectable category buttons with client-side `onClick` click handlers. |
| **MenuLoading** | `src/app/menu/loading.js` | **Server** | Next.js fallback boundary displayed during server streaming / Suspense. |
| **MenuError** | `src/app/menu/error.js` | **Client (`"use client"`)** | Next.js error boundary component requiring `"use client"` per Next.js requirements. |
| **DishDetailPage** | `src/app/menu/[id]/page.js` | **Server (async)** | Static/ISR page rendering specific dish details based on route parameters. |
| **CartPage** | `src/app/cart/page.js` | **Server** | Cart page shell pre-rendered statically on the server. |
| **CartView** | `src/app/cart/CartView.jsx` | **Client (`"use client"`)** | Interactive cart bag interface managing item quantities, free delivery progress, and order summaries. |
| **CartNavBadge** | `src/app/CartNavBadge.jsx` | **Client (`"use client"`)** | Dynamic navigation leaf rendering real-time item count badge in the header. |
| **AddToCartButton** | `src/app/menu/AddToCartButton.jsx` | **Client (`"use client"`)** | Interactive leaf button on dish cards dispatching items to cart state with instant feedback. |
| **DishDetailActions** | `src/app/menu/[id]/DishDetailActions.jsx` | **Client (`"use client"`)** | Interactive quantity picker and order bag action on dish detail pages. |
| **CheckoutPage** | `src/app/checkout/page.js` | **Server (dynamic)** | Dynamic server-rendered page (`force-dynamic`) for request-time checkout handling. |
| **CheckoutForm** | `src/app/checkout/CheckoutForm.jsx` | **Client (`"use client"`)** | Form component using `useActionState` to handle multi-item cart orders, payment selection, and server actions. |

---

## First Load JS Performance Record

### /menu Route Metrics

| State | Route Size | First Load JS | Notes |
| :--- | :--- | :--- | :--- |
| **Before Optimization** | **242 B** | **108 kB** | Client-side hooks (`useFetch`), state management, and component trees included in route JS. |
| **After Optimization** | **174 B** | **108 kB** | Menu page converted to async RSC; `"use client"` pushed to smallest leaves (`CategoryBar`, `FilterShell`, `Providers`); `DishList` passed as children. |

### Technical Explanation of the Difference
1. **Async Server Component Data Fetching**: Moving data fetching from client-side hooks (`useFetch`, `useState`, `useEffect`) directly into the async `MenuPage` server component removed client-side data management boilerplate and state handling code from the client bundle.
2. **Leaf-Level `"use client"` Placement**: Restricting `"use client"` exclusively to interactive leaves (`CategoryBar`, `FilterShell`, `Providers`) ensured that large presentation components like `DishList` remain on the server and are not compiled into client JS bundles.
3. **Server-Component-via-Children Composition**: Passing `<DishList />` as `children` to `<FilterShell>` allows `DishShell` to remain a Server Component without importing it into a Client Component. This preserves the server boundary while providing full client-side category filtering interactivity.
