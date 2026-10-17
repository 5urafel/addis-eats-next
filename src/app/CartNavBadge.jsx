"use client";

import Link from "next/link";
import { useCart } from "@/app/providers";
import { ShoppingBag } from "lucide-react";

export default function CartNavBadge({ onClick, className = "" }) {
  const { itemsCount, isHydrated, subtotal } = useCart();

  const count = isHydrated ? itemsCount : 0;

  return (
    <Link
      href="/cart"
      onClick={onClick}
      className={`relative group flex items-center gap-1.5 text-stone-700 hover:text-[#E05328] hover:bg-amber-50/80 px-3.5 py-2 rounded-xl transition-all font-semibold text-xs sm:text-sm ${className}`}
      aria-label={`Shopping Cart with ${count} items`}
    >
      <ShoppingBag className="w-4 h-4 text-stone-700 group-hover:text-[#E05328] group-hover:scale-110 transition-transform" />
      <span>Cart</span>
      {count > 0 && (
        <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-extrabold text-white bg-gradient-to-r from-[#E05328] to-amber-600 rounded-full shadow-xs animate-fade-in group-hover:scale-105 transition-transform">
          {count}
        </span>
      )}
    </Link>
  );
}
