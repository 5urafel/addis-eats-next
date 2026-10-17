import { NextResponse } from "next/server";
import { orderSchema } from "@/lib/schema";
import { getSession } from "@/lib/session";

if (!global._ordersStore) {
  global._ordersStore = [];
}

export async function GET(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: Active session cookie required" },
      { status: 401 }
    );
  }

  const userOrders =
    session.role === "staff"
      ? global._ordersStore
      : global._ordersStore.filter((o) => o.userId === session.userId);

  return NextResponse.json(userOrders, { status: 200 });
}

export async function POST(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: Active session cookie required to place orders" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const result = orderSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Validation failed", fieldErrors },
        { status: 422 }
      );
    }

    const newOrder = {
      id: `ord-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ...result.data,
      userId: session.userId, // Ownership linked directly to session user ID
      status: "placed",
      createdAt: new Date().toISOString(),
    };

    global._ordersStore.push(newOrder);

    return NextResponse.json(
      { message: "Order placed successfully", order: newOrder },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400 }
    );
  }
}
