import DishCard from "./DishCard";

export default function DishList({ dishes = [] }) {
  const displayDishes = dishes.length > 0 ? dishes : [
    { id: "doro-wat", name: "Doro Wat", category: "Habesha Specials", description: "Authentic Ethiopian delicacy prepared fresh.", price: 15.99, image: "/images/doro-wat.jpg" },
    { id: "special-tibs", name: "Special Tibs", category: "Tibs", description: "Sautéed beef with onions, garlic, and spices.", price: 18.50, image: "/images/special-tibs.jpg" },
    { id: "beyaynetu", name: "Beyaynetu", category: "Habesha Specials", description: "Combination platter of various vegetarian stews.", price: 14.00, image: "/images/beyaynetu.jpg" },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        Featured Dishes
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayDishes.map((dish, index) => (
          <DishCard
            key={dish.id}
            dish={dish}
            priority={index === 0}
          />
        ))}
      </div>
    </div>
  );
}
