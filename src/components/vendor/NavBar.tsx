"use client";
import React, { useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import { Button } from "@/components/vendor/ui/button";
import { Bell, User } from "lucide-react";
import { SidebarTrigger } from "@/components/vendor/CustomSidebar";
import { useShopDetails } from "@/hooks/vendor/useShopDetails";

// import LoginUserMenu from "./LoginUserMenu";
// import { FormFieldType } from "@/constants/formFieldType";
// import CustomFormField from "./CustomFormField";

// const menuItems = [
//   { name: "Home", href: "/" },
//   { name: "Products", href: "/products" },
//   { name: "Shop", href: "/shop" },
//   {
//     name: "About Us",
//     href: "#",
//     submenu: [
//       { name: "Profile", href: "/profile" },
//       { name: "Orders", href: "/orders" },
//       { name: "Settings", href: "/settings" },
//     ],
//   },
//   {
//     name: "Contact Us",
//     href: "#",
//     submenu: [
//       { name: "Support", href: "/support" },
//       { name: "FAQ", href: "/faq" },
//     ],
//   },
// ];

const NavBar = () => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [, /* activeItem */ setActiveItem] = useState<string | null>(null);
  
  const { data: shopDetails } = useShopDetails();
  const shopName = shopDetails?.shops?.[0]?.name || "Shop";

  // const { data: user } = useProfile();

  // console.log("user", user);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveItem(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // const toggleDropdown = (itemName: string) => {
  //   setActiveItem(activeItem === itemName ? null : itemName);
  // };

  return (
    <div
      className="fixed top-0 left-0 md:left-64 right-0 px-4 sm:px-8 lg:px-[50px] z-20 bg-white xl:z-50"
      ref={menuRef}
    >
      <div className="flex w-full items-center justify-between py-2 sm:py-3.5">
        {/* Mobile layout */}
        <div className="flex items-center justify-between w-full md:hidden">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <Button className="h-8 w-8 cursor-pointer rounded-full border-[1.52px] border-[#656565] bg-[#FFFFFF] text-[#656565] hover:bg-[#f6f6f1] p-0">
              <Bell className="w-4 h-4" />
            </Button>
            <div className="bg-primary flex items-center gap-1 rounded-[39px] px-3 py-2 text-[#FFFFFF] cursor-pointer">
              <User className="w-4 h-4" />
              <span className="text-xs font-medium">{shopName}</span>
            </div>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:flex w-full items-center justify-between">
          <div className="flex-1 max-w-xl mr-4">
            <SearchBar />
          </div>
          <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
            <Button className="h-[41.6px] w-[50.6px] cursor-pointer rounded-[59.09px] border-[1.52px] border-[#656565] bg-[#FFFFFF] text-[#656565] hover:bg-[#f6f6f1] p-0">
              <Bell className="w-5 h-5" />
            </Button>
            <div className="bg-primary flex items-center gap-2 rounded-[39px] px-4 lg:px-8 py-3 lg:py-4 text-[#FFFFFF] cursor-pointer">
              <User className="w-5 h-5 lg:w-6 lg:h-6" />
              <span className="text-xs lg:text-sm font-medium">{shopName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
