"use client";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import DishCard from "./DishCard";
import { UtensilsCrossed, ChevronLeft, ChevronRight } from "lucide-react";

function PagedDishListContent({ fallbackDishes = [] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const category = searchParams.get("category") || "All";
  const search = searchParams.get("search") || "";
  const limit = 3;

  // Build query key with page, limit, and active category/search filter
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (category && category !== "All") {
    params.set("category", category);
  }
  if (search && search.trim() !== "") {
    params.set("search", search.trim());
  }
  const queryKey = `/api/dishes?${params.toString()}`;

  // Filter fallback dishes to match current category/search on initial render
  const filteredFallback = fallbackDishes.filter((dish) => {
    if (category && category !== "All" && dish.category !== category) {
      return false;
    }
    if (search && search.trim() !== "") {
      const q = search.trim().toLowerCase();
      const match =
        dish.name.toLowerCase().includes(q) ||
        dish.description.toLowerCase().includes(q) ||
        dish.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const fallbackTotalPages = Math.max(1, Math.ceil(filteredFallback.length / limit));

  // keepPreviousData: true prevents UI flashing when changing pages or filters
  const { data, isValidating } = useSWR(queryKey, fetcher, {
    keepPreviousData: true,
    fallbackData:
      page === 1
        ? {
            dishes: filteredFallback.slice(0, limit),
            total: filteredFallback.length,
            page: 1,
            totalPages: fallbackTotalPages,
          }
        : undefined,
  });

  const dishes = data?.dishes || (Array.isArray(data) ? data : filteredFallback.slice((page - 1) * limit, page * limit));
  const totalPages = Math.max(1, data?.totalPages || fallbackTotalPages);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const nextParams = new URLSearchParams(searchParams.toString());
      if (newPage <= 1) {
        nextParams.delete("page");
      } else {
        nextParams.set("page", String(newPage));
      }
      const qs = nextParams.toString();
      router.push(`/menu${qs ? `?${qs}` : ""}`, { scroll: false });
    }
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-2 px-1">
        <div className="text-left">
          <h2 className="text-lg font-extrabold text-stone-900 tracking-tight">
            Menu Catalog
            {category && category !== "All" && (
              <span className="text-stone-500 font-semibold text-sm ml-2">
                &bull; {category}
              </span>
            )}
          </h2>
          <span className="text-xs text-stone-500 font-medium">
            Page {page} of {totalPages}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isValidating && (
            <span className="text-xs text-[#E05328] animate-pulse font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E05328] animate-ping" />
              Updating...
            </span>
          )}
        </div>
      </div>

      {dishes.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-3xl border border-stone-200/80 p-8 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-400">
            <UtensilsCrossed className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h3 className="font-bold text-stone-800 text-sm">
            No dishes found {category !== "All" ? `in "${category}"` : ""}
          </h3>
          <p className="text-stone-500 text-xs mt-1">
            Try selecting a different category or clearing your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {dishes.map((dish, index) => (
            <DishCard
              key={dish.id}
              dish={dish}
              priority={page === 1 && index === 0}
            />
          ))}
        </div>
      )}

      {/* Pagination Navigation Controls */}
      {totalPages > 1 && (
        <div className="mt-8 sm:mt-10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 border-t border-stone-200/80 pt-5 sm:pt-6">
          <button
            type="button"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="px-3.5 sm:px-5 py-2 text-[11px] sm:text-xs font-bold text-stone-700 bg-white border border-stone-200 rounded-full hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xs flex items-center gap-1.5"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePageChange(p)}
                className={`w-8 h-8 sm:w-9 sm:h-9 text-[11px] sm:text-xs font-bold rounded-full transition-all ${
                  p === page
                    ? "bg-[#E05328] text-white shadow-md shadow-orange-600/30 scale-105"
                    : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-100"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-3.5 sm:px-5 py-2 text-[11px] sm:text-xs font-bold text-stone-700 bg-white border border-stone-200 rounded-full hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xs flex items-center gap-1.5"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function PagedDishList({ fallbackDishes = [] }) {
  return (
    <Suspense
      fallback={<div className="text-xs text-stone-500 py-6 text-center">Loading menu catalog...</div>}
    >
      <PagedDishListContent fallbackDishes={fallbackDishes} />
    </Suspense>
  );
}
