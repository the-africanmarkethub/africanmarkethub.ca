"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LuLogOut } from "react-icons/lu";
import { useAuthStore } from "@/store/useAuthStore";
import { VENDOR_MENU } from "@/setting";
import Image from "next/image";

export function Sidebar({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) {
  const router = useRouter();
  const currentPath = usePathname();
  const { clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <>
      {/* 1. Mobile Backdrop (Overlay) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/10 blur-2xl md:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* 2. Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col
        transform transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:h-screen
      `}
      >
        {/* Logo Area */}
        <div className="flex items-center px-6 h-20 border-b border-gray-50">
          <Image
            width={120}
            height={40}
            src="/logo.svg"
            alt="logo"
            className="h-8 w-auto"
          />
        </div>

        {/* Navigation - flex-1 and overflow-y-auto ensures footer stays at bottom */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {VENDOR_MENU.map((item) => {
            const isActive = currentPath.startsWith(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                prefetch={true}
                onClick={() => {
                  if (window.innerWidth < 768) toggleSidebar();
                }}
                className={`
                flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all
                ${
                  isActive
                    ? "bg-orange-50 text-orange-800 shadow-sm shadow-orange-100/50"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
              >
                <item.icon
                  className={`w-5 h-5 mr-3 ${
                    isActive ? "text-orange-800" : "text-gray-400"
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 bg-gray-50/50 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
          >
            <LuLogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
