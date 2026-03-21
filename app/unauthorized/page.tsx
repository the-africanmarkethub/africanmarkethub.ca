"use client";

import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { FaShieldAlt, FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  
  const router = useRouter();
  const { clearAuth } = useAuthStore();
  
  const handleLogout = () => {
    clearAuth();
    router.replace("/login");
  }
  return (
    <div className="flex items-center justify-center min-h-screen px-6 bg-linear-to-br from-gray-50 via-white to-gray-100">
      <div className="w-full max-w-md p-10 text-center bg-white shadow-xl rounded-3xl animate-fadeIn">
        <div className="flex justify-center mb-6">
          <div className="p-6 bg-green-100 rounded-full">
            <FaShieldAlt className="text-hub-secondary" size={60} />
          </div>
        </div>

        <h1 className="mb-4 text-3xl font-bold text-gray-800">Access Denied</h1>

        <p className="mb-8 leading-relaxed text-gray-600">
          You don't have permission to view this page.
          <br />
          Please make sure you're logged in with the correct role.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 btn btn-primary"
          >
            <FaArrowLeft size={16} />
            Go Back Home
          </Link>

          <button onClick={handleLogout} 
           className="btn btn-gray">
            Login with another account
          </button>
        </div>
      </div>
    </div>
  );
}
