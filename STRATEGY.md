# Rendering Strategies

- `/` : Static (SSG) — The home page content is static and does not depend on request-time data.
- `/menu` : ISR (Incremental Static Regeneration) — Uses periodic revalidation (`export const revalidate = 60`) so the menu stays fast while updating item data in the background.
- `/menu/[id]` : Static (SSG with `generateStaticParams`) — Pre-renders dish detail pages at build time for known dish IDs for fast loading.
- `/cart` : Static (SSG) — The cart page shell is pre-rendered statically while user cart items are updated on the client.
- `/checkout` : Dynamic (SSR) — Uses `export const dynamic = 'force-dynamic'` because reading request-time session/cookie data requires server rendering per request.
