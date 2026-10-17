import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { updateOrderStatus, signOutAction } from "@/app/actions";
import { ShieldAlert, ChefHat } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kitchen Dashboard — Staff Only",
  description: "Kitchen order management interface for Addis Eats staff.",
};

export default async function KitchenPage() {
  // Layer 2: Server-side authentication and role check (NOT in client markup!)
  const session = await getSession();

  if (!session) {
    redirect("/signin?next=/kitchen");
  }

  // Strict server-side role check
  if (session.role !== "staff") {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center text-red-900 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-red-100 border border-red-300 flex items-center justify-center mx-auto mb-4 text-red-700">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Staff Access Only</h1>
          <p className="text-sm text-red-700 mb-3 max-w-md mx-auto">
            The Kitchen Dashboard is restricted to staff members. Your account does not have kitchen staff permissions.
          </p>

          <p className="text-xs text-stone-500 mb-6">
            Signed in as: <strong className="text-stone-800">{session.name}</strong> ({session.email})
          </p>

          <div>
            <form action={signOutAction}>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-lg transition-colors"
              >
                Sign Out &amp; Switch Account
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const allOrders = global._ordersStore || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <ChefHat className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold">Kitchen Management Dashboard</h1>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-2.5 py-0.5 rounded-full font-medium">
              Staff Portal
            </span>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Real-time kitchen display system for active food preparation and delivery lifecycle.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-800/80 px-3.5 sm:px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-300 self-start md:self-auto">
          <div>
            Logged in as: <strong className="text-amber-400">{session.name}</strong> ({session.email})
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center justify-between">
          <span>Active Orders Stream ({allOrders.length})</span>
          <span className="text-xs font-normal text-slate-500">Auto-updating</span>
        </h2>

        {allOrders.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            No active orders in the kitchen pipeline.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allOrders.map((order) => (
              <div
                key={order.id}
                className="border border-slate-200 rounded-xl p-4 sm:p-5 hover:border-amber-300 transition-colors bg-slate-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {order.id}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                        order.status === "placed"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : order.status === "preparing"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : order.status === "on_the_way"
                          ? "bg-purple-100 text-purple-800 border border-purple-200"
                          : order.status === "delivered"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="font-bold text-slate-900 text-base mb-1">
                    {order.dishName || `${order.quantity}x ${order.dishId}`}
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="mb-3 space-y-1 bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
                      <div className="font-semibold text-slate-500 uppercase text-[10px] tracking-wider">
                        Dishes to Prepare:
                      </div>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between font-medium text-slate-800">
                          <span>{item.quantity}x {item.name || item.id}</span>
                          <span className="text-slate-400 font-mono text-[11px]">${((Number(item.price) || 0) * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-xs text-slate-600 space-y-1 mb-4">
                    <div>Customer: <strong className="text-slate-800">{order.customerName}</strong></div>
                    {order.phone && <div>Phone: <span className="font-mono">{order.phone}</span></div>}
                    <div>Address: {order.address}</div>
                    {order.notes && <div className="text-amber-800 italic">Notes: &ldquo;{order.notes}&rdquo;</div>}
                  </div>
                </div>

                {/* Status transition controls */}
                <div className="pt-3 border-t border-slate-200 flex flex-wrap gap-2 text-xs">
                  <form action={updateOrderStatus} className="inline">
                    <input type="hidden" name="orderId" value={order.id} />
                    <input type="hidden" name="status" value="preparing" />
                    <button
                      type="submit"
                      disabled={order.status === "preparing"}
                      className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-medium rounded border border-amber-200 disabled:opacity-50"
                    >
                      Mark Preparing
                    </button>
                  </form>

                  <form action={updateOrderStatus} className="inline">
                    <input type="hidden" name="orderId" value={order.id} />
                    <input type="hidden" name="status" value="on_the_way" />
                    <button
                      type="submit"
                      disabled={order.status === "on_the_way"}
                      className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 font-medium rounded border border-purple-200 disabled:opacity-50"
                    >
                      On The Way
                    </button>
                  </form>

                  <form action={updateOrderStatus} className="inline">
                    <input type="hidden" name="orderId" value={order.id} />
                    <input type="hidden" name="status" value="delivered" />
                    <button
                      type="submit"
                      disabled={order.status === "delivered"}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium rounded border border-emerald-200 disabled:opacity-50"
                    >
                      Mark Delivered
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
