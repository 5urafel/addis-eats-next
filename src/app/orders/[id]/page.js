import { redirect } from "next/navigation";
import Link from "next/link";
import OrderTracker from "./OrderTracker";
import { getSession } from "@/lib/session";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

async function getOrder(id) {
  if (global._ordersStore) {
    const found = global._ordersStore.find((o) => o.id === id);
    if (found) return found;
  }

  if (id === "ord-101" || id === "ord-123") {
    return {
      id: id,
      userId: "user-123",
      customerName: "Abebe Bikila",
      dishId: "doro-wat",
      dishName: "Doro Wat",
      quantity: 2,
      total: 31.98,
      status: "preparing",
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      address: "Bole Road, Addis Ababa",
      notes: "Extra spicy, please!",
    };
  }

  if (id === "ord-201") {
    return {
      id: "ord-201",
      userId: "user-456", // Belongs to user-456
      customerName: "Tigist Alemu",
      dishId: "beyaynetu",
      dishName: "Veggie Beyaynetu",
      quantity: 1,
      total: 16.00,
      status: "delivered",
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      address: "Kazanchis, Addis Ababa",
      notes: "No onions",
    };
  }

  return {
    id: id,
    userId: "user-123",
    customerName: "Valued Customer",
    dishId: "special-tibs",
    dishName: "Special Tibs",
    quantity: 1,
    total: 18.50,
    status: "preparing",
    createdAt: new Date().toISOString(),
    address: "Addis Ababa, Ethiopia",
    notes: "Standard order",
  };
}

export default async function OrderPage({ params }) {
  // Layer 2: Server Component session check & Layer 3: Record ownership proof
  const session = await getSession();
  const resolvedParams = await params;
  const id = resolvedParams?.id || "ord-101";

  if (!session) {
    redirect(`/signin?next=/orders/${id}`);
  }

  const initialOrder = await getOrder(id);

  // Strict ownership check: prevent reading another user's order
  if (initialOrder && initialOrder.userId && initialOrder.userId !== session.userId && session.role !== "staff") {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center text-rose-900 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-center mx-auto mb-4 text-rose-700">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-sm text-rose-700 mb-6 max-w-md mx-auto">
            You do not have permission to view this order. Please verify that you are signed in with the correct account.
          </p>

          <div>
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to My Orders</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <OrderTracker id={id} fallbackData={initialOrder} />
    </div>
  );
}
