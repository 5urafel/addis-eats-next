"use client";

import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import { useFavorites, useCart } from "@/app/providers";
import { Heart, ShoppingBag, Star, Clock, Flame, Eye } from "lucide-react";

export default function DishCard({ dish, priority = false }) {
  const { isFavorite, toggleFavorite, isHydrated: favHydrated } = useFavorites();
  const { addToCart } = useCart();

  const rawImageSrc =
    dish?.image ||
    (dish?.id === "special-tibs"
      ? "/images/special-tibs.jpg"
      : dish?.id === "beyaynetu"
      ? "/images/beyaynetu.jpg"
      : "/images/doro-wat.jpg");

  const imageSrc =
    rawImageSrc.startsWith("/") || rawImageSrc.startsWith("http")
      ? rawImageSrc
      : `/${rawImageSrc}`;

  const rating = dish?.id === "doro-wat" ? "5.0" : dish?.id === "beyaynetu" ? "4.9" : "4.8";
  const prepTime =
    dish?.category === "Fast Food"
      ? "5-10 min"
      : dish?.category === "Tibs"
      ? "15-20 min"
      : "20-25 min";

  const favorited = favHydrated && dish?.id ? isFavorite(dish.id) : false;

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dish) {
      toggleFavorite(dish);
    }
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dish) {
      addToCart(dish, 1);
    }
  };

  return (
    <article className="bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-stone-200/70 flex flex-col justify-between group h-full">
      <div>
        {/* Top Image Container with Badges */}
        <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-stone-100">
          <Image
            src={imageSrc}
            alt={dish?.name ? `${dish.name} - Authentic Ethiopian dish` : "Authentic Ethiopian dish"}
            width={400}
            height={300}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Top Action Icons: Interactive Favorites & Quick Bag */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-center pointer-events-none z-10">
            <button
              type="button"
              onClick={handleFavoriteClick}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm shadow-md pointer-events-auto transition-all active:scale-90 ${
                favorited
                  ? "bg-rose-500 text-white ring-2 ring-white/90 scale-105 animate-heart-pop"
                  : "bg-white/90 backdrop-blur-md text-stone-600 hover:text-rose-500 hover:bg-white hover:scale-110"
              }`}
              title={favorited ? `Remove ${dish?.name || "dish"} from favorites` : `Add ${dish?.name || "dish"} to favorites`}
              aria-label={favorited ? `Remove ${dish?.name || "dish"} from favorites` : `Add ${dish?.name || "dish"} to favorites`}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  favorited ? "fill-white text-white" : "text-stone-600 hover:text-rose-500"
                }`}
              />
            </button>

            <button
              type="button"
              onClick={handleQuickAdd}
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-stone-700 hover:text-[#E05328] hover:bg-white flex items-center justify-center text-xs shadow-md pointer-events-auto hover:scale-110 active:scale-90 transition-all"
              title={`Quick add ${dish?.name || "dish"} to order bag`}
              aria-label={`Quick add ${dish?.name || "dish"} to order bag`}
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Left SPECIAL Tag */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="bg-[#F2D024] text-stone-950 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-2xs">
              SPECIAL
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5">
          <div className="flex justify-between items-start mb-1.5 gap-2">
            <h3 className="text-sm sm:text-base font-extrabold text-stone-900 leading-snug group-hover:text-[#E05328] transition-colors">
              {dish?.name}
            </h3>
            <span className="text-xs font-bold text-amber-600 flex items-center gap-1 shrink-0 bg-amber-50/80 px-2 py-0.5 rounded-md border border-amber-200/50">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              <span>{rating}</span>
            </span>
          </div>

          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-3 font-normal">
            {dish?.description || "Authentic Ethiopian delicacy prepared fresh with traditional spices."}
          </p>

          {/* Prep time & spice meta row */}
          <div className="flex items-center gap-2.5 text-[11px] text-stone-400 font-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>{prepTime}</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-[#E05328] font-semibold">
              <Flame className="w-3.5 h-3.5 text-[#E05328]" />
              <span>{dish?.category === "Habesha Specials" ? "Spicy" : "Mild"}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 sm:p-5 pt-0 border-t border-stone-100/80 flex items-center justify-between gap-2">
        <div className="shrink-0">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block -mb-0.5">
            PRICE
          </span>
          <span className="text-sm sm:text-base font-extrabold text-[#E05328]">
            ${dish?.price ? Number(dish.price).toFixed(2) : "15.00"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            href={`/menu/${dish?.id || "doro-wat"}`}
            className="px-2.5 sm:px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] sm:text-xs font-semibold rounded-full border border-stone-200 transition-colors flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden xs:inline">Details</span>
          </Link>

          <AddToCartButton
            dish={dish}
            className="px-3 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-bold rounded-full shadow-xs hover:scale-[1.02]"
          />
        </div>
      </div>
    </article>
  );
}
