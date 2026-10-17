"use client";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { useState, useEffect } from "react";
import { Phone, CreditCard } from "lucide-react";

export default function OrderTracker({ id, fallbackData }) {
  const { data: order, error, isValidating } = useSWR(
    `/api/orders/${id}`,
    fetcher,
    {
      fallbackData,
      refreshInterval: 5000,
      revalidateOnFocus: true,
    }
  );

  const [lastPolledAt, setLastPolledAt] = useState(null);

  useEffect(() => {
    setLastPolledAt(new Date().toLocaleTimeString());
  }, [order, isValidating]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
        <h2 className="text-lg font-bold">Failed to load order status</h2>
        <p className="text-sm mt-1">Please check your connection and try refreshing.</p>
      </div>
    );
  }

  const steps = [
    { key: "placed", label: "Order Placed" },
    { key: "preparing", label: "Preparing" },
    { key: "on_the_way", label: "Out for Delivery" },
    { key: "delivered", label: "Delivered" },
  ];

  const currentStatusIndex = Math.max(
    0,
    steps.findIndex((s) => s.key === (order?.status?.toLowerCase() || "placed"))
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-7 shadow-xs">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center pb-6 border-b border-slate-100 mb-6 gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
            Live Order Status
          </span>
          <h1 className="text-2xl font-bold text-slate-900">
            Order #{order?.id}
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isValidating ? "bg-amber-500 animate-ping" : "bg-emerald-500"
            }`}
          />
          <span className="text-xs font-medium text-amber-900">
            {isValidating ? "Refreshing..." : "Polling Live (Every 5s)"}
          </span>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="mb-8">
        <div className="grid grid-cols-4 gap-2">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStatusIndex;
            const isCurrent = idx === currentStatusIndex;
            return (
              <div key={step.key} className="flex flex-col items-center">
                <div
                  className={`w-full h-2 rounded-full mb-2 transition-colors ${
                    isCompleted ? "bg-amber-600" : "bg-slate-200"
                  }`}
                />
                <span
                  className={`text-[10px] sm:text-xs text-center font-medium leading-tight px-0.5 ${
                    isCurrent
                      ? "text-amber-700 font-bold"
                      : isCompleted
                      ? "text-slate-800"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Details Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 border border-slate-200 rounded-lg p-5">
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Order Items &amp; Charges
          </h3>
          <p className="text-sm font-semibold text-slate-800">
            {order?.dishName || order?.dishId || "Custom Dish Order"}
          </p>
          {order?.items && order.items.length > 0 ? (
            <div className="mt-2 space-y-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs text-slate-600">
                  <span>{item.quantity}x {item.name || item.id}</span>
                  <span className="font-medium text-slate-800">${((Number(item.price) || 0) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-600">Quantity: {order?.quantity || 1}</p>
          )}
          <div className="mt-3 pt-2 border-t border-slate-200 flex justify-between items-center">
            <span className="text-xs text-slate-500 font-medium">Total Paid:</span>
            <span className="text-base font-extrabold text-[#E05328]">${Number(order?.total || 0).toFixed(2)}</span>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Delivery Info
          </h3>
          <p className="text-sm font-semibold text-slate-800">
            {order?.customerName || "Customer"}
          </p>
          <p className="text-xs text-slate-600">{order?.address || "Addis Ababa"}</p>
          {order?.phone && (
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <span>{order.phone}</span>
            </p>
          )}
          {order?.paymentMethod && (
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <span>{order.paymentMethod}</span>
            </p>
          )}
          {order?.notes && (
            <p className="text-xs text-slate-500 italic mt-1.5 bg-amber-50/70 p-2 rounded-lg border border-amber-200/60">
              Note: "{order.notes}"
            </p>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 flex justify-between items-center text-xs text-stone-400 border-t border-stone-100 pt-4">
        <span>Addis Eats Kitchen Network</span>
        {lastPolledAt && <span>Status updated: {lastPolledAt}</span>}
      </div>
    </div>
  );
}
