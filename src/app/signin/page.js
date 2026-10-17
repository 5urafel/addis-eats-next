import Link from "next/link";
import { getSession, sanitizeNextUrl } from "@/lib/session";
import { signOutAction } from "@/app/actions";
import AuthCard from "./AuthCard";
import { User, ChefHat, ArrowRight, LogOut, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Sign In & Create Account — Addis Eats",
  description: "Sign in or register your account to order authentic Ethiopian dishes.",
};

export default async function SignInPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const rawNext = resolvedParams?.next || "";
  const error = resolvedParams?.error || "";

  const safeNext = sanitizeNextUrl(rawNext);
  const staffError = error === "staff_only";

  const session = await getSession();

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12 px-4 animate-fade-in">
      {/* If already signed in, show a friendly status and option to proceed or switch */}
      {session && !staffError ? (
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto shadow-inner">
            {session.role === "staff" ? (
              <ChefHat className="w-8 h-8 text-amber-700" />
            ) : (
              <User className="w-8 h-8 text-[#E05328]" />
            )}
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Active Session
            </span>
            <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
              Signed in as {session.name}
            </h1>
            <p className="text-xs text-stone-500 font-mono">{session.email}</p>
          </div>

          <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-600 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Role: <strong className="capitalize">{session.role}</strong></span>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href={safeNext !== "/" ? safeNext : session.role === "staff" ? "/kitchen" : "/menu"}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-[#E05328] to-amber-600 hover:from-[#c8441c] hover:to-amber-700 text-white font-extrabold text-sm rounded-xl transition-all shadow-md shadow-orange-600/25 flex items-center justify-center gap-2"
            >
              <span>Continue to {safeNext !== "/" ? "Destination" : session.role === "staff" ? "Kitchen Dashboard" : "Menu"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <form action={signOutAction}>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl border border-stone-300/80 transition-colors inline-flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5 text-stone-500" />
                <span>Sign Out &amp; Switch Account</span>
              </button>
            </form>
          </div>
        </div>
      ) : (
        <AuthCard
          safeNext={safeNext}
          staffError={staffError}
          currentSession={session}
        />
      )}
    </div>
  );
}
