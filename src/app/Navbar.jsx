"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CartNavBadge from "./CartNavBadge";
import FavoritesNavBadge from "./FavoritesNavBadge";
import {
  UtensilsCrossed,
  Utensils,
  ChefHat,
  X,
  Menu,
  Home,
  Heart,
  ShoppingBag,
  Receipt,
  MapPin,
  Phone,
  ArrowRight,
} from "lucide-react";

export default function Navbar({ session, signOutAction }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="glass-nav border-b border-stone-200/80 sticky top-0 z-50 transition-all shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="group flex items-center gap-2 sm:gap-2.5 shrink-0"
        >
          <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#E05328] to-amber-600 flex items-center justify-center text-white shadow-sm shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-5 h-5" />
          </span>
          <div>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-stone-900 flex items-center gap-1">
              Addis <span className="text-[#E05328]">Eats</span>
            </span>
            <span className="block text-[9px] sm:text-[10px] tracking-wider uppercase text-amber-700/90 font-bold -mt-0.5 sm:-mt-1">
              Ethiopian Cuisine
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Visible on lg screens) */}
        <nav className="hidden lg:flex items-center gap-2 xl:gap-4">
          <ul className="flex items-center gap-1 text-xs xl:text-sm font-semibold">
            <li>
              <Link
                href="/"
                className={`px-3 py-2 rounded-xl transition-colors ${
                  pathname === "/"
                    ? "text-[#E05328] bg-amber-50 font-bold"
                    : "text-stone-700 hover:text-[#E05328] hover:bg-amber-50/80"
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/menu"
                className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                  pathname.startsWith("/menu")
                    ? "text-[#E05328] bg-amber-50 font-bold"
                    : "text-stone-700 hover:text-[#E05328] hover:bg-amber-50/80"
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Menu</span>
              </Link>
            </li>
            <li>
              <FavoritesNavBadge />
            </li>
            <li>
              <CartNavBadge />
            </li>
            {session && (
              <li>
                <Link
                  href="/orders"
                  className={`px-3 py-2 rounded-xl transition-colors ${
                    pathname.startsWith("/orders")
                      ? "text-[#E05328] bg-amber-50 font-bold"
                      : "text-stone-700 hover:text-[#E05328] hover:bg-amber-50/80"
                  }`}
                >
                  Orders
                </Link>
              </li>
            )}
            {session?.role === "staff" && (
              <li>
                <Link
                  href="/kitchen"
                  className={`px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold ${
                    pathname === "/kitchen"
                      ? "bg-amber-200 text-amber-950 border border-amber-400"
                      : "text-amber-900 bg-amber-100/80 border border-amber-300 hover:bg-amber-200/80"
                  }`}
                >
                  <ChefHat className="w-3.5 h-3.5" />
                  <span>Kitchen</span>
                </Link>
              </li>
            )}
          </ul>

          {/* Desktop User Section */}
          <div className="pl-3 xl:pl-4 border-l border-stone-200 flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                <div className="text-xs text-stone-600 text-right">
                  <div className="font-bold text-stone-900 leading-tight">{session.name}</div>
                  <div className="text-stone-400 capitalize text-[10px]">{session.role}</div>
                </div>

                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-stone-200/70 hover:bg-stone-300/80 text-stone-800 font-bold text-xs rounded-xl border border-stone-300/80 transition-colors shadow-2xs"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/signin"
                className="px-4 py-2 bg-[#E05328] hover:bg-[#c8441c] text-white font-bold text-xs rounded-xl transition-all shadow-sm shadow-orange-600/20 hover:scale-[1.02]"
              >
                Sign In
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile / Tablet Controls Bar (< lg) */}
        <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
          {/* Quick Favorites Badge Icon */}
          <FavoritesNavBadge className="!px-2.5 !py-1.5 text-xs" />

          {/* Quick Cart Badge Icon */}
          <CartNavBadge className="!px-2.5 !py-1.5 text-xs" />

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            className="w-10 h-10 rounded-xl bg-white/90 border border-stone-200/90 text-stone-800 flex items-center justify-center text-lg shadow-2xs hover:bg-stone-100 transition-colors active:scale-95"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown Sheet */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] sm:top-[73px] bottom-0 z-40 bg-stone-950/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#FAF7F2] border-b border-stone-200 shadow-xl max-h-[calc(100dvh-73px)] overflow-y-auto p-5 space-y-6 animate-fade-in">
            {/* Primary Nav Links */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 block px-3 mb-1">
                Navigation
              </span>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-2xl font-bold text-sm transition-colors ${
                      pathname === "/"
                        ? "bg-[#E05328] text-white shadow-md shadow-orange-600/20"
                        : "text-stone-800 hover:bg-amber-50"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Home className="w-4 h-4 text-amber-600" />
                      <span>Home</span>
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/menu"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-2xl font-bold text-sm transition-colors ${
                      pathname.startsWith("/menu")
                        ? "bg-[#E05328] text-white shadow-md shadow-orange-600/20"
                        : "text-stone-800 hover:bg-amber-50"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Utensils className="w-4 h-4 text-amber-600" />
                      <span>Full Menu</span>
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/favorites"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-2xl font-bold text-sm transition-colors ${
                      pathname === "/favorites"
                        ? "bg-[#E05328] text-white shadow-md shadow-orange-600/20"
                        : "text-stone-800 hover:bg-rose-50"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                      <span>My Favorites</span>
                    </span>
                    <span className="text-xs bg-rose-100 text-rose-800 font-extrabold px-2 py-0.5 rounded-full">
                      View
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-2xl font-bold text-sm transition-colors ${
                      pathname === "/cart"
                        ? "bg-[#E05328] text-white shadow-md shadow-orange-600/20"
                        : "text-stone-800 hover:bg-amber-50"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <ShoppingBag className="w-4 h-4 text-amber-700" />
                      <span>Order Bag</span>
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </li>
                {session && (
                  <li>
                    <Link
                      href="/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-3 rounded-2xl font-bold text-sm transition-colors ${
                        pathname.startsWith("/orders")
                          ? "bg-[#E05328] text-white shadow-md shadow-orange-600/20"
                          : "text-stone-800 hover:bg-amber-50"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Receipt className="w-4 h-4 text-stone-500" />
                        <span>My Orders</span>
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </li>
                )}
                {session?.role === "staff" && (
                  <li>
                    <Link
                      href="/kitchen"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 rounded-2xl font-bold text-sm bg-amber-100/80 text-amber-950 border border-amber-300"
                    >
                      <span className="flex items-center gap-2.5">
                        <ChefHat className="w-4 h-4 text-amber-800" />
                        <span>Kitchen Dashboard</span>
                      </span>
                      <span className="text-[10px] bg-amber-200 px-2 py-0.5 rounded-full font-extrabold">STAFF</span>
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Mobile User Section */}
            <div className="pt-4 border-t border-stone-200">
              {session ? (
                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-stone-900 text-sm">{session.name}</div>
                      <div className="text-xs text-stone-500 font-mono">{session.email}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase">
                      {session.role}
                    </span>
                  </div>

                  <form action={signOutAction}>
                    <button
                      type="submit"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl border border-stone-300/80 transition-colors"
                    >
                      Sign Out
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3.5 bg-gradient-to-r from-[#E05328] to-amber-600 text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-orange-600/20"
                  >
                    <span>Sign In to Your Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Restaurant Quick Info Note */}
            <div className="text-center text-xs text-stone-500 space-y-1 pt-2">
              <div className="flex items-center justify-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>Bole Road, Addis Ababa</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span>Call: +251 11 661 2345</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
