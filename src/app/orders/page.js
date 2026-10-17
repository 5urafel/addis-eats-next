import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { cancelOrder } from "@/app/actions";
import { Receipt, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Orders — Addis Eats",
  description: "View and manage your Addis Eats order history.",
};

export default async function OrdersListPage() {
  // Layer 2: Server Component session check
  const session = await getSession();

  if (!session) {
    redirect("/signin?next=/orders");
  }

  // Scope query strictly to the session user ID (unless staff)
  const allOrders = global._ordersStore || [];
  const userOrders =
    session.role === "staff"
      ? allOrders
      : allOrders.filter((o) => o.userId === session.userId);

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2 sm:py-4">
      {/* Header & Session Proof */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Your Order History</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track active order status and past dining requests.
          </p>
        </div>

        {/* User Badge */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl px-4 py-2.5 text-xs text-amber-950 self-start md:self-auto shadow-2xs">
          <div className="text-stone-500 text-[11px]">Signed in as</div>
          <div className="font-bold text-stone-900 text-sm">{session.name}</div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs">
        {userOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-3">
              <Receipt className="w-8 h-8 text-amber-700" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">No orders yet</h3>
            <p className="text-sm text-slate-500 mb-6">
              You haven&apos;t placed any orders yet. Taste our authentic Ethiopian dishes!
            </p>
            <Link
              href="/menu"
              className="px-6 py-3 bg-[#E05328] hover:bg-[#c8441c] text-white font-bold text-sm rounded-xl transition-colors inline-block shadow-md shadow-orange-600/20"
            >
              Browse Menu &amp; Place Order
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {userOrders.map((order) => (
              <div
                key={order.id}
                className="border border-slate-200 rounded-xl p-5 hover:border-amber-300 transition-colors bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
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

                  <div className="flex items-baseline gap-3">
                    <div className="font-bold text-slate-900 text-base">
                      {order.dishName || `${order.quantity}x ${order.dishId}`}
                    </div>
                    {order.total && (
                      <span className="font-extrabold text-[#E05328] text-sm">
                        ${Number(order.total).toFixed(2)}
                      </span>
                    )}
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {order.items.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium border border-stone-200"
                        >
                          {item.quantity}x {item.name || item.id}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-xs text-slate-500 mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    <span>Deliver to: {order.address}</span>
                    <span>Placed: {new Date(order.createdAt).toLocaleTimeString()}</span>
                    {order.paymentMethod && <span>Payment: {order.paymentMethod}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg border border-slate-200 transition-colors"
                  >
                    <span>Track Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {order.status !== "cancelled" && order.status !== "delivered" && (
                    <form action={cancelOrder}>
                      <input type="hidden" name="orderId" value={order.id} />
                      <button
                        type="submit"
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium text-xs rounded-lg border border-rose-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
