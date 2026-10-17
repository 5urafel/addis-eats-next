import Link from "next/link";
import Script from "next/script";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "./Navbar";
import { getSession } from "@/lib/session";
import { signOutAction } from "@/app/actions";
import { Sparkles, UtensilsCrossed, MapPin, Phone, Heart, Leaf } from "lucide-react";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata = {
  title: "Addis Eats | Authentic Ethiopian Dining & Delivery",
  description: "Experience the vibrant, rich culinary heritage of Ethiopia. Handcrafted stews, sizzling tibs, and fresh injera delivered fast.",
};

export default async function RootLayout({ children }) {
  const session = await getSession();

  return (
    <html lang="en" className={`${outfit.variable} ${plusJakartaSans.variable}`}>
      <body className={`${plusJakartaSans.className} bg-[#FAF7F2] text-stone-900 min-h-screen flex flex-col font-sans selection:bg-[#E05328] selection:text-white antialiased overflow-x-hidden`}>
        {/* Third-party analytics script loaded lazily to preserve INP and prevent main thread blocking */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || "G-DEMO123456"}`}
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || "G-DEMO123456"}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        <Providers>
          {/* Top Announcement Bar */}
          <div className="bg-gradient-to-r from-[#E05328] via-amber-600 to-orange-700 text-white text-[11px] sm:text-xs font-medium py-1.5 px-3 sm:px-4 text-center tracking-wide shadow-2xs">
            <span className="truncate flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-200 shrink-0" />
              <span>Dine-in, Takeaway &amp; Express Delivery across Addis Ababa · Call: +251 11 661 2345</span>
            </span>
          </div>

          {/* Responsive Sticky Header with Desktop & Mobile Navigation */}
          <Navbar session={session} signOutAction={signOutAction} />

          {/* Main Content Viewport */}
          <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-6 py-6 sm:py-8">
            {children}
          </main>

          {/* Rich Restaurant Footer */}
          <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                {/* Column 1: Brand Info */}
                <div className="sm:col-span-2">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 rounded-lg bg-[#E05328] flex items-center justify-center text-white font-bold">
                      <UtensilsCrossed className="w-4 h-4" />
                    </span>
                    <span className="text-xl font-extrabold text-white tracking-tight">
                      Addis <span className="text-[#E05328]">Eats</span>
                    </span>
                  </div>
                  <p className="text-sm text-stone-400 max-w-sm mb-4 leading-relaxed font-normal">
                    Celebrating the authentic taste of Ethiopia with slow-cooked stews, fresh injera, and premium highland spices. Serving warmth, flavor, and hospitality every single day.
                  </p>
                  <div className="text-xs text-stone-400 flex flex-col gap-1.5">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>Bole Road, Near Medhanialem Mall, Addis Ababa</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>Reservations: +251 11 661 2345 · Daily 11:00 AM – 10:30 PM</span>
                    </span>
                  </div>
                </div>

                {/* Column 2: Navigation Links */}
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                    Explore
                  </h4>
                  <ul className="space-y-2 text-sm text-stone-400 font-medium">
                    <li>
                      <Link href="/menu" className="hover:text-amber-400 transition-colors">
                        Full Menu &amp; Specials
                      </Link>
                    </li>
                    <li>
                      <Link href="/favorites" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-rose-400" />
                        <span>Saved Favorites</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/cart" className="hover:text-amber-400 transition-colors">
                        Order Bag &amp; Checkout
                      </Link>
                    </li>
                    <li>
                      <Link href="/orders" className="hover:text-amber-400 transition-colors">
                        Order Tracking
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 3: Ethiopian Specialties */}
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                    Specialties
                  </h4>
                  <ul className="space-y-2 text-sm text-stone-400 font-medium">
                    <li>
                      <Link href="/menu/doro-wat" className="hover:text-amber-400 transition-colors">
                        Doro Wat (Special)
                      </Link>
                    </li>
                    <li>
                      <Link href="/menu/special-tibs" className="hover:text-amber-400 transition-colors">
                        Sizzling Beef Tibs
                      </Link>
                    </li>
                    <li>
                      <Link href="/menu/beyaynetu" className="hover:text-amber-400 transition-colors">
                        Beyaynetu Platter
                      </Link>
                    </li>
                    <li>
                      <span className="text-stone-400 text-xs font-semibold flex items-center gap-1.5 pt-1">
                        <Leaf className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Vegan &amp; Fasting Friendly Available</span>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-8 border-t border-stone-800 text-xs text-stone-400 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p>© 2026 ADDIS EATS. Authentic Ethiopian Dining. All rights reserved.</p>
                <div className="flex gap-4">
                  <span className="text-amber-400 font-semibold">Built with Next.js 16 App Router</span>
                </div>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
