"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VendorRootPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to vendor overview
    router.push("/vendor/overview");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">Redirecting...</div>
    </div>
  );
}
