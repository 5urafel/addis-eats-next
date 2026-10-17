import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import DishDetailActions from "./DishDetailActions";
import { Star, Flame, Wheat, Clock, ChevronLeft, ArrowRight } from "lucide-react";

const knownDishes = ["doro-wat", "special-tibs", "beyaynetu"];

const dishMetadata = {
  "doro-wat": {
    name: "Doro Wat",
    amharic: "ዶሮ ወጥ",
    price: 15.99,
    category: "Habesha Specials",
    heat: "Spicy (Berbere)",
    serving: "Served with 2 boiled eggs & fresh teff injera",
    description: "The crown jewel of Ethiopian culinary tradition. Tender chicken drumsticks slow-simmered for hours in a rich, deeply fragrant sauce of caramelized red onions, garlic, ginger, and artisanal highland berbere spice, accompanied by hard-boiled eggs steeped in the rich gravy.",
    image: "/images/doro-wat.jpg",
  },
  "special-tibs": {
    name: "Special Sautéed Tibs",
    amharic: "ልዩ ጥብስ",
    price: 18.50,
    category: "Tibs",
    heat: "Medium / Sizzling",
    serving: "Sizzled with rosemary, garlic, and sliced jalapeño",
    description: "Prime beef cubes flash-sautéed at high heat with caramelized onions, minced garlic, fresh rosemary sprigs, and green chilies. Finished with a drizzle of spiced niter kibbeh butter for an intoxicating aroma.",
    image: "/images/special-tibs.jpg",
  },
  "beyaynetu": {
    name: "Beyaynetu Platter",
    amharic: "በያይነቱ",
    price: 14.00,
    category: "Habesha Specials",
    heat: "Mild to Spicy",
    serving: "100% Vegan & Fasting-friendly feast",
    description: "A colorful, vibrant rainbow combination platter of assorted traditional vegetarian stews arranged atop a wide teff injera: Misir Wat (spicy red lentils), Kik Alicha (yellow split peas), Gomen (collard greens), Atkilt (cabbage and carrots), and Shiro.",
    image: "/images/beyaynetu.jpg",
  },
};

export async function generateStaticParams() {
  return [
    { id: "doro-wat" },
    { id: "special-tibs" },
    { id: "beyaynetu" },
  ];
}

export default async function DishDetailPage({ params }) {
  const { id } = await params;

  if (id === "unknown" || !knownDishes.includes(id)) {
    notFound();
  }

  const details = dishMetadata[id] || {
    name: id.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    amharic: "",
    price: 15.00,
    category: "Special",
    heat: "Medium",
    serving: "Served with fresh injera",
    description: "Authentic Ethiopian delicacy prepared fresh with traditional herbs and highland spices.",
    image: "/images/doro-wat.jpg",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-stone-500">
        <Link href="/" className="hover:text-amber-700 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/menu" className="hover:text-amber-700 transition-colors">
          Menu
        </Link>
        <span>/</span>
        <span className="text-stone-900">{details.name}</span>
      </nav>

      {/* Main Presentation Card */}
      <div className="bg-white border border-stone-200/90 rounded-3xl overflow-hidden shadow-lg">
        {/* Large Hero Image */}
        <div className="relative w-full h-64 sm:h-80 md:h-[420px] bg-stone-100 overflow-hidden">
          <Image
            src={details.image}
            alt={`${details.name} - Authentic Ethiopian dish`}
            width={800}
            height={600}
            sizes="(max-width: 768px) 100vw, 800px"
            priority={true}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />

          {/* Floating Category Badge */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex gap-2">
            <span className="bg-stone-900/80 backdrop-blur-md text-white text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-full border border-white/10 shadow-sm">
              {details.category}
            </span>
            <span className="bg-amber-600/90 backdrop-blur-md text-white text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>4.9 (Highland Recipe)</span>
            </span>
          </div>

          {/* Bottom Title Bar Overlay */}
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 text-white">
            <div>
              <span className="text-amber-400 text-xs sm:text-sm font-semibold block mb-0.5 sm:mb-1">
                {details.amharic}
              </span>
              <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                {details.name}
              </h1>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xl sm:text-3xl font-extrabold text-amber-400">
                ${Number(details.price).toFixed(2)}
              </span>
              <span className="text-[11px] sm:text-xs text-stone-300 block">per serving</span>
            </div>
          </div>
        </div>

        {/* Dish Details Body */}
        <div className="p-4 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
              Culinary Story &amp; Preparation
            </h2>
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              {details.description}
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60">
              <span className="text-xs text-amber-800 font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Flame className="w-3.5 h-3.5 text-amber-700" />
                <span>Spice Profile</span>
              </span>
              <span className="text-sm font-bold text-stone-900">{details.heat}</span>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Wheat className="w-3.5 h-3.5 text-stone-500" />
                <span>Serving Style</span>
              </span>
              <span className="text-sm font-bold text-stone-900">With Warm Injera</span>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-stone-500" />
                <span>Preparation</span>
              </span>
              <span className="text-sm font-bold text-stone-900">Made Fresh Daily</span>
            </div>
          </div>

          {/* Interactive Add to Cart & Quantity Selector */}
          <DishDetailActions dish={{ id, ...details }} />

          {/* Navigation Links */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-stone-100 items-center justify-between">
            <Link
              href="/menu"
              className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl border border-stone-200 transition-colors flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Full Menu</span>
            </Link>

            {/* Verification Link */}
            <Link
              href="/menu/unknown"
              className="text-xs font-medium text-stone-400 hover:text-red-600 transition-colors"
            >
              Test notFound &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
