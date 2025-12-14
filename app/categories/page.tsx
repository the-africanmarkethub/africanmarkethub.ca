"use client";

import { Suspense } from "react";
import CategoriesPageContent from "./ContentPage";

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoriesPageContent />
    </Suspense>
  );
}
