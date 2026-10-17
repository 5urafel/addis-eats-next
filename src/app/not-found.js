import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h2>404 - Dish or Page Not Found</h2>
      <p>The dish or route you requested could not be found.</p>
      <Link href="/menu">Back to Menu</Link>
    </div>
  );
}
