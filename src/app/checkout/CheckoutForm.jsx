"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { placeOrder, cancelOrder } from "@/app/actions";
import { useCart } from "@/app/providers";
import DishCard from "@/app/menu/DishCard";
import {
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Heart,
  AlertCircle,
  MapPin,
  CreditCard,
  Banknote,
  Smartphone,
  Building2,
  ArrowRight,
  Zap,
  Plus,
  Minus,
  X,
  Phone,
  User,
  Check,
} from "lucide-react";

const initialState = {
  success: false,
  message: "",
  fieldErrors: {},
  data: {},
};

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

export default function CheckoutForm({ session }) {
  const [state, formAction, isPending] = useActionState(placeOrder, initialState);
  const [cancelState, cancelFormAction, isCancelPending] = useActionState(cancelOrder, null);
  const {
    cart,
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
    isHydrated,
  } = useCart();

  // Controlled form state for real-time validation and clean UX
  const [customerName, setCustomerName] = useState(session?.name || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  // Track field validation errors & user interactions
  const [clientErrors, setClientErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Sync state data on re-render if server returned initial values
  useEffect(() => {
    if (state?.data) {
      if (state.data.customerName && !customerName) setCustomerName(state.data.customerName);
      if (state.data.phone && !phone) setPhone(state.data.phone);
      if (state.data.address && !address) setAddress(state.data.address);
      if (state.data.notes && !notes) setNotes(state.data.notes);
      if (state.data.paymentMethod && !paymentMethod) setPaymentMethod(state.data.paymentMethod);
    }
  }, [state?.data]);

  // Clear cart upon successful order placement
  useEffect(() => {
    if (state?.success && state?.order) {
      clearCart();
    }
  }, [state?.success, state?.order, clearCart]);

  // Validate fields client-side
  const validateForm = () => {
    const errors = {};

    const trimmedName = customerName.trim();
    if (!trimmedName) {
      errors.customerName = "Full name is required for order delivery";
    } else if (trimmedName.length < 2) {
      errors.customerName = "Full name must be at least 2 characters";
    }

    const trimmedPhone = phone.trim();
    // Validate Ethiopian format (09..., 07..., +251 9..., +251 7...) or 9-16 digit phone
    const ethPhoneRegex = /^(\+?251|0)?[79]\d{8}$|^[\d\s+\-()]{9,18}$/;
    const digitCount = trimmedPhone.replace(/\D/g, "").length;
    if (!trimmedPhone) {
      errors.phone = "Phone number is required so our rider can reach you";
    } else if (!ethPhoneRegex.test(trimmedPhone) || digitCount < 9) {
      errors.phone = "Enter a valid phone number (e.g. 0911234567, 0712345678, or +251 91 123 4567)";
    }

    const trimmedAddress = address.trim();
    if (!trimmedAddress) {
      errors.address = "Delivery address in Addis Ababa is required";
    } else if (trimmedAddress.length < 5) {
      errors.address = "Please provide more details (subcity, street, building or house #)";
    }

    if (!cart || cart.length === 0) {
      errors.cart = "Your order bag is empty. Please add dishes to place an order.";
    }

    return errors;
  };

  // Resolve field error prioritizing client-side errors, then server-side
  const getFieldError = (fieldName) => {
    if (clientErrors[fieldName]) {
      return clientErrors[fieldName];
    }
    // Only show server error if user hasn't touched the field after error or on submit attempt
    if (state?.fieldErrors?.[fieldName] && (!touched[fieldName] || submitAttempted)) {
      return state.fieldErrors[fieldName][0];
    }
    return null;
  };

  // Clear specific field error when input changes
  const handleInputChange = (fieldName, value, setter) => {
    setter(value);
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    if (clientErrors[fieldName]) {
      setClientErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  // Intercept submit for instant validation & focus management
  const handleSubmit = (e) => {
    setSubmitAttempted(true);
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      e.preventDefault();
      setClientErrors(errors);

      // Focus first erroneous input
      const firstInvalidId = ["customerName", "phone", "address"].find((id) => errors[id]);
      if (firstInvalidId) {
        const el = document.getElementById(firstInvalidId);
        if (el) {
          el.focus();
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      return;
    }
    setClientErrors({});
  };

  // Wait for client localStorage hydration to prevent SSR mismatch or flashing
  if (!isHydrated) {
    return (
      <div className="py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-3 border-amber-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-stone-500 text-sm font-medium">Synchronizing checkout with your bag...</p>
      </div>
    );
  }

  // Success Notification & Live Tracker Ticket
  if (state?.success && state?.order) {
    return (
      <div className="p-6 sm:p-8 bg-emerald-50/90 border border-emerald-300 rounded-3xl text-emerald-950 space-y-5 animate-fade-in shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7 text-emerald-700" />
            </span>
            <div>
              <h3 className="text-xl font-black text-emerald-900 tracking-tight">
                {state.message}
              </h3>
              <p className="text-xs text-emerald-700 mt-0.5">
                Your kitchen ticket has been dispatched to Addis Eats chefs.
              </p>
            </div>
          </div>

          <span className="px-3 py-1 bg-emerald-200/80 text-emerald-900 font-extrabold text-xs uppercase tracking-wider rounded-full border border-emerald-300 shrink-0">
            {cancelState?.order?.status || state.order.status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/80 backdrop-blur-xs p-5 rounded-2xl border border-emerald-200/80 text-xs">
          <div className="space-y-1.5">
            <div>
              <span className="text-emerald-700 font-medium">Order Number:</span>{" "}
              <strong className="font-mono text-stone-900 text-sm">{state.order.id}</strong>
            </div>
            <div>
              <span className="text-emerald-700 font-medium">Dishes:</span>{" "}
              <strong className="text-stone-900 font-bold">
                {state.order.dishName || `${state.order.quantity}x ${state.order.dishId}`}
              </strong>
            </div>
            <div>
              <span className="text-emerald-700 font-medium">Total Paid:</span>{" "}
              <strong className="text-[#E05328] font-black text-sm">
                ${Number(state.order.total || 0).toFixed(2)}
              </strong>
            </div>
          </div>

          <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l sm:pl-4 border-emerald-100">
            <div>
              <span className="text-emerald-700 font-medium">Deliver to:</span>{" "}
              <span className="text-stone-800 font-semibold">{state.order.address}</span>
            </div>
            <div>
              <span className="text-emerald-700 font-medium">Customer:</span>{" "}
              <span className="text-stone-800 font-semibold">{state.order.customerName}</span>
            </div>
            <div>
              <span className="text-emerald-700 font-medium">Payment:</span>{" "}
              <span className="text-stone-800 font-semibold">{state.order.paymentMethod || "Cash on Delivery"}</span>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href={`/orders/${state.order.id}`}
            className="px-6 py-3 bg-[#E05328] hover:bg-[#c8441c] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-orange-600/30 flex items-center gap-2 hover:scale-[1.01]"
          >
            <span>Track Live Delivery Status</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/orders"
            className="px-5 py-3 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs sm:text-sm rounded-xl border border-stone-200 transition-colors"
          >
            View All My Orders
          </Link>

          {/* Cancel order action */}
          {cancelState?.success ? (
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-300">
              {cancelState.message}
            </span>
          ) : cancelState?.error ? (
            <span className="text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-300">
              {cancelState.error}
            </span>
          ) : (
            <form action={cancelFormAction} className="inline">
              <input type="hidden" name="orderId" value={state.order.id} />
              <button
                type="submit"
                disabled={isCancelPending}
                className="px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-colors disabled:opacity-50"
              >
                {isCancelPending ? "Cancelling..." : "Cancel Order"}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // If cart is empty, synchronize with empty bag state and allow quick adds
  if (cart.length === 0) {
    return (
      <div className="space-y-8 animate-fade-in">
        {/* Empty State Banner */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-8 sm:p-12 text-center shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#E05328] via-amber-500 to-[#F2D024]" />
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4 shadow-inner">
            <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-[#E05328]" />
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mb-2">
            Your Order Bag is Empty
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed mb-6">
            Please add dishes from our authentic menu or saved favorites before proceeding with checkout.
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

        {/* Quick Add Recommendations directly in Checkout */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900">
                Quick-Add Popular Specialties
              </h3>
              <p className="text-xs text-stone-500">
                Click &ldquo;+ Add&rdquo; to add a dish and activate checkout immediately.
              </p>
            </div>
            <Link href="/menu" className="inline-flex items-center gap-1 text-xs font-bold text-[#E05328] hover:underline">
              <span>View All Menu</span>
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

  // Pre-calculated field errors
  const customerNameError = getFieldError("customerName");
  const phoneError = getFieldError("phone");
  const addressError = getFieldError("address");

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Global Form Validation Error Banner */}
      {((state?.message && !state?.success) || clientErrors.cart) && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl text-rose-900 text-xs sm:text-sm font-semibold flex items-start gap-3 animate-fade-in shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">
              {clientErrors.cart || state?.message || "Please check the delivery form for errors."}
            </span>
            <p className="text-rose-700 text-xs font-normal">
              Review highlighted fields below and provide your contact information to finish your order.
            </p>
          </div>
        </div>
      )}

      {/* Main Form & Checkout Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2/3): Form Inputs */}
        <div className="lg:col-span-2">
          <form
            action={formAction}
            onSubmit={handleSubmit}
            noValidate
            className="space-y-6"
          >
            {/* Hidden Fields for Live Cart Synchronization & Order Placement */}
            <input type="hidden" name="items" value={JSON.stringify(cart)} />
            <input type="hidden" name="dishId" value={cart[0]?.id || "doro-wat"} />
            <input type="hidden" name="quantity" value={itemsCount} />
            <input type="hidden" name="total" value={total.toFixed(2)} />
            <input type="hidden" name="paymentMethod" value={paymentMethod} />

            {/* Delivery Contact Information Card */}
            <div className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h2 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#E05328]" />
                  <span>Delivery Information</span>
                </h2>
                <span className="text-[11px] text-stone-500 font-medium">
                  Fields marked with <span className="text-rose-500 font-bold">*</span> are required
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Customer Full Name */}
                <div>
                  <label htmlFor="customerName" className="block text-xs font-bold text-stone-700 mb-1.5">
                    Customer Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="customerName"
                      name="customerName"
                      value={customerName}
                      onChange={(e) => handleInputChange("customerName", e.target.value, setCustomerName)}
                      placeholder="e.g. Abebe Bikila"
                      className={`w-full p-3 rounded-xl text-xs sm:text-sm text-stone-900 transition-all border ${
                        customerNameError
                          ? "border-rose-400 bg-rose-50/30 ring-2 ring-rose-400/20 focus:bg-white focus:border-rose-500 focus:ring-rose-400/30"
                          : "border-stone-300 bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-[#E05328] focus:border-transparent"
                      }`}
                    />
                    {customerNameError && (
                      <span className="absolute right-3 top-3 text-rose-500 pointer-events-none">
                        <AlertCircle className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  {customerNameError ? (
                    <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1 animate-fade-in" role="alert">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{customerNameError}</span>
                    </p>
                  ) : (
                    <p className="mt-1 text-[11px] text-stone-400">
                      As it appears on your ID or order delivery receipt.
                    </p>
                  )}
                </div>

                {/* Addis Mobile Phone Number */}
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-stone-700 mb-1.5">
                    Phone Number (Addis Mobile) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={phone}
                      onChange={(e) => handleInputChange("phone", e.target.value, setPhone)}
                      placeholder="e.g. 0911234567 or +251 91 123 4567"
                      className={`w-full p-3 rounded-xl text-xs sm:text-sm text-stone-900 transition-all border ${
                        phoneError
                          ? "border-rose-400 bg-rose-50/30 ring-2 ring-rose-400/20 focus:bg-white focus:border-rose-500 focus:ring-rose-400/30"
                          : "border-stone-300 bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-[#E05328] focus:border-transparent"
                      }`}
                    />
                    {phoneError && (
                      <span className="absolute right-3 top-3 text-rose-500 pointer-events-none">
                        <AlertCircle className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  {phoneError ? (
                    <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1 animate-fade-in" role="alert">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{phoneError}</span>
                    </p>
                  ) : (
                    <p className="mt-1 text-[11px] text-stone-500">
                      Examples: <span className="font-mono text-stone-700">0911234567</span>, <span className="font-mono text-stone-700">0712345678</span>, or <span className="font-mono text-stone-700">+251 9...</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label htmlFor="address" className="block text-xs font-bold text-stone-700 mb-1.5">
                  Delivery Address in Addis Ababa <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={address}
                    onChange={(e) => handleInputChange("address", e.target.value, setAddress)}
                    placeholder="e.g. Bole Atlas, Near Edna Mall, House 204"
                    className={`w-full p-3 rounded-xl text-xs sm:text-sm text-stone-900 transition-all border ${
                      addressError
                        ? "border-rose-400 bg-rose-50/30 ring-2 ring-rose-400/20 focus:bg-white focus:border-rose-500 focus:ring-rose-400/30"
                        : "border-stone-300 bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-[#E05328] focus:border-transparent"
                    }`}
                  />
                  {addressError && (
                    <span className="absolute right-3 top-3 text-rose-500 pointer-events-none">
                      <AlertCircle className="w-4 h-4" />
                    </span>
                  )}
                </div>
                {addressError ? (
                  <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1 animate-fade-in" role="alert">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{addressError}</span>
                  </p>
                ) : (
                  <p className="mt-1 text-[11px] text-stone-500">
                    Include subcity (e.g. Bole, Kirkos, Yeka), street/landmark, and house or apartment number.
                  </p>
                )}
              </div>

              {/* Kitchen Instructions / Notes */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="notes" className="block text-xs font-bold text-stone-700">
                    Special Kitchen Instructions / Dietary Requests (Optional)
                  </label>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {notes.length}/300
                  </span>
                </div>
                <textarea
                  id="notes"
                  name="notes"
                  rows="2"
                  maxLength={300}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Extra spicy berbere sauce, separate warm injera, ring bell upon arrival"
                  className="w-full p-3 bg-stone-50/50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-[#E05328] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Payment Method Selector Card */}
            <div className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h2 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#E05328]" />
                  <span>Payment Method</span>
                </h2>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Secure checkout
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: "Cash on Delivery",
                    label: "Cash on Delivery",
                    icon: Banknote,
                    color: "text-emerald-700",
                    desc: "Pay cash upon arrival",
                  },
                  {
                    id: "Telebirr",
                    label: "Telebirr",
                    icon: Smartphone,
                    color: "text-amber-600",
                    desc: "Pay via Telebirr app",
                  },
                  {
                    id: "CBE Birr",
                    label: "CBE Birr",
                    icon: Building2,
                    color: "text-blue-600",
                    desc: "Commercial Bank CBE",
                  },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`relative p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#E05328] bg-orange-50/70 ring-2 ring-[#E05328]/30 shadow-xs"
                          : "border-stone-200 hover:border-stone-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${m.color}`} />
                          <span className="text-xs font-bold text-stone-900">{m.label}</span>
                        </div>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-[#E05328] text-white flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-500 block leading-tight">{m.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Order Action Button */}
            <button
              type="submit"
              disabled={isPending || cart.length === 0}
              className="w-full py-4 px-6 bg-gradient-to-r from-[#E05328] to-amber-600 hover:from-[#c8441c] hover:to-amber-700 disabled:opacity-50 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-md shadow-orange-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] cursor-pointer disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Validating &amp; Placing Order...</span>
                </>
              ) : (
                <>
                  <span>Confirm &amp; Place Order · ${total.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column (1/3): Real-Time Synchronized Order Review */}
        <div className="space-y-4">
          <div className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-7 shadow-lg space-y-5 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-base font-extrabold text-stone-900">
                Order Review ({itemsCount})
              </h2>
              <Link
                href="/cart"
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors"
              >
                <span>Edit in Cart</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Free Delivery Tracker Synchronized with Cart */}
            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs">
              <div className="flex items-center justify-between font-bold mb-1.5 text-[11px]">
                <span className="text-amber-950 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500 shrink-0" />
                  {subtotal >= freeDeliveryThreshold ? (
                    <span className="inline-flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                      <span>FREE Express Delivery unlocked!</span>
                    </span>
                  ) : (
                    `Add $${amountForFreeDelivery.toFixed(2)} more for FREE Delivery!`
                  )}
                </span>
                <span className="text-amber-800">
                  ${subtotal.toFixed(2)} / ${freeDeliveryThreshold.toFixed(2)}
                </span>
              </div>
              <div className="w-full h-1.5 bg-amber-200/70 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#E05328] to-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${freeDeliveryProgress}%` }}
                />
              </div>
            </div>

            {/* Synchronized Cart Items List with In-Place Modifiers */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-stone-100">
              {cart.map((item) => {
                const itemTotal = ((Number(item.price) || 0) * item.quantity).toFixed(2);
                return (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                        <Image
                          src={item.image || "/images/doro-wat.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-stone-900 text-xs sm:text-sm truncate">
                          {item.name}
                        </h4>
                        <span className="text-[11px] text-stone-400 block -mt-0.5">
                          ${Number(item.price).toFixed(2)} each
                        </span>
                      </div>
                    </div>

                    {/* In-place Quantity controls & Total */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center border border-stone-200 rounded-lg bg-white overflow-hidden shadow-2xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-100 font-bold text-xs cursor-pointer"
                          title="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-100 font-bold text-xs cursor-pointer"
                          title="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-extrabold text-[#E05328] text-xs sm:text-sm min-w-[50px] text-right">
                        ${itemTotal}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-300 hover:text-rose-600 text-xs p-1 cursor-pointer transition-colors"
                        title={`Remove ${item.name}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Financials Breakdown */}
            <div className="space-y-2.5 pt-4 border-t border-stone-100 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal ({itemsCount} dishes)</span>
                <span className="font-bold text-stone-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <span>Express Delivery</span>
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
              <div className="flex justify-between">
                <span>Addis Culinary Tax (5%)</span>
                <span className="font-bold text-stone-900">${tax.toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                <span className="text-sm font-extrabold text-stone-900">Total Payable</span>
                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-black text-[#E05328]">
                    ${total.toFixed(2)}
                  </span>
                  <span className="block text-[10px] text-stone-400">All municipal taxes included</span>
                </div>
              </div>
            </div>

            {/* Delivery time guarantee */}
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600 space-y-1">
              <div className="font-bold text-stone-800 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>Express Delivery in Addis Ababa</span>
              </div>
              <p className="text-[10px] text-stone-500 leading-relaxed">
                Hot and fresh sealed delivery. Average delivery window: 30–45 minutes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
