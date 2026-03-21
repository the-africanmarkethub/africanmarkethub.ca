"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import {
  LuLogOut,
  LuMenu,
  LuSettings,
  LuPackage,
  LuBriefcase,
  LuPhoneCall
} from "react-icons/lu";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { NotificationMenu } from "./NotificationMenu";

export function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  if (!user) return null;

  const handleLogout = () => {
    clearAuth();
    router.replace("/");
  };

  const userName = user?.name || user?.email || "Seller";

  return (
    <header className="sticky top-0 z-30 flex items-center h-16 px-3 font-sans bg-white border-b border-zinc-200">
      <button
        onClick={toggleSidebar}
        className="mr-2 text-zinc-600 md:hidden focus:outline-none p-1.5 hover:bg-zinc-50 rounded-lg"
      >
        <LuMenu className="w-6 h-6" />
      </button>

      <div className="flex-1 hidden md:block"></div>

     <nav className="flex items-center flex-1 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex items-center px-2 space-x-4 md:space-x-6">
          <Link
            href="/items?type=products"
            target="_blank"
            className="flex items-center text-[10px] font-semibold transition-colors md:text-sm text-zinc-700 hover:text-emerald-600 whitespace-nowrap"
          >
            <LuPackage className="w-4 h-4 mr-1 md:mr-1.5 text-zinc-400" />
            Products
          </Link>
          <Link
            href="/items?type=services"
            target="_blank"
            className="flex items-center text-[10px] font-semibold transition-colors md:text-sm text-zinc-700 hover:text-emerald-600 whitespace-nowrap"
          >
            <LuBriefcase className="w-4 h-4 mr-1 md:mr-1.5 text-zinc-400" />
            Services
          </Link>
          <Link
            href="/help"
            className="flex items-center text-[10px] font-semibold transition-colors md:text-sm text-zinc-700 hover:text-emerald-600 whitespace-nowrap"
          >
            <LuPhoneCall className="w-4 h-4 mr-1 md:mr-1.5 text-zinc-400" />
            Need Help?
          </Link>
        </div>
      </nav>

      <div className="flex items-center pl-2 ml-auto space-x-2 border-l md:space-x-4 border-zinc-100 md:pl-4">
        <NotificationMenu />

        <Menu as="div" className="relative">
          <MenuButton className="flex items-center space-x-2 transition-colors duration-150 cursor-pointer rounded-xl focus:outline-none">
            <span className="hidden lg:block text-sm font-medium text-zinc-700 truncate max-w-[100px]">
              {userName}
            </span>
            <div className="relative">
              <Image
                src={user.profile_photo || "/default-avatar.png"}
                alt="User Avatar"
                width={34}
                height={34}
                className="object-cover border rounded-full border-zinc-200"
              />
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>
          </MenuButton>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <MenuItems className="absolute right-0 w-56 mt-2 overflow-hidden bg-white shadow-xl rounded-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-4 py-3 bg-zinc-50/50">
                <p className="text-sm font-bold truncate text-zinc-900">
                  {userName}
                </p>
                <p className="text-xs truncate text-zinc-500">{user.email}</p>
              </div>

              <div className="py-1">
                <MenuItem>
                  {({ active }) => (
                    <Link
                      href="/dashboard/account-settings"
                      className={`flex items-center px-4 py-2.5 text-sm ${active ? "bg-zinc-50 text-emerald-600" : "text-zinc-700"
                        }`}
                    >
                      <LuSettings className="w-4 h-4 mr-2" /> Profile Settings
                    </Link>
                  )}
                </MenuItem>
              </div>

              <div className="py-1 border-t border-zinc-100">
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`flex items-center w-full text-left px-4 py-2.5 text-sm cursor-pointer ${active ? "bg-red-50 text-red-600" : "text-red-500"
                        }`}
                    >
                      <LuLogOut className="w-4 h-4 mr-3" /> Log out
                    </button>
                  )}
                </MenuItem>
              </div>
            </MenuItems>
          </Transition>
        </Menu>
      </div>
    </header>
  );
}