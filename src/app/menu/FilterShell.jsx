"use client";

import { Suspense } from "react";
import CategoryBar from "./CategoryBar";

function FilterShellContent({ children }) {
  return (
    <div className="space-y-4">
      {/* Horizontal Centered Category Pills */}
      <div className="w-full flex justify-center">
        <CategoryBar />
      </div>

      {/* Main Catalog View */}
      <div className="w-full pt-1">{children}</div>
    </div>
  );
}

export default function FilterShell({ children }) {
  return (
    <Suspense fallback={<div className="animate-pulse py-8 text-center text-xs text-stone-400">Loading filters...</div>}>
      <FilterShellContent>{children}</FilterShellContent>
    </Suspense>
  );
}
