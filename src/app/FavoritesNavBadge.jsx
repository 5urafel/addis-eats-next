"use client";

import Link from "next/link";
import { useFavorites } from "@/app/providers";
import { Heart } from "lucide-react";

export default function FavoritesNavBadge({ onClick, className = "" }) {
  const { favoritesCount, isHydrated } = useFavorites();

  const count = isHydrated ? favoritesCount : 0;

  return (
    <Link
      href="/favorites"
      onClick={onClick}
      className={`relative group flex items-center gap-1.5 text-stone-700 hover:text-rose-600 hover:bg-rose-50/80 px-3 py-2 rounded-xl transition-all font-semibold text-xs sm:text-sm ${className}`}
      aria-label={`Favorites with ${count} items`}
    >
      <Heart className="w-4 h-4 text-stone-700 group-hover:text-rose-600 group-hover:fill-rose-600 transition-all group-hover:scale-110" />
      <span>Favorites</span>
      {count > 0 && (
        <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-extrabold text-white bg-gradient-to-r from-rose-500 to-red-600 rounded-full shadow-xs animate-heart-pop group-hover:scale-105 transition-transform">
          {count}
        </span>
      )}
    </Link>
  );
}
