"use client";

import { useDishFilters } from "@/lib/useDishFilters";
import { Suspense } from "react";
import { UtensilsCrossed, Flame, Beef, Sandwich, Coffee } from "lucide-react";

function CategoryBarContent({ activeCategory: propCategory, onSelectCategory: propOnSelect }) {
  const { category: filterCategory, setFilter } = useDishFilters();

  const activeCategory = propCategory !== undefined ? propCategory : filterCategory;
  const onSelect = propOnSelect !== undefined ? propOnSelect : (id) => setFilter("category", id);

  const categories = [
    { id: "All", name: "All Menu", icon: UtensilsCrossed, count: 12 },
    { id: "Habesha Specials", name: "Traditional", icon: Flame, count: 5 },
    { id: "Tibs", name: "Sautéed Tibs", icon: Beef, count: 3 },
    { id: "Fast Food", name: "Fast Food", icon: Sandwich, count: 2 },
    { id: "Drinks", name: "Beverages", icon: Coffee, count: 2 },
  ];

  return (
    <div className="w-full max-w-full flex items-center justify-start sm:justify-center gap-2 sm:gap-2.5 py-1 overflow-x-auto no-scrollbar px-1">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id || (activeCategory === "All" && cat.id === "All");
        const IconComponent = cat.icon;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 sm:gap-2 shrink-0 active:scale-95 cursor-pointer ${
              isActive
                ? "bg-stone-900 text-white shadow-md shadow-stone-900/20 scale-102 ring-2 ring-stone-900/10"
                : "bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-900 border border-stone-200/90 shadow-2xs"
            }`}
          >
            <IconComponent
              className={`w-4 h-4 shrink-0 transition-colors ${
                isActive ? "text-[#E05328]" : "text-stone-500"
              }`}
            />
            <span>{cat.name}</span>
            <span
              className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full transition-colors ${
                isActive
                  ? "bg-[#E05328] text-white"
                  : "bg-stone-100 text-stone-500 group-hover:bg-stone-200"
              }`}
            >
              {cat.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function CategoryBar(props) {
  return (
    <Suspense fallback={<div className="h-10 w-full animate-pulse bg-stone-100 rounded-full" />}>
      <CategoryBarContent {...props} />
    </Suspense>
  );
}
