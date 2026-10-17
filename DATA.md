# DATA.md — Query Keys, Refresh Rules & SWR Strategy in Addis Eats

This document documents and justifies every SWR query key, refresh rule, and data fetching strategy used across the Addis Eats Next.js App Router application.

---

## 🛠️ Shared Data Fetching Architecture

All client-side SWR data queries in Addis Eats rely on a centralized, shared fetcher located in `lib/fetcher.js` (and `src/lib/fetcher.js`).

### Shared Fetcher Implementation (`lib/fetcher.js`)
```javascript
const fetcher = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    try {
      error.info = await res.json();
    } catch {
      error.info = null;
    }
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export default fetcher;
export { fetcher };
```

---

## 📋 Comprehensive Query Specification

### 1. Polling Order Status Query

- **Location**: `app/orders/[id]/page.js` & `src/app/orders/[id]/OrderTracker.jsx`
- **Query Key**: `/api/orders/${id}` (e.g. `/api/orders/ord-123`)
- **Refresh Rule**: `refreshInterval: 5000` (polls every 5 seconds), `revalidateOnFocus: true`
- **Configuration Options**: `fallbackData: initialOrder` (passed from Server Component)

#### Technical Justification & Behavior
- **Server Component Seeding**: The server page `app/orders/[id]/page.js` fetches the initial order payload on the server during request time and passes it to the client `OrderTracker` component as `fallbackData`.
- **First Paint Performance**: Because `fallbackData` is provided to `useSWR`, `data` is initialized immediately on first render. No loading spinner or empty layout shift occurs on initial paint.
- **Polling Requirement**: Order status transitions dynamically through lifecycle stages (`placed` → `preparing` → `on_the_way` → `delivered`). A 5-second polling interval ensures high data freshness for active orders while avoiding excessive server traffic.

---

### 2. Debounced Menu Search Query

- **Location**: `app/menu/SearchBox.jsx` & `src/app/menu/SearchBox.jsx`
- **Query Key**: `debouncedTerm.trim() !== "" ? \`/api/dishes?search=\${encodeURIComponent(debouncedTerm.trim())}\` : null`
- **Refresh Rule**: On-demand, triggered 300ms after user pauses typing
- **Configuration Options**: `keepPreviousData: true`

#### Technical Justification & Behavior
- **Conditional Null Key (`null`)**: When the search input field is empty or contains whitespace only, the query key evaluates to `null`. SWR automatically skips execution for `null` keys. This prevents unnecessary HTTP network requests for empty search strings and saves server resources.
- **300ms Debouncing**: Input state updates immediately for responsive typing, but search query execution is delayed by 300ms. This prevents network request floods on every individual keystroke and eliminates race conditions from out-of-order response resolutions.
- **`keepPreviousData: true`**: When the debounced query changes as the user types, SWR retains and displays the previous search results until the new request completes. This prevents UI flashing, layout pops, or temporary blank states during active searching.

---

### 3. Paged Dish Catalog Query

- **Location**: `src/app/menu/PagedDishList.jsx` & `src/app/menu/page.js`
- **Query Key**: `/api/dishes?page=${page}&limit=${limit}` (e.g. `/api/dishes?page=1&limit=3`)
- **Refresh Rule**: Revalidated whenever the `page` query string parameter changes in the URL
- **Configuration Options**: `keepPreviousData: true`, `fallbackData` (for Page 1)

#### Technical Justification & Behavior
- **Query String Pagination**: Storing the page number in the URL search parameters (`/menu?page=2`) ensures that paginated states are shareable, bookmarkable, and compatible with browser forward/back history.
- **`keepPreviousData: true`**: When the user navigates between pages (e.g., Page 1 → Page 2), `keepPreviousData: true` keeps Page 1 dishes visible on screen until Page 2 payload arrives over the network. This eliminates screen flashing and provides smooth pagination UX.

---

## 📊 Summary Matrix

| Query Purpose | Query Key Pattern | Refresh Rule / Interval | SWR Options Used | Rationale Summary |
| :--- | :--- | :--- | :--- | :--- |
| **Order Status Polling** | `/api/orders/${id}` | `refreshInterval: 5000` | `fallbackData`, `revalidateOnFocus: true` | Real-time status updates; seeded by server fallbackData to eliminate initial spinner. |
| **Debounced Menu Search** | `/api/dishes?search=${query}` or `null` | On-demand (300ms debounce) | `keepPreviousData: true`, `null` key when empty | Null key avoids empty requests; debouncing prevents race conditions; keepPreviousData stops flashing. |
| **Paged Dish List** | `/api/dishes?page=${page}&limit=${limit}` | URL query param navigation | `keepPreviousData: true`, `fallbackData` | Page numbers in URL searchParams; keepPreviousData enables smooth page transitions without flashing. |
