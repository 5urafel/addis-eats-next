"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { orderSchema } from "@/lib/schema";
import { getSession, createSession, destroySession, sanitizeNextUrl } from "@/lib/session";

// Global store initialized with mock orders linked to specific user IDs
if (!global._ordersStore || global._ordersStore.length === 0) {
  global._ordersStore = [
    {
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
    {
      id: "ord-102",
      userId: "user-123",
      customerName: "Abebe Bikila",
      dishId: "special-tibs",
      dishName: "Special Tibs",
      quantity: 1,
      total: 18.50,
      status: "placed",
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      address: "Bole Road, Addis Ababa",
      notes: "With extra injera",
    },
    {
      id: "ord-201",
      userId: "user-456", // Belongs to a different customer account
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
  ];
}

// Mock users database with demo credentials
if (!global._usersStore || global._usersStore.length === 0) {
  global._usersStore = [
    {
      id: "user-123",
      name: "Abebe Bikila",
      email: "user@addiseats.com",
      password: "password123",
      role: "customer",
    },
    {
      id: "user-456",
      name: "Tigist Alemu",
      email: "user-456@addiseats.com",
      password: "password123",
      role: "customer",
    },
    {
      id: "staff-999",
      name: "Chef Worku (Kitchen Staff)",
      email: "staff@addiseats.com",
      password: "password123",
      role: "staff",
    },
  ];
}

function extractFormData(previousState, formData) {
  if (formData instanceof FormData) {
    return Object.fromEntries(formData.entries());
  }
  if (previousState instanceof FormData) {
    return Object.fromEntries(previousState.entries());
  }
  if (typeof formData === "object" && formData !== null) {
    return formData;
  }
  if (typeof previousState === "object" && previousState !== null) {
    return previousState;
  }
  return {};
}

/**
 * Server action to sign in a user with validation and redirect to sanitized destination.
 */
export async function signInAction(previousState, formData) {
  const data = extractFormData(previousState, formData);
  const email = (data.email || "").trim().toLowerCase();
  const password = data.password || "";
  const rawNext = data.next || "/";

  const fieldErrors = {};

  if (!email) {
    fieldErrors.email = ["Email address is required"];
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = ["Please enter a valid email address"];
  }

  if (!password) {
    fieldErrors.password = ["Password is required"];
  } else if (password.length < 6) {
    fieldErrors.password = ["Password must be at least 6 characters"];
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      error: "Please correct the errors below",
      fieldErrors,
      data: { email, next: rawNext },
    };
  }

  // Parse clientUser payload if passed from client-side localStorage sync
  let clientUser = null;
  if (data.clientUser) {
    try {
      clientUser = typeof data.clientUser === "string" ? JSON.parse(data.clientUser) : data.clientUser;
    } catch (e) {
      // Ignore
    }
  }

  // Find user in server memory store
  let existingUser = (global._usersStore || []).find(
    (u) => u.email && u.email.toLowerCase() === email
  );

  // If not found in server memory store but verified from client localStorage, sync to server store
  if (!existingUser && clientUser && clientUser.email && clientUser.email.toLowerCase() === email) {
    existingUser = {
      id: clientUser.id || `user-${Date.now()}`,
      name: clientUser.name || "Customer",
      email: clientUser.email.toLowerCase(),
      password: clientUser.password || password,
      role: clientUser.role || "customer",
      createdAt: clientUser.createdAt || new Date().toISOString(),
    };
    if (!global._usersStore) {
      global._usersStore = [];
    }
    global._usersStore.push(existingUser);
  }

  // Step 1: User must exist
  if (!existingUser) {
    return {
      success: false,
      error: "No account found with this email. Please create an account first.",
      fieldErrors: {
        email: ["No account found with this email."],
      },
      data: { email, next: rawNext },
    };
  }

  // Step 2: Credentials (password) must be checked
  if (existingUser.password !== password) {
    return {
      success: false,
      error: "Incorrect password. Please verify your credentials and try again.",
      fieldErrors: {
        password: ["Incorrect password. Please try again."],
      },
      data: { email, next: rawNext },
    };
  }

  const userToSession = {
    userId: existingUser.id,
    email: existingUser.email,
    name: existingUser.name,
    role: existingUser.role,
  };

  await createSession(userToSession);

  const safeNext = sanitizeNextUrl(rawNext);
  redirect(safeNext);
}

/**
 * Server action to create a new user account with validation.
 */
export async function signUpAction(previousState, formData) {
  const data = extractFormData(previousState, formData);
  const name = (data.name || "").trim();
  const email = (data.email || "").trim().toLowerCase();
  const password = data.password || "";
  const confirmPassword = data.confirmPassword || "";
  const role = data.role === "staff" ? "staff" : "customer";
  const rawNext = data.next || "/";

  const fieldErrors = {};

  if (!name) {
    fieldErrors.name = ["Full name is required"];
  } else if (name.length < 2) {
    fieldErrors.name = ["Name must be at least 2 characters"];
  }

  if (!email) {
    fieldErrors.email = ["Email address is required"];
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = ["Please enter a valid email address"];
  }

  if (!password) {
    fieldErrors.password = ["Password is required"];
  } else if (password.length < 6) {
    fieldErrors.password = ["Password must be at least 6 characters"];
  }

  if (!confirmPassword) {
    fieldErrors.confirmPassword = ["Please confirm your password"];
  } else if (password !== confirmPassword) {
    fieldErrors.confirmPassword = ["Passwords do not match"];
  }

  // Check if email already registered in existing user store
  if (
    global._usersStore &&
    global._usersStore.some((u) => u.email.toLowerCase() === email)
  ) {
    fieldErrors.email = [
      "An account with this email already exists. Please sign in instead.",
    ];
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      error: "Please correct the errors below",
      fieldErrors,
      data: { name, email, role, next: rawNext },
    };
  }

  const userId =
    role === "staff"
      ? `staff-${Math.random().toString(36).substring(2, 7)}`
      : `user-${Math.random().toString(36).substring(2, 7)}`;

  const newUser = {
    id: userId,
    name,
    email,
    password,
    role,
    createdAt: new Date().toISOString(),
  };

  if (!global._usersStore) {
    global._usersStore = [];
  }
  global._usersStore.push(newUser);

  await createSession({
    userId: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  });

  const safeNext = sanitizeNextUrl(rawNext);
  redirect(safeNext);
}

/**
 * Server action to sign out current session.
 */
export async function signOutAction() {
  await destroySession();
  revalidatePath("/");
  redirect("/signin");
}

/**
 * Server action to place an order. Requires active session and assigns session userId.
 */
export async function placeOrder(previousState, formData) {
  const session = await getSession();
  if (!session) {
    return {
      success: false,
      message: "Unauthorized: Active session required to place an order",
    };
  }

  let rawData;
  if (formData instanceof FormData) {
    rawData = {
      dishId: (formData.get("dishId") || "").toString().trim(),
      quantity: formData.get("quantity") || "1",
      customerName: (formData.get("customerName") || session.name || "").toString().trim(),
      address: (formData.get("address") || "").toString().trim(),
      phone: (formData.get("phone") || "").toString().trim(),
      paymentMethod: (formData.get("paymentMethod") || "Cash on Delivery").toString().trim(),
      items: formData.get("items") || "",
      total: formData.get("total") || undefined,
      notes: (formData.get("notes") || "").toString().trim(),
    };
  } else if (typeof formData === "object" && formData !== null) {
    rawData = {
      ...formData,
      customerName: (formData.customerName || session.name || "").toString().trim(),
      address: (formData.address || "").toString().trim(),
      phone: (formData.phone || "").toString().trim(),
      notes: (formData.notes || "").toString().trim(),
    };
  } else {
    rawData = {};
  }

  // Parse multi-item cart payload if present
  let parsedItems = [];
  if (rawData.items) {
    try {
      if (typeof rawData.items === "string") {
        parsedItems = JSON.parse(rawData.items);
      } else if (Array.isArray(rawData.items)) {
        parsedItems = rawData.items;
      }
    } catch (e) {
      console.warn("Failed to parse order items payload", e);
    }
  }

  // Check if cart is empty
  if (parsedItems.length === 0 && (!rawData.dishId || rawData.dishId === "")) {
    return {
      success: false,
      fieldErrors: { items: ["Your order bag is empty. Please select dishes from the menu to checkout."] },
      data: rawData,
      message: "Your order bag is empty. Please select dishes from the menu before placing an order.",
    };
  }

  // If dishId is not set but items exist, infer primary dish from first item
  if ((!rawData.dishId || rawData.dishId === "") && parsedItems.length > 0) {
    rawData.dishId = parsedItems[0].id || "multi-dish";
  }

  // If quantity is not explicitly set, calculate sum of item quantities
  if (parsedItems.length > 0 && (!rawData.quantity || rawData.quantity === "1")) {
    const totalQty = parsedItems.reduce((acc, i) => acc + (Number(i.quantity) || 1), 0);
    if (totalQty > 0) {
      rawData.quantity = totalQty;
    }
  }

  const validation = orderSchema.safeParse(rawData);

  if (!validation.success) {
    const fieldErrors = validation.error.flatten().fieldErrors;
    const firstErrorMessage =
      (fieldErrors.customerName && fieldErrors.customerName[0]) ||
      (fieldErrors.phone && fieldErrors.phone[0]) ||
      (fieldErrors.address && fieldErrors.address[0]) ||
      (fieldErrors.paymentMethod && fieldErrors.paymentMethod[0]) ||
      (fieldErrors.dishId && fieldErrors.dishId[0]) ||
      "Please fill in all required delivery fields correctly.";

    return {
      success: false,
      fieldErrors,
      data: rawData,
      message: firstErrorMessage,
    };
  }

  // Determine dish title
  const dishNamesMap = {
    "doro-wat": "Doro Wat",
    "special-tibs": "Special Tibs",
    "beyaynetu": "Beyaynetu",
    "kitfo": "Kitfo",
    "shiro-tagamino": "Shiro Tagamino",
    "lamb-tibs": "Lamb Tibs",
    "sambusa": "Sambusa",
    "chechebsa": "Chechebsa",
    "ethiopian-coffee": "Ethiopian Coffee",
    "tej-wine": "Tej Honey Wine",
    "asa-tibs": "Asa Tibs",
    "gomen-wat": "Gomen Wat",
  };

  let dishTitle = dishNamesMap[validation.data.dishId] || validation.data.dishId;
  if (parsedItems.length > 1) {
    dishTitle = `${parsedItems[0]?.name || dishTitle} (+${parsedItems.length - 1} more)`;
  } else if (parsedItems.length === 1 && parsedItems[0]?.name) {
    dishTitle = parsedItems[0].name;
  }

  // Calculate total price if not provided
  let calculatedTotal = Number(validation.data.total);
  if (!calculatedTotal || isNaN(calculatedTotal)) {
    if (parsedItems.length > 0) {
      const sub = parsedItems.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
        0
      );
      const delivery = sub >= 40 ? 0 : 3.5;
      const tax = sub * 0.05;
      calculatedTotal = Number((sub + delivery + tax).toFixed(2));
    } else {
      const unitPrices = {
        "doro-wat": 15.99,
        "special-tibs": 18.5,
        "beyaynetu": 14.0,
      };
      const price = unitPrices[validation.data.dishId] || 15.0;
      calculatedTotal = Number((price * validation.data.quantity).toFixed(2));
    }
  }

  const newOrder = {
    id: `ord-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    ...validation.data,
    dishName: dishTitle,
    items: parsedItems.length > 0 ? parsedItems : [
      {
        id: validation.data.dishId,
        name: dishTitle,
        quantity: validation.data.quantity,
        price: Number((calculatedTotal / validation.data.quantity).toFixed(2)),
      }
    ],
    total: calculatedTotal,
    paymentMethod: rawData.paymentMethod || "Cash on Delivery",
    phone: rawData.phone || "",
    userId: session.userId, // Scoped to active session user id
    status: "placed",
    createdAt: new Date().toISOString(),
  };

  global._ordersStore.unshift(newOrder);

  revalidatePath("/checkout");
  revalidatePath("/orders");
  revalidatePath("/kitchen");

  return {
    success: true,
    message: "Order placed successfully!",
    order: newOrder,
    fieldErrors: {},
  };
}

/**
 * Server action to cancel an order. Ownership checked server-side!
 */
export async function cancelOrder(previousState, formData) {
  const session = await getSession();
  if (!session) {
    return {
      success: false,
      error: "Unauthorized: Active session required",
      status: 401,
    };
  }

  let orderId;
  if (formData instanceof FormData) {
    orderId = formData.get("orderId");
  } else if (typeof previousState === "string") {
    orderId = previousState;
  } else if (previousState instanceof FormData) {
    orderId = previousState.get("orderId");
  } else if (typeof formData === "string") {
    orderId = formData;
  } else if (typeof previousState === "object" && previousState?.orderId) {
    orderId = previousState.orderId;
  } else if (typeof formData === "object" && formData?.orderId) {
    orderId = formData.orderId;
  }

  const orderIndex = global._ordersStore.findIndex((o) => o.id === orderId);

  if (orderIndex === -1) {
    return {
      success: false,
      error: "Order not found",
      status: 404,
    };
  }

  const order = global._ordersStore[orderIndex];

  // SERVER-SIDE AUTHORIZATION: ownership check on write!
  if (order.userId && order.userId !== session.userId && session.role !== "staff") {
    return {
      success: false,
      error: "Forbidden: You do not own this order record",
      status: 403,
    };
  }

  order.status = "cancelled";

  revalidatePath("/checkout");
  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/kitchen");

  return {
    success: true,
    message: "Order cancelled successfully",
    order,
  };
}

/**
 * Server action for kitchen staff to update order status.
 */
export async function updateOrderStatus(previousState, formData) {
  const session = await getSession();
  if (!session || session.role !== "staff") {
    return {
      success: false,
      error: "Forbidden: Staff role required to update kitchen orders",
      status: 403,
    };
  }

  let orderId, status;
  if (formData instanceof FormData) {
    orderId = formData.get("orderId");
    status = formData.get("status");
  } else if (typeof formData === "object" && formData !== null) {
    orderId = formData.orderId;
    status = formData.status;
  }

  const order = global._ordersStore.find((o) => o.id === orderId);
  if (!order) {
    return { success: false, error: "Order not found" };
  }

  order.status = status;

  revalidatePath("/kitchen");
  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);

  return { success: true, message: `Order status updated to ${status}`, order };
}
