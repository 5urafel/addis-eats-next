import { NextResponse } from "next/server";

const dishes = [
  {
    id: "doro-wat",
    name: "Doro Wat",
    category: "Habesha Specials",
    description: "Authentic Ethiopian delicacy prepared fresh.",
    price: 15.99,
    image: "/images/doro-wat.jpg",
  },
  {
    id: "special-tibs",
    name: "Special Tibs",
    category: "Tibs",
    description: "Sautéed beef with onions, garlic, and spices.",
    price: 18.50,
    image: "/images/special-tibs.jpg",
  },
  {
    id: "beyaynetu",
    name: "Beyaynetu",
    category: "Habesha Specials",
    description: "Combination platter of various vegetarian stews.",
    price: 14.00,
    image: "/images/beyaynetu.jpg",
  },
];

export async function GET(request, context) {
  const params = await context.params;
  const { id } = params || {};

  const dish = dishes.find((d) => d.id === id);

  if (!dish) {
    return NextResponse.json(
      { error: "Dish not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(dish, { status: 200 });
}
