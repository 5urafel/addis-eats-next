"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart, useFavorites } from "@/app/providers";
import { Check, ShoppingBag, Heart, ArrowRight } from "lucide-react";

export default function DishDetailActions({ dish }) {
  const { addToCart, cart } = useCart();
  const { isFavorite, toggleFavorite, isHydrated: favHydrated } = useFavorites();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const unitPrice = Number(dish?.price) || 15.0;
  const totalPrice = (unitPrice * quantity).toFixed(2);

  const existingInCart = cart.find((item) => item.id === dish.id);
  const favorited = favHydrated && dish?.id ? isFavorite(dish.id) : false;

  const handleAddToCart = () => {
    addToCart(
      {
        id: dish.id,
        name: dish.name,
        price: unitPrice,
        image: dish.image,
        category: dish.category,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 2500);
  };

  const handleFavoriteClick = () => {
    toggleFavorite({
      id: dish.id,
      name: dish.name,
      price: unitPrice,
      image: dish.image,
      category: dish.category,
      description: dish.description,
    });
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60">
        {/* Quantity selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
            Select Quantity:
          </span>
          <div className="flex items-center border border-stone-300 rounded-xl bg-white overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-base transition-colors"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-12 text-center text-sm font-extrabold text-stone-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(20, q + 1))}
              className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-100 font-bold text-base transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* Dynamic Total Preview */}
        <div className="text-left sm:text-right">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            Subtotal for {quantity} serving{quantity > 1 ? "s" : ""}
          </span>
          <span className="text-xl font-extrabold text-[#E05328]">
            ${totalPrice}
          </span>
        </div>
      </div>

      {/* Action Buttons Row with Responsive Stacking & Favorites */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`flex-1 py-3.5 px-5 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 ${
            added
              ? "bg-emerald-600 text-white shadow-emerald-600/30 scale-[1.01]"
              : "bg-gradient-to-r from-[#E05328] to-amber-600 hover:from-[#c8441c] hover:to-amber-700 text-white shadow-orange-600/20 hover:scale-[1.01]"
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Added to Order Bag!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add {quantity}x to Bag · ${totalPrice}</span>
            </>
          )}
        </button>

        {/* Favorite Toggle Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className={`py-3.5 px-4 rounded-xl border text-xs sm:text-sm font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 active:scale-95 ${
            favorited
              ? "bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100"
              : "bg-white text-stone-700 border-stone-300 hover:text-rose-600 hover:border-rose-300 hover:bg-stone-50"
          }`}
          title={favorited ? "Remove from favorites" : "Save to favorites"}
        >
          <Heart className={`w-4 h-4 transition-colors ${favorited ? "fill-rose-600 text-rose-600" : "text-stone-500"}`} />
          <span>{favorited ? "Favorited" : "Favorite"}</span>
        </button>

        <Link
          href="/cart"
          className="py-3.5 px-5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm hover:scale-[1.01] flex items-center justify-center gap-1.5 shrink-0"
        >
          <span>View Cart</span>
          {existingInCart && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-stone-950 font-black text-[10px]">
              {existingInCart.quantity} in bag
            </span>
          )}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
