"use client";

import Link from "next/link";
import DishCard from "@/app/menu/DishCard";
import { useFavorites } from "@/app/providers";
import { Heart, ArrowRight, Plus } from "lucide-react";

const popularRecommendations = [
  {
    id: "doro-wat",
    name: "Doro Wat",
    price: 15.99,
    category: "Habesha Specials",
    image: "/images/doro-wat.jpg",
    description: "Slow-simmered chicken drumsticks in rich spicy berbere sauce with boiled egg.",
  },
  {
    id: "special-tibs",
    name: "Special Tibs",
    price: 18.50,
    category: "Tibs",
    image: "/images/special-tibs.jpg",
    description: "Sizzling prime beef cubes with rosemary, garlic, and jalapeños.",
  },
  {
    id: "beyaynetu",
    name: "Beyaynetu Platter",
    price: 14.00,
    category: "Habesha Specials",
    image: "/images/beyaynetu.jpg",
    description: "Vibrant vegan combination feast with lentils, yellow split peas, and collard greens.",
  },
];

export default function FavoritesView() {
  const { favorites, favoritesCount, isHydrated, clearFavorites } = useFavorites();

  if (!isHydrated) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-3 border-rose-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-stone-500 text-sm font-medium">Loading your favorite dishes...</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
        {/* Empty State Hero */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-8 sm:p-12 text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-500 via-amber-500 to-[#E05328]" />

          <div className="w-20 h-20 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <Heart className="w-10 h-10 text-rose-500 fill-rose-500" />
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mb-2">
            No Favorite Dishes Yet
          </h1>
          <p className="text-stone-500 text-xs sm:text-base max-w-md mx-auto leading-relaxed mb-6">
            Tap the heart icon (<Heart className="w-4 h-4 inline text-stone-400 -mt-0.5" />) on any dish across our menu to quickly bookmark your favorite Ethiopian specialties here.
          </p>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-rose-500 to-[#E05328] hover:from-rose-600 hover:to-[#c8441c] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-rose-500/20 hover:scale-[1.02]"
          >
            <span>Explore Menu &amp; Save Favorites</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Suggested Specialties to Bookmark */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/80 pb-3">
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                Popular Dishes to Try &amp; Save
              </h2>
              <p className="text-xs text-stone-500">
                Tap the heart on any card to bookmark it to your favorites.
              </p>
            </div>
            <Link
              href="/menu"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#E05328] hover:underline"
            >
              <span>View Full Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularRecommendations.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <span className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
            <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Your Favorite Dishes
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-black">
                {favoritesCount}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Your handpicked Ethiopian specialties ready for fast re-ordering.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl border border-stone-200/80 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add More Dishes</span>
          </Link>
          <button
            type="button"
            onClick={clearFavorites}
            className="px-3.5 py-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Grid of Favorited Dishes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>

      {/* Bottom Exploration Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h3 className="text-base font-extrabold text-stone-900">
            Discover more Ethiopian culinary gems
          </h3>
          <p className="text-xs text-stone-600 mt-0.5">
            Explore sizzling tibs, fasting-friendly vegan platters, and traditional drinks.
          </p>
        </div>
        <Link
          href="/menu"
          className="inline-flex items-center gap-1.5 px-6 py-3 bg-[#E05328] hover:bg-[#c8441c] text-white font-bold text-xs rounded-xl shadow-md transition-all hover:scale-[1.02] shrink-0"
        >
          <span>Browse Full Menu</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
