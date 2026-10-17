"use client";

import { useState } from "react";
import { useCart } from "@/app/providers";
import { Check, Plus } from "lucide-react";

export default function AddToCartButton({ dish, className = "", children }) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image,
      category: dish.category,
    }, 1);

    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1400);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={`relative overflow-hidden transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 ${
        justAdded
          ? "bg-emerald-600 text-white shadow-emerald-600/30"
          : "bg-[#E05328] hover:bg-[#c8441c] text-white shadow-orange-600/20"
      } ${className}`}
      title={`Add ${dish?.name || "dish"} to your cart`}
    >
      {justAdded ? (
        <>
          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Added!</span>
        </>
      ) : (
        children || (
          <>
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add to Cart</span>
          </>
        )
      )}
    </button>
  );
}
