"use client";

import { useState, useEffect, Suspense } from "react";
import { useDishFilters } from "@/lib/useDishFilters";
import { Search, X } from "lucide-react";

function SearchBoxContent() {
  const { search, setFilter } = useDishFilters();
  const [searchTerm, setSearchTerm] = useState(search);

  // Sync local input state if URL search param changes from outside (e.g. active filter tag cleared)
  useEffect(() => {
    setSearchTerm(search);
  }, [search]);

  // Debounce input change to update URL search parameter
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== search) {
        setFilter("search", searchTerm);
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [searchTerm, search, setFilter]);

  const handleClear = () => {
    setSearchTerm("");
    setFilter("search", "");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setFilter("search", searchTerm);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-3">
      {/* Wide Rounded Capsule Search Bar */}
      <div className="relative bg-[#F3EDE2] border border-stone-200/90 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 flex items-center gap-3 shadow-inner transition-all focus-within:ring-2 focus-within:ring-[#E05328]/30 focus-within:border-[#E05328]/50">
        <Search className="w-4 h-4 text-stone-400 shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search by dish name, category, or description..."
          className="w-full bg-transparent text-xs sm:text-sm font-semibold text-stone-900 placeholder-stone-400 focus:outline-none"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[11px] sm:text-xs font-bold text-stone-500 hover:text-stone-900 bg-stone-300/60 hover:bg-stone-300 px-2.5 py-1 rounded-full transition-colors shrink-0 cursor-pointer flex items-center gap-1"
            title="Clear search"
          >
            <span>Clear</span>
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {search && (
        <div className="mt-2 text-center text-xs text-stone-500 flex items-center justify-center gap-1.5 animate-fade-in">
          <span>Filtering menu for:</span>
          <span className="font-extrabold text-stone-800">&ldquo;{search}&rdquo;</span>
          <button
            type="button"
            onClick={handleClear}
            className="text-[#E05328] hover:underline font-bold ml-1 text-[11px] cursor-pointer"
          >
            (reset search)
          </button>
        </div>
      )}
    </div>
  );
}

export default function SearchBox() {
  return (
    <Suspense fallback={<div className="h-12 w-full max-w-2xl mx-auto animate-pulse bg-stone-100 rounded-full my-3" />}>
      <SearchBoxContent />
    </Suspense>
  );
}
