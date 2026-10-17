import FilterShell from "./FilterShell";
import PagedDishList from "./PagedDishList";
import SearchBox from "./SearchBox";
import { dishes } from "@/app/api/dishes/route";
import { Search } from "lucide-react";

export const revalidate = 60;

export default async function MenuPage() {
  const initialDishes = dishes;

  return (
    <div className="space-y-8 animate-fade-in text-center max-w-5xl mx-auto">
      {/* Centered Header Matching Screenshot Design */}
      <div className="space-y-3 pt-2">
        <div className="w-10 h-10 rounded-full bg-orange-100 text-[#E05328] flex items-center justify-center text-lg mx-auto shadow-2xs">
          <Search className="w-5 h-5 text-[#E05328]" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
          Explore Our <span className="text-[#E05328]">Addis Menu</span>
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed font-medium">
          From authentic simmering Doro Wat and fresh Kitfo to wood-fired gourmet pizzas and refreshing mango spris.
        </p>
      </div>

      {/* Category Filter Shell wrapping Search & Paged Catalog */}
      <FilterShell>
        <SearchBox />
        <PagedDishList fallbackDishes={initialDishes} />
      </FilterShell>
    </div>
  );
}
