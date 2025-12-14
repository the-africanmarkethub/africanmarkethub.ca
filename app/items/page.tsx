"use client";

import { Suspense } from "react";
import Items from "./Items";
interface CategoryPageProps {
  params: { slug: string };
}
export default function Page({ params }: CategoryPageProps) {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <Items params={params} />
    </Suspense>
  );
}
