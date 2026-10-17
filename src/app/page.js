import Link from "next/link";
import Image from "next/image";
import DishCard from "@/app/menu/DishCard";
import { Sparkles, Heart, ShoppingBag, Star, Flame, Wheat, Coffee, ArrowRight } from "lucide-react";

export default function HomePage() {
  const featuredDishes = [
    {
      id: "doro-wat",
      name: "Doro Wat",
      category: "Habesha Specials",
      description: "Authentic Ethiopian chicken stew cooked with berbere and seasoned boiled egg.",
      price: 15.99,
      image: "/images/doro-wat.jpg",
    },
    {
      id: "special-tibs",
      name: "Special Sautéed Tibs",
      category: "Tibs",
      description: "Sautéed beef cooked with onions, garlic, fresh rosemary, and green jalapeños.",
      price: 18.50,
      image: "/images/special-tibs.jpg",
    },
    {
      id: "beyaynetu",
      name: "Beyaynetu Platter",
      category: "Habesha Specials",
      description: "Vibrant combination platter of assorted vegetarian stews and lentils.",
      price: 14.00,
      image: "/images/beyaynetu.jpg",
    },
  ];

  return (
    <div className="space-y-16 animate-fade-in max-w-6xl mx-auto">
      {/* Modern Restaurant Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#F5EFE6] via-[#FAF7F2] to-[#F3EDE2] rounded-3xl border border-stone-200/80 p-5 sm:p-10 lg:p-12 shadow-sm">
        {/* Subtle Background Radial Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          {/* Left Side Banner Content */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 sm:px-4 py-1.5 rounded-full border border-stone-200/80 shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E05328] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-bold text-stone-800 tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Authentic Ethiopian Dining &amp; Express Delivery</span>
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.12]">
              Experience the True Flavors of{" "}
              <span className="text-[#E05328] underline decoration-amber-400/70 decoration-wavy decoration-2">
                Addis Ababa
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-stone-600 text-xs sm:text-base max-w-xl font-medium leading-relaxed">
              From slow-simmered Berbere Doro Wat to sizzling rosemary beef Tibs and pure Teff Injera — handcrafted with love and fresh highland spices.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
              <Link
                href="/menu"
                className="px-7 py-3.5 bg-[#E05328] hover:bg-[#c8441c] text-white text-xs sm:text-sm font-bold rounded-2xl transition-all shadow-lg shadow-orange-600/25 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <span>Explore Full Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/favorites"
                className="px-5 py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs sm:text-sm font-bold rounded-2xl border border-rose-200/90 transition-all shadow-2xs flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>Saved Favorites</span>
              </Link>
              <Link
                href="/cart"
                className="px-5 py-3.5 bg-white hover:bg-stone-100 text-stone-800 text-xs sm:text-sm font-bold rounded-2xl border border-stone-200/90 transition-all shadow-2xs flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-stone-700" />
                <span>Order Bag</span>
              </Link>
            </div>

            {/* Restaurant Stats Bar */}
            <div className="pt-5 sm:pt-6 border-t border-stone-200/80 grid grid-cols-3 gap-2 sm:gap-4">
              <div>
                <div className="text-lg sm:text-2xl font-black text-stone-900 flex items-center gap-1">
                  <span>4.9</span>
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                </div>
                <div className="text-[10px] sm:text-xs text-stone-500 font-medium">1,200+ Reviews</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-black text-stone-900">30 Min</div>
                <div className="text-[10px] sm:text-xs text-stone-500 font-medium">Express Delivery</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-black text-stone-900">100%</div>
                <div className="text-[10px] sm:text-xs text-stone-500 font-medium">Organic Teff</div>
              </div>
            </div>
          </div>

          {/* Right Side Visual Showcase */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white group">
              <div className="relative aspect-4/3 w-full overflow-hidden">
                <Image
                  src="/images/doro-wat.jpg"
                  alt="Authentic Ethiopian Doro Wat Feast"
                  width={600}
                  height={450}
                  priority
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>

            {/* Floating Badge 1 (Top Right) */}
            <div className="absolute top-2 sm:-top-3 right-2 sm:-right-3 bg-white/95 backdrop-blur-md px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl border border-stone-200/80 shadow-md flex items-center gap-2">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs sm:text-sm">
                <Flame className="w-4 h-4 text-amber-700" />
              </span>
              <div>
                <div className="text-[11px] sm:text-xs font-black text-stone-900">Sizzling Fresh</div>
                <div className="text-[9px] sm:text-[10px] text-stone-500 font-medium">Made to Order</div>
              </div>
            </div>

            {/* Floating Badge 2 (Bottom Left) */}
            <div className="absolute bottom-2 sm:-bottom-3 left-2 sm:-left-3 bg-stone-900/90 text-white backdrop-blur-md px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl border border-stone-800 shadow-md flex items-center gap-2">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-orange-500/20 text-[#E05328] flex items-center justify-center font-bold text-xs sm:text-sm">
                <Flame className="w-4 h-4 text-[#E05328]" />
              </span>
              <div>
                <div className="text-[11px] sm:text-xs font-black text-white">Authentic Spices</div>
                <div className="text-[9px] sm:text-[10px] text-stone-400 font-medium">Highland Berbere</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Dish Catalog Grid matching Menu Page Styling */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/80 pb-4">
          <div className="text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E05328]">
              Chef&apos;s Highlights
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Featured Specialties
            </h2>
          </div>
          <Link
            href="/menu"
            className="text-xs font-bold text-[#E05328] hover:underline flex items-center gap-1"
          >
            <span>View all menu items</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {featuredDishes.map((dish, index) => (
            <DishCard
              key={dish.id}
              dish={dish}
              priority={false}
            />
          ))}
        </div>
      </section>

      {/* Culinary Features Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div className="bg-white p-6 rounded-3xl border border-stone-200/70 shadow-xs hover:shadow-md transition-all flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-100 text-[#E05328] flex items-center justify-center shrink-0">
            <Wheat className="w-6 h-6 text-[#E05328]" />
          </div>
          <div>
            <h4 className="font-extrabold text-stone-900 text-sm mb-1">Traditional Teff Injera</h4>
            <p className="text-xs text-stone-500 leading-relaxed font-medium">
              Made from pure organic teff flour, fermented naturally for three days for a soft, airy texture.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200/70 shadow-xs hover:shadow-md transition-all flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-100 text-[#E05328] flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 text-[#E05328]" />
          </div>
          <div>
            <h4 className="font-extrabold text-stone-900 text-sm mb-1">Highland Berbere</h4>
            <p className="text-xs text-stone-500 leading-relaxed font-medium">
              Single-origin Berbere, Mitmita, and Korarima blended with artisanal Niter Kibbeh butter.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200/70 shadow-xs hover:shadow-md transition-all flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-100 text-[#E05328] flex items-center justify-center shrink-0">
            <Coffee className="w-6 h-6 text-[#E05328]" />
          </div>
          <div>
            <h4 className="font-extrabold text-stone-900 text-sm mb-1">Fresh Coffee &amp; Drinks</h4>
            <p className="text-xs text-stone-500 leading-relaxed font-medium">
              Freshly roasted Ethiopian Arabica coffee beans brewed traditionally in clay Jebena pots.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

