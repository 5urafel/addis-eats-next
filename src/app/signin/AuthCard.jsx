"use client";

import { useState, useActionState, useEffect } from "react";
import Link from "next/link";
import { signInAction, signUpAction } from "@/app/actions";
import {
  getStoredUsers,
  findStoredUserByEmail,
  addStoredUser,
  verifyStoredCredentials,
  DEFAULT_USERS,
} from "@/lib/userStorage";
import {
  Mail,
  Lock,
  User,
  ChefHat,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  Check,
  ShieldCheck,
  UtensilsCrossed,
  Database,
  KeyRound,
  UserCheck,
} from "lucide-react";

export default function AuthCard({
  safeNext = "/",
  staffError = false,
  currentSession = null,
}) {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isStaffRole, setIsStaffRole] = useState(staffError);

  // Hidden payload for server synchronization
  const [clientUserPayload, setClientUserPayload] = useState("");
  const [newUserId, setNewUserId] = useState("");

  // Client-side validation errors & general card alerts
  const [clientErrors, setClientErrors] = useState({});
  const [cardAlert, setCardAlert] = useState(null);

  // Server action states
  const [signInState, signInFormAction, isSignInPending] = useActionState(
    signInAction,
    null,
  );
  const [signUpState, signUpFormAction, isSignUpPending] = useActionState(
    signUpAction,
    null,
  );

  const activeState = mode === "signin" ? signInState : signUpState;
  const isPending = mode === "signin" ? isSignInPending : isSignUpPending;

  // Initialize and seed localStorage on client mount
  useEffect(() => {
    getStoredUsers();
  }, []);

  // Quick Demo credentials helper
  const handleQuickFill = (roleType) => {
    setCardAlert(null);
    setClientErrors({});
    if (roleType === "customer") {
      setEmail("user@addiseats.com");
      setPassword("password123");
      setIsStaffRole(false);
      if (mode === "signup") {
        setName("Abebe Bikila");
        setConfirmPassword("password123");
      }
    } else if (roleType === "staff") {
      setEmail("staff@addiseats.com");
      setPassword("password123");
      setIsStaffRole(true);
      if (mode === "signup") {
        setName("Chef Worku");
        setConfirmPassword("password123");
      }
    }
  };

  // Sign In / Sign Up submission with localStorage checks & credential verification
  const handleSubmit = (e) => {
    setCardAlert(null);
    const errors = {};
    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 1. Basic field validity
    if (!normalizedEmail) {
      errors.email = "Email address is required";
    } else if (!emailRegex.test(normalizedEmail)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    // SIGN IN LOGIC:
    // User MUST be in localStorage, THEN his credentials MUST be checked!
    if (mode === "signin") {
      if (Object.keys(errors).length > 0) {
        e.preventDefault();
        setClientErrors(errors);
        return false;
      }

      // Step 1: Check if user exists in localStorage
      const userInStorage = findStoredUserByEmail(normalizedEmail);
      if (!userInStorage) {
        e.preventDefault();
        const msg =
          "No account found with this email in local storage. Please create an account first.";
        setClientErrors({
          email: "User does not exist in local storage",
        });
        setCardAlert({
          type: "error",
          title: "Account Not Found in LocalStorage",
          message: msg,
          suggestSignUp: true,
        });
        return false;
      }

      // Step 2: Credentials (password) must be checked against localStorage
      if (userInStorage.password !== password) {
        e.preventDefault();
        const msg =
          "Incorrect password. Please verify your credentials and try again.";
        setClientErrors({
          password: "Incorrect password for this account",
        });
        setCardAlert({
          type: "error",
          title: "Invalid Credentials",
          message: msg,
        });
        return false;
      }

      // Step 3: Credentials match! Prepare payload for server session sync
      setClientUserPayload(JSON.stringify(userInStorage));
      setClientErrors({});
      return true;
    }

    // SIGN UP LOGIC:
    // Create new account in localStorage and then create server session
    if (mode === "signup") {
      if (!name.trim()) {
        errors.name = "Full name is required";
      } else if (name.trim().length < 2) {
        errors.name = "Name must be at least 2 characters";
      }

      if (!confirmPassword) {
        errors.confirmPassword = "Confirm password is required";
      } else if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }

      if (Object.keys(errors).length > 0) {
        e.preventDefault();
        setClientErrors(errors);
        return false;
      }

      // Check if user already exists in localStorage
      const existingUser = findStoredUserByEmail(normalizedEmail);
      if (existingUser) {
        e.preventDefault();
        const msg =
          "An account with this email already exists in local storage. Please sign in instead.";
        setClientErrors({
          email: "Email already registered in local storage",
        });
        setCardAlert({
          type: "error",
          title: "Account Already Exists",
          message: msg,
          suggestSignIn: true,
        });
        return false;
      }

      // Generate new user ID and save to localStorage
      const generatedId = isStaffRole
        ? `staff-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
        : `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

      const newUserObj = {
        id: generatedId,
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: isStaffRole ? "staff" : "customer",
        createdAt: new Date().toISOString(),
      };

      addStoredUser(newUserObj);
      setNewUserId(generatedId);
      setClientErrors({});
      return true;
    }
  };

  // Helper to resolve field errors
  const getFieldError = (fieldName) => {
    if (clientErrors[fieldName]) return clientErrors[fieldName];
    if (activeState?.fieldErrors?.[fieldName]?.[0])
      return activeState.fieldErrors[fieldName][0];
    return null;
  };

  // Switch to sign up tab
  const switchToSignUp = () => {
    setMode("signup");
    setCardAlert(null);
    setClientErrors({});
  };

  // Switch to sign in tab
  const switchToSignIn = () => {
    setMode("signin");
    setCardAlert(null);
    setClientErrors({});
  };

  return (
    <div className="bg-white border border-stone-200/90 rounded-3xl shadow-xl overflow-hidden animate-fade-in">
      {/* Decorative Brand Accent Line */}
      <div className="h-2 bg-gradient-to-r from-[#E05328] via-amber-500 to-[#F2D024]" />

      <div className="p-6 sm:p-8 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center mx-auto text-[#E05328] shadow-inner">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {mode === "signin" ? "Welcome Back" : "Join Addis Eats"}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
            {mode === "signin"
              ? "Sign in with your verified local account to order dishes and track live deliveries."
              : "Create an account in local storage to order, save favorites, and manage your deliveries."}
          </p>
        </div>

        {/* Staff Authorization Notice (if redirected from /kitchen) */}
        {staffError && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900 text-xs">
            <ChefHat className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Staff Access Required</span>
              The Kitchen Dashboard requires a staff account. Sign in using your
              staff credentials or demo below.
            </div>
          </div>
        )}

        {/* LocalStorage & Credentials Alert Banner */}
        {cardAlert && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-xs sm:text-sm font-medium space-y-2 animate-fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-bold">{cardAlert.title}</span>
            </div>
            <p className="text-xs text-rose-700 pl-6">{cardAlert.message}</p>
            {cardAlert.suggestSignUp && (
              <div className="pl-6 pt-1">
                <button
                  type="button"
                  onClick={switchToSignUp}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E05328] hover:bg-[#c8441c] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  <span>Create Account Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            {cardAlert.suggestSignIn && (
              <div className="pl-6 pt-1">
                <button
                  type="button"
                  onClick={switchToSignIn}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E05328] hover:bg-[#c8441c] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  <span>Switch to Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Server Action Alert Message */}
        {activeState?.error && !cardAlert && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-rose-800 text-xs font-semibold animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{activeState.error}</span>
          </div>
        )}

        {/* Mode Switcher Tabs */}
        <div className="p-1 bg-stone-100 rounded-2xl grid grid-cols-2 text-xs font-bold">
          <button
            type="button"
            onClick={switchToSignIn}
            className={`py-2.5 rounded-xl transition-all cursor-pointer ${
              mode === "signin"
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={switchToSignUp}
            className={`py-2.5 rounded-xl transition-all cursor-pointer ${
              mode === "signup"
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Quick Demo Credentials Helper */}
        <div className="p-3 bg-stone-50 border border-stone-200/80 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500">
            <span className="flex items-center gap-1">
              <Database className="w-3 h-3 text-stone-400" />
              <span>LocalStorage Demo Accounts:</span>
            </span>
            <span className="text-[10px] text-stone-400">Click to fill</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill("customer")}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-xs font-medium text-stone-700 hover:border-amber-300 hover:bg-amber-50/50 transition-colors shadow-2xs cursor-pointer"
            >
              <User className="w-3 h-3 text-stone-500" />
              <span>Customer (Abebe)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("staff")}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-xs font-medium text-amber-800 hover:border-amber-300 hover:bg-amber-50 transition-colors shadow-2xs cursor-pointer"
            >
              <ChefHat className="w-3 h-3 text-amber-700" />
              <span>Kitchen Staff (Chef Worku)</span>
            </button>
          </div>
        </div>

        {/* Auth Form */}
        <form
          action={mode === "signin" ? signInFormAction : signUpFormAction}
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4"
        >
          <input type="hidden" name="next" value={safeNext} />
          <input
            type="hidden"
            name="role"
            value={isStaffRole ? "staff" : "customer"}
          />
          <input type="hidden" name="clientUser" value={clientUserPayload} />
          <input type="hidden" name="userId" value={newUserId} />

          {/* Full Name (Sign Up only) */}
          {mode === "signup" && (
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-bold text-stone-700 mb-1.5"
              >
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (clientErrors.name)
                      setClientErrors((prev) => ({ ...prev, name: null }));
                  }}
                  placeholder="e.g. Abebe Bikila"
                  className={`w-full pl-10 pr-4 py-3 bg-stone-50/50 border rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-[#E05328] focus:border-transparent transition-all ${
                    getFieldError("name")
                      ? "border-rose-400 ring-2 ring-rose-400/20 bg-rose-50/30"
                      : "border-stone-300"
                  }`}
                />
              </div>
              {getFieldError("name") && (
                <p className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1 animate-fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{getFieldError("name")}</span>
                </p>
              )}
            </div>
          )}

          {/* Email Address */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold text-stone-700 mb-1.5"
            >
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (clientErrors.email)
                    setClientErrors((prev) => ({ ...prev, email: null }));
                  if (cardAlert) setCardAlert(null);
                }}
                placeholder="name@example.com"
                className={`w-full pl-10 pr-4 py-3 bg-stone-50/50 border rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-[#E05328] focus:border-transparent transition-all ${
                  getFieldError("email")
                    ? "border-rose-400 ring-2 ring-rose-400/20 bg-rose-50/30"
                    : "border-stone-300"
                }`}
              />
            </div>
            {getFieldError("email") && (
              <p className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1 animate-fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{getFieldError("email")}</span>
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-bold text-stone-700"
              >
                Password <span className="text-rose-500">*</span>
              </label>
              {mode === "signin" && (
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      "Demo credentials default to 'password123'. New accounts use the password entered during registration in localStorage.",
                    )
                  }
                  className="text-[11px] text-[#E05328] hover:underline font-semibold cursor-pointer"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (clientErrors.password)
                    setClientErrors((prev) => ({ ...prev, password: null }));
                  if (cardAlert) setCardAlert(null);
                }}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-3 bg-stone-50/50 border rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-[#E05328] focus:border-transparent transition-all ${
                  getFieldError("password")
                    ? "border-rose-400 ring-2 ring-rose-400/20 bg-rose-50/30"
                    : "border-stone-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {getFieldError("password") && (
              <p className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1 animate-fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{getFieldError("password")}</span>
              </p>
            )}
          </div>

          {/* Confirm Password (Sign Up only) */}
          {mode === "signup" && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-bold text-stone-700 mb-1.5"
              >
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (clientErrors.confirmPassword)
                      setClientErrors((prev) => ({
                        ...prev,
                        confirmPassword: null,
                      }));
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-3 bg-stone-50/50 border rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-[#E05328] focus:border-transparent transition-all ${
                    getFieldError("confirmPassword")
                      ? "border-rose-400 ring-2 ring-rose-400/20 bg-rose-50/30"
                      : "border-stone-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                  title={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {getFieldError("confirmPassword") && (
                <p className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1 animate-fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{getFieldError("confirmPassword")}</span>
                </p>
              )}
            </div>
          )}

          {/* Optional Role Option Toggle */}
          <div className="pt-1 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-600 select-none">
              <input
                type="checkbox"
                checked={isStaffRole}
                onChange={(e) => setIsStaffRole(e.target.checked)}
                className="w-4 h-4 rounded text-[#E05328] focus:ring-[#E05328] border-stone-300"
              />
              <span className="flex items-center gap-1">
                <span>Kitchen Staff Account</span>
                <span className="text-[10px] text-stone-400">
                  (for order preparation)
                </span>
              </span>
            </label>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-[#E05328] to-amber-600 hover:from-[#c8441c] hover:to-amber-700 disabled:opacity-60 text-white font-extrabold text-sm rounded-xl transition-all shadow-md shadow-orange-600/25 flex items-center justify-center gap-2 hover:scale-[1.01] cursor-pointer"
          >
            {isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>
                  {mode === "signin"
                    ? "Verifying Credentials..."
                    : "Creating Account..."}
                </span>
              </>
            ) : mode === "signin" ? (
              <>
                <KeyRound className="w-4 h-4" />
                <span> Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span> Sign In</span>
                <Sparkles className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer switch prompt */}
        <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-500">
          {mode === "signin" ? (
            <p>
              Don&apos;t have an account in local storage?{" "}
              <button
                type="button"
                onClick={switchToSignUp}
                className="font-bold text-[#E05328] hover:underline cursor-pointer"
              >
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already registered in local storage?{" "}
              <button
                type="button"
                onClick={switchToSignIn}
                className="font-bold text-[#E05328] hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
