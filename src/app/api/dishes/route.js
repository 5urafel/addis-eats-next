import { NextResponse } from "next/server";

export const dishes = [
  {
    id: "doro-wat",
    name: "Doro Wat",
    category: "Habesha Specials",
    description: "Authentic Ethiopian chicken stew cooked with berbere and boiled egg.",
    price: 15.99,
    image: "/images/doro-wat.jpg",
    spicy: true,
    vegan: false,
    rating: 5.0,
  },
  {
    id: "special-tibs",
    name: "Special Tibs",
    category: "Tibs",
    description: "Sautéed beef cooked with onions, garlic, rosemary, and jalapeños.",
    price: 18.50,
    image: "/images/special-tibs.jpg",
    spicy: true,
    vegan: false,
    rating: 4.9,
  },
  {
    id: "beyaynetu",
    name: "Beyaynetu",
    category: "Habesha Specials",
    description: "Vibrant combination platter of assorted vegetarian stews and lentils.",
    price: 14.00,
    image: "/images/beyaynetu.jpg",
    spicy: false,
    vegan: true,
    rating: 4.9,
  },
  {
    id: "kitfo",
    name: "Kitfo",
    category: "Habesha Specials",
    description: "Minced raw beef marinated in niter kibbeh and mitmita spice blend.",
    price: 17.50,
    image: "/images/special-tibs.jpg",
    spicy: true,
    vegan: false,
    rating: 4.8,
  },
  {
    id: "shiro-tagamino",
    name: "Shiro Tagamino",
    category: "Habesha Specials",
    description: "Slow-cooked spiced chickpea powder stew served hot in a clay pot.",
    price: 12.99,
    image: "/images/beyaynetu.jpg",
    spicy: false,
    vegan: true,
    rating: 4.9,
  },
  {
    id: "lamb-tibs",
    name: "Lamb Tibs",
    category: "Tibs",
    description: "Tender lamb chunks sautéed with onions, peppers, and Ethiopian spices.",
    price: 19.00,
    image: "/images/special-tibs.jpg",
    spicy: true,
    vegan: false,
    rating: 4.8,
  },
  {
    id: "sambusa",
    name: "Sambusa",
    category: "Fast Food",
    description: "Crispy pastry stuffed with spiced lentils, onions, and green peppers.",
    price: 4.50,
    image: "/images/doro-wat.jpg",
    spicy: false,
    vegan: true,
    rating: 4.7,
  },
  {
    id: "chechebsa",
    name: "Chechebsa",
    category: "Fast Food",
    description: "Shredded flatbread fried with honey and spiced spiced butter (kibbeh).",
    price: 8.99,
    image: "/images/doro-wat.jpg",
    spicy: false,
    vegan: false,
    rating: 4.6,
  },
  {
    id: "ethiopian-coffee",
    name: "Ethiopian Coffee",
    category: "Drinks",
    description: "Traditional freshly roasted and brewed Ethiopian coffee.",
    price: 3.50,
    image: "/images/doro-wat.jpg",
    spicy: false,
    vegan: true,
    rating: 5.0,
  },
  {
    id: "tej-wine",
    name: "Tej Honey Wine",
    category: "Drinks",
    description: "Traditional Ethiopian honey wine fermented with gesho leaves.",
    price: 6.00,
    image: "/images/doro-wat.jpg",
    spicy: false,
    vegan: false,
    rating: 4.8,
  },
  {
    id: "asa-tibs",
    name: "Asa Tibs",
    category: "Tibs",
    description: "Fried fish cubes seasoned with garlic, lemon, and Ethiopian spices.",
    price: 16.50,
    image: "/images/special-tibs.jpg",
    spicy: false,
    vegan: false,
    rating: 4.7,
  },
  {
    id: "gomen-wat",
    name: "Gomen Wat",
    category: "Habesha Specials",
    description: "Collard greens simmered with onions, garlic, and ginger.",
    price: 11.50,
    image: "/images/beyaynetu.jpg",
    spicy: false,
    vegan: true,
    rating: 4.8,
  },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");
  const category = searchParams.get("category");
  const dietary = searchParams.get("dietary");
  const sort = searchParams.get("sort");

  let filtered = [...dishes];

  // 1. Filter by category
  if (category && category !== "All") {
    filtered = filtered.filter((d) => d.category === category);
  }

  // 2. Filter by dietary requirement
  if (dietary && dietary !== "all") {
    if (dietary === "vegan") {
      filtered = filtered.filter((d) => d.vegan === true);
    } else if (dietary === "spicy") {
      filtered = filtered.filter((d) => d.spicy === true);
    }
  }

  // 3. Filter by search query
  if (search && search.trim() !== "") {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
    );
  }

  // 4. Sort results
  if (sort) {
    if (sort === "price-asc") {
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === "price-desc") {
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sort === "rating") {
      filtered.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
    } else if (sort === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  // If page/limit or search/filter query parameters are present, format response with pagination
  if (
    pageParam !== null ||
    limitParam !== null ||
    search !== null ||
    category !== null ||
    dietary !== null ||
    sort !== null
  ) {
    const page = Math.max(1, parseInt(pageParam || "1", 10));
    const limit = Math.max(1, parseInt(limitParam || "3", 10));
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedDishes = filtered.slice(startIndex, startIndex + limit);

    return NextResponse.json(
      {
        dishes: paginatedDishes,
        total,
        page,
        totalPages,
        limit,
        category: category || "All",
        dietary: dietary || "all",
        sort: sort || "default",
      },
      { status: 200 }
    );
  }

  return NextResponse.json(filtered, { status: 200 });
}
