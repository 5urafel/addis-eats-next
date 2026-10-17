import Link from "next/link";
import { redirect } from "next/navigation";
import CheckoutForm from "./CheckoutForm";
import { getSession } from "@/lib/session";
import { ShoppingBag, ArrowRight, ArrowLeft, CreditCard } from "lucide-react";

// Force the checkout route to render dynamically on every request.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout & Delivery | Addis Eats",
  description: "Securely complete your Ethiopian dining order with express delivery across Addis Ababa.",
};

export default async function CheckoutPage() {
  // Layer 2: Server Component session check
  const session = await getSession();

  if (!session) {
    redirect("/signin?next=/checkout");
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Checkout Progress Stepper */}
      <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
        <Link href="/cart" className="hover:text-[#E05328] transition-colors flex items-center gap-1.5 text-stone-700">
          <ShoppingBag className="w-3.5 h-3.5 text-stone-500" />
          <span>1. Order Bag</span>
        </Link>
        <ArrowRight className="w-3 h-3 text-stone-400" />
        <span className="text-[#E05328] bg-orange-50 font-bold px-2.5 py-0.5 rounded-full border border-orange-200/80">
          2. Checkout &amp; Delivery
        </span>
        <ArrowRight className="w-3 h-3 text-stone-400" />
        <span className="text-stone-400">3. Confirmation</span>
      </div>

      {/* Open Page Header Bar (No Card Wrapper) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-2xs">
            <CreditCard className="w-5 h-5 text-amber-800" />
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Checkout &amp; Delivery
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Fill in your delivery address and choose your payment method to complete your order.
            </p>
          </div>
        </div>

        <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl px-3.5 py-2 text-xs text-amber-900 self-start sm:self-auto shrink-0 shadow-2xs">
          Ordering as: <strong className="text-amber-950">{session.name}</strong>
        </div>
      </div>

      {/* Main Form & Synchronized Order Review */}
      <CheckoutForm session={session} />

      {/* Bottom Navigation Links */}
      <div className="flex gap-3 flex-wrap pt-4 border-t border-stone-200">
        <Link
          href="/cart"
          className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl border border-stone-200 transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cart</span>
        </Link>
        <Link
          href="/menu"
          className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl border border-stone-200 transition-colors"
        >
          Browse More Dishes
        </Link>
      </div>
    </div>
  );
}
