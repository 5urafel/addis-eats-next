import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

if (!global._ordersStore) {
  global._ordersStore = [];
}

const mockOrders = {
  "ord-101": {
    id: "ord-101",
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
  },
  "ord-123": {
    id: "ord-123",
    userId: "user-123",
    customerName: "Abebe Bikila",
    dishId: "doro-wat",
    dishName: "Doro Wat",
    quantity: 2,
    total: 31.98,
    status: "preparing",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    address: "Bole Road, Addis Ababa",
    notes: "Extra spicy, please!",
  },
  "ord-201": {
    id: "ord-201",
    userId: "user-456",
    customerName: "Tigist Alemu",
    dishId: "beyaynetu",
    dishName: "Veggie Beyaynetu",
    quantity: 1,
    total: 16.00,
    status: "delivered",
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    address: "Kazanchis, Addis Ababa",
    notes: "No onions",
  },
};

export async function GET(request, context) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: Active session cookie required" },
      { status: 401 }
    );
  }

  const params = await context.params;
  const id = params?.id;

  if (!id) {
    return NextResponse.json({ error: "Order ID missing" }, { status: 400 });
  }

  let order = global._ordersStore.find((o) => o.id === id);

  if (!order && mockOrders[id]) {
    order = mockOrders[id];
  }

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Strict ownership check
  if (order.userId && order.userId !== session.userId && session.role !== "staff") {
    return NextResponse.json(
      { error: "Forbidden: You do not own this order record" },
      { status: 403 }
    );
  }

  return NextResponse.json(order, { status: 200 });
}
