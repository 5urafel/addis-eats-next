"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

export function useDishFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const category = searchParams.get("category") || "All";
  const dietary = searchParams.get("dietary") || "all";
  const sort = searchParams.get("sort") || "default";
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const setFilter = useCallback(
    (key, value) => {
      const params = new URLSearchParams(searchParams.toString());
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        value === "All" ||
        value === "all" ||
        value === "default"
      ) {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      // Reset page to 1 when changing any filter
      if (key !== "page") {
        params.delete("page");
      }

      const queryString = params.toString();
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
    },
    [searchParams, router, pathname]
  );

  const setPage = useCallback(
    (newPage) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newPage <= 1) {
        params.delete("page");
      } else {
        params.set("page", String(newPage));
      }
      const queryString = params.toString();
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
    },
    [searchParams, router, pathname]
  );

  const resetAll = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const hasActiveFilters =
    category !== "All" ||
    dietary !== "all" ||
    sort !== "default" ||
    search.trim() !== "";

  return {
    category,
    dietary,
    sort,
    search,
    page,
    setFilter,
    setPage,
    resetAll,
    hasActiveFilters,
  };
}
