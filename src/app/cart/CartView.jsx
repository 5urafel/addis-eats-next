"use client";

import Image from "next/image";
import Link from "next/link";
import DishCard from "@/app/menu/DishCard";
import { useCart } from "@/app/providers";
import {
  ShoppingBag,
  Heart,
  ArrowRight,
  Zap,
  Sparkles,
  X,
  Plus,
  Minus,
  Leaf,
  Banknote,
  Smartphone,
  CreditCard,
} from "lucide-react";

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

export default function CartView() {
  const {
    cart,
    isHydrated,
    itemsCount,
    subtotal,
    deliveryFee,
    tax,
    total,
    freeDeliveryThreshold,
    freeDeliveryProgress,
    amountForFreeDelivery,
    updateQuantity,
    removeFromCart,
    clearCart,
    addToCart,
  } = useCart();

  if (!isHydrated) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-3 border-amber-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-stone-500 text-sm font-medium">Loading your order bag...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Empty Bag Hero */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-12 text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#E05328] via-amber-500 to-[#F2D024]" />
          
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4 sm:mb-5 shadow-inner">
            <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-[#E05328]" />
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mb-2">
            Your Order Bag is Empty
          </h1>
          <p className="text-stone-500 text-xs sm:text-base max-w-md mx-auto leading-relaxed mb-6">
            You haven&apos;t added any authentic Ethiopian dishes to your bag yet. Taste the rich heritage of Addis Ababa today!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/menu"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#E05328] to-amber-600 hover:from-[#c8441c] hover:to-amber-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-orange-600/20 hover:scale-[1.02]"
            >
              <span>Explore Full Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/favorites"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs sm:text-sm rounded-xl border border-rose-200 transition-all shadow-2xs"
            >
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span>View Saved Favorites</span>
            </Link>
          </div>
        </div>

        {/* Quick Add Recommendations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              Popular Ethiopian Favorites
            </h2>
            <Link href="/menu" className="inline-flex items-center gap-1 text-xs font-bold text-[#E05328] hover:underline">
              <span>View Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularRecommendations.map((item) => (
              <DishCard key={item.id} dish={item} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Checkout Progress Stepper */}
      <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
        <span className="inline-flex items-center gap-1.5 text-[#E05328] bg-orange-50 font-bold px-2.5 py-0.5 rounded-full border border-orange-200/80">
          <ShoppingBag className="w-3.5 h-3.5 text-[#E05328]" />
          <span>1. Order Bag</span>
        </span>
        <ArrowRight className="w-3 h-3 text-stone-400" />
        <Link href="/checkout" className="hover:text-[#E05328] transition-colors text-stone-700">
          2. Checkout &amp; Delivery
        </Link>
        <ArrowRight className="w-3 h-3 text-stone-400" />
        <span className="text-stone-400">3. Confirmation</span>
      </div>

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-2xs">
              <ShoppingBag className="w-5 h-5 text-amber-800" />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Your Order Bag
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                Review your selections, adjust quantities, and proceed to checkout.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100/70 text-amber-900 border border-amber-200">
            {itemsCount} dish{itemsCount > 1 ? "es" : ""} in bag
          </span>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-semibold text-stone-400 hover:text-rose-600 px-3 py-1 rounded-lg transition-colors"
          >
            Clear Bag
          </button>
        </div>
      </div>

      {/* Free Delivery Tracker */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 shadow-2xs">
        <div className="flex items-center justify-between text-xs font-bold mb-2">
          <span className="text-amber-950 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-600 fill-amber-500 shrink-0" />
            {subtotal >= freeDeliveryThreshold ? (
              <span className="inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>You unlocked FREE Express Delivery in Addis Ababa!</span>
              </span>
            ) : (
              `Add $${amountForFreeDelivery.toFixed(2)} more to get FREE Express Delivery!`
            )}
          </span>
          <span className="text-amber-800">
            ${subtotal.toFixed(2)} / ${freeDeliveryThreshold.toFixed(2)}
          </span>
        </div>
        <div className="w-full h-2.5 bg-amber-200/70 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#E05328] to-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${freeDeliveryProgress}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Left Items List, Right Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-stone-200/90 rounded-3xl p-4 sm:p-6 shadow-sm divide-y divide-stone-100">
            {cart.map((item) => {
              const itemTotal = ((Number(item.price) || 0) * item.quantity).toFixed(2);
              return (
                <div
                  key={item.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Dish Info */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-18 h-18 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/60">
                      <Image
                        src={item.image || "/images/doro-wat.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="72px"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        {item.category || "Habesha Specials"}
                      </span>
                      <h3 className="font-extrabold text-stone-900 text-base mt-0.5">
                        {item.name}
                      </h3>
                      <div className="text-xs text-stone-400 font-medium mt-0.5">
                        ${Number(item.price).toFixed(2)} each
                      </div>
                    </div>
                  </div>

                  {/* Quantity Modifier & Total */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-stone-100">
                    <div className="flex items-center border border-stone-300 rounded-xl bg-white overflow-hidden shadow-2xs">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-100 font-bold text-sm transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center text-xs font-extrabold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-100 font-bold text-sm transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <span className="text-base font-extrabold text-[#E05328]">
                        ${itemTotal}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove item"
                      aria-label={`Remove ${item.name}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add more dishes button */}
          <div className="flex justify-between items-center px-2">
            <Link
              href="/menu"
              className="text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add more authentic dishes from menu</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout Card */}
        <div className="space-y-4">
          <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-7 shadow-lg space-y-6">
            <h2 className="text-lg font-extrabold text-stone-900 pb-3 border-b border-stone-100">
              Order Summary
            </h2>

            {/* Calculations breakdown */}
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal ({itemsCount} items)</span>
                <span className="font-bold text-stone-900">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-stone-600">
                <span className="flex items-center gap-1">
                  <span>Delivery Fee</span>
                  {deliveryFee === 0 && (
                    <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                      FREE
                    </span>
                  )}
                </span>
                <span className={`font-bold ${deliveryFee === 0 ? "text-emerald-700" : "text-stone-900"}`}>
                  {deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-stone-600">
                <span>Addis Culinary Tax (5%)</span>
                <span className="font-bold text-stone-900">${tax.toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                <span className="text-base font-extrabold text-stone-900">Total</span>
                <div className="text-right">
                  <span className="text-2xl font-black text-[#E05328]">
                    ${total.toFixed(2)}
                  </span>
                  <span className="block text-[10px] text-stone-400">All taxes included</span>
                </div>
              </div>
            </div>

            {/* Guarantee badge */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
              <div className="font-bold text-stone-800 flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span>Authentic Ethiopian Preparation</span>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Handcrafted highland spices, slow-simmered sauces, and hot fresh teff injera delivered sealed.
              </p>
            </div>

            {/* Checkout CTA */}
            <Link
              href="/checkout"
              className="w-full py-4 px-6 bg-gradient-to-r from-[#E05328] to-amber-600 hover:from-[#c8441c] hover:to-amber-700 text-white font-extrabold text-sm rounded-xl transition-all shadow-md shadow-orange-600/30 flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Payment support badges */}
            <div className="text-center pt-2">
              <span className="text-[11px] text-stone-400 block mb-1">
                Accepted Payment Methods on Delivery:
              </span>
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-stone-600">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 border border-stone-200">
                  <Banknote className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Cash</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                  <Smartphone className="w-3.5 h-3.5 text-amber-600" />
                  <span>Telebirr</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                  <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                  <span>CBE Birr</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
