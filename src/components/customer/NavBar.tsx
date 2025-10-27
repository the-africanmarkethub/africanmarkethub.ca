"use client";
import React, { useEffect, useRef, useState } from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Image from "next/image";
import SearchBar from "./SearchBar";
import { Button } from "@/components/ui/button";
import {
  Bell,
  ShoppingCart,
  User,
  LogOut,
  Clock,
  Package,
  Heart,
  Settings,
  HelpCircle,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Shirt,
  Apple,
  Palette,
  Briefcase,
  Wrench,
  Home,
  Star,
  Grid3X3,
} from "lucide-react";
import { useGetProfile } from "@/hooks/customer/useGetProfile";
import Link from "next/link";
import CategoriesPopover from "./CategoriesPopover";
import useCategories from "@/hooks/customer/useCategories";
import SubmitButton from "./SubmitButton";
import { useCart } from "@/contexts/customer/CartContext";
import { toast } from "sonner";
import { useLogout } from "@/hooks/customer/useLogout";

import {
  NavigationMenu,
  // NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
// import { FormFieldType } from "@/constants/formFieldType";
// import CustomFormField from "./CustomFormField";

const menuItems = [
  { name: "Home", href: "/" },
  { name: "Product", href: "/customer/products" },
  { name: "Shop", href: "/customer/shops" },
  { name: "Services", href: "/customer/services" },
  {
    name: "About Us",
    href: "#",
    submenu: [
      { name: "Profile", href: "/profile" },
      { name: "Orders", href: "/orders" },
      { name: "Settings", href: "/settings" },
    ],
  },
  {
    name: "Contact Us",
    href: "#",
    submenu: [
      { name: "Support", href: "account/support" },
      { name: "FAQ", href: "/faq" },
    ],
  },
];

const NavBar = () => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const { data: profile, isLoading: profileLoading } = useGetProfile();
  const { data: categories } = useCategories();
  const { cartItems } = useCart();
  const { logout } = useLogout();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveItem(null);
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (itemName: string) => {
    setActiveItem(activeItem === itemName ? null : itemName);
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    toast.success("Logging out...");
    logout(); // Use the unified logout function
  };

  return (
    <div className="w-full fixed  w-screen-xl top-0 left-0 z-50" ref={menuRef}>
      <div className="flex w-full md:px-[60px] lg:px-[100px] items-center justify-between py-2 md:py-3.5 bg-white h-12 md:h-auto">
        {/* Mobile Layout */}
        <div className="flex lg:hidden items-center justify-between w-full">
          {/* Hamburger Menu */}
          <Button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="bg-transparent text-black hover:bg-gray-100 p-1"
          >
            <Menu width={20} height={20} />
          </Button>

          {/* Logo */}
          <Link href="/customer">
            <Image
              src="/img/African Market Hub.svg"
              width={100}
              height={28}
              alt="logo"
            />
          </Link>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            {profile?.data ? (
              <Button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="bg-transparent text-black hover:bg-gray-100 p-1"
              >
                <User width={18} height={18} />
              </Button>
            ) : (
              <Link href="/sign-in">
                <Button className="bg-transparent text-black hover:bg-gray-100 p-1">
                  <User width={18} height={18} />
                </Button>
              </Link>
            )}

            <Link href="/customer/cart">
              <Button className="bg-transparent text-black hover:bg-gray-100 p-1 relative">
                <ShoppingCart width={18} height={18} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between w-full">
          <div className="flex items-center gap-[120px] w-full">
            <Link href="/">
              <Image
                src="/img/African Market Hub.svg"
                width={142}
                height={36}
                alt="logo"
              />
            </Link>

            <SearchBar />
          </div>

          <div className="flex justify-between items-center gap-4">
            {profile?.data ? (
              // User is logged in - show profile menu
              <div className="relative">
                <Button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-[186px] h-14 rounded-[39px] font-semibold cursor-pointer bg-primary text-white hover:bg-primary/90"
                >
                  <User width={24} height={24} className="mr-2" />
                  {profileLoading
                    ? "Loading..."
                    : profile?.data?.name || "Profile"}
                </Button>

                {showUserMenu && (
                  <div className="absolute top-full -right-20 mt-2 w-[340px] bg-white rounded-lg shadow-xl z-50 border border-gray-200">
                    {/* User Profile Header */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                          <User width={20} height={20} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900">
                            {profile?.data?.name || profile?.data?.first_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {profile?.data?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        href="/customer/account/overview"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Clock
                          width={18}
                          height={18}
                          className="text-gray-500"
                        />
                        Account Overview
                      </Link>
                      <Link
                        href="account/orders"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Package
                          width={18}
                          height={18}
                          className="text-gray-500"
                        />
                        Orders
                      </Link>
                      <Link
                        href="/customer/wishlist"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Heart
                          width={18}
                          height={18}
                          className="text-gray-500"
                        />
                        Wishlist
                      </Link>
                      <Link
                        href="/customer/account/settings"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings
                          width={18}
                          height={18}
                          className="text-gray-500"
                        />
                        Account Setting
                      </Link>
                      <Link
                        href="/customer/account/support"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <HelpCircle
                          width={18}
                          height={18}
                          className="text-gray-500"
                        />
                        Customer Support
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-200 py-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut width={18} height={18} />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // User is not logged in - show sign up button
              <Link href="/sign-in">
                <SubmitButton className="w-[186px] h-14 rounded-[39px] font-semibold cursor-pointer">
                  <User width={24} height={24} />
                  Sign In
                </SubmitButton>
              </Link>
            )}

            <Button className="bg-[#FFFFFF] text-[#656565] border-[1.52px] border-[#656565] w-[50.6px] hover:bg-[#f6f6f1] h-[41.6px] rounded-[59.09px] cursor-pointer">
              <Bell width={20} height={20} />
            </Button>

            <Link href="/customer/cart">
              <Button className="w-[95px] h-[40px] rounded-[39px] bg-[#F8F8F8] border border-[#FFFBED] relative">
                <div className="bg-primary py-1.5 px-3 rounded-4xl">
                  <ShoppingCart width={16} height={16} className="text-white" />
                </div>
                <span className="text-[#292929] font-medium ml-2">Cart</span>
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 top-[48px] bg-black bg-opacity-50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Sidebar Menu */}
          <div className="lg:hidden fixed left-0 top-[48px] w-[288px] h-[calc(100vh-48px)] bg-white z-50 overflow-y-auto shadow-lg">
            <div className="px-4 py-4">
              {/* Header with Close */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                <Image
                  src="/img/African Market Hub.svg"
                  width={120}
                  height={32}
                  alt="logo"
                />
                <Button
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-transparent text-gray-600 hover:bg-gray-100 p-1"
                >
                  <X width={20} height={20} />
                </Button>
              </div>

              {/* All Category Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-900">
                    All Category
                  </h3>
                  <button
                    onClick={() => setShowAllCategories(!showAllCategories)}
                    className="text-sm text-primary hover:text-primary-dark"
                  >
                    {showAllCategories ? "Show Less" : "See All"}
                  </button>
                </div>

                <div className="space-y-1">
                  {categories &&
                    Array.isArray(categories) &&
                    categories
                      .filter((cat) => cat.parent_id === null)
                      .slice(0, showAllCategories ? undefined : 5)
                      .map((category, index: number) => {
                        // Define colors and icons for categories
                        const categoryStyles = [
                          {
                            bg: "bg-pink-100",
                            icon: Shirt,
                            color: "text-pink-600",
                          },
                          {
                            bg: "bg-orange-100",
                            icon: Apple,
                            color: "text-orange-600",
                          },
                          {
                            bg: "bg-purple-100",
                            icon: Palette,
                            color: "text-purple-600",
                          },
                          {
                            bg: "bg-blue-100",
                            icon: Briefcase,
                            color: "text-blue-600",
                          },
                          {
                            bg: "bg-green-100",
                            icon: Wrench,
                            color: "text-green-600",
                          },
                          {
                            bg: "bg-yellow-100",
                            icon: Home,
                            color: "text-yellow-600",
                          },
                          {
                            bg: "bg-red-100",
                            icon: Star,
                            color: "text-red-600",
                          },
                          {
                            bg: "bg-gray-100",
                            icon: Grid3X3,
                            color: "text-gray-600",
                          },
                        ];

                        const style =
                          categoryStyles[index % categoryStyles.length];
                        const IconComponent = style.icon;
                        const hasChildren =
                          category.children && category.children.length > 0;
                        const isExpanded = expandedCategory === category.id;

                        return (
                          <div key={category.id}>
                            {/* Parent Category */}
                            <div className="flex items-center gap-3 py-3 px-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                              {category.image ? (
                                <div className="w-5 h-5 rounded overflow-hidden">
                                  <Image
                                    src={category.image}
                                    alt={category.name}
                                    width={20}
                                    height={20}
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div
                                  className={`w-5 h-5 ${style.bg} rounded flex items-center justify-center`}
                                >
                                  <IconComponent
                                    width={12}
                                    height={12}
                                    className={style.color}
                                  />
                                </div>
                              )}

                              <Link
                                href={`/products/category/${category.id}?name=${encodeURIComponent(category.name)}`}
                                className="flex-1"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {category.name}
                              </Link>

                              {hasChildren && (
                                <button
                                  onClick={() =>
                                    setExpandedCategory(
                                      isExpanded ? null : category.id
                                    )
                                  }
                                  className="p-1 hover:bg-gray-200 rounded"
                                >
                                  {isExpanded ? (
                                    <ChevronDown
                                      width={16}
                                      height={16}
                                      className="text-gray-500"
                                    />
                                  ) : (
                                    <ChevronRight
                                      width={16}
                                      height={16}
                                      className="text-gray-500"
                                    />
                                  )}
                                </button>
                              )}
                            </div>

                            {/* Subcategories */}
                            {hasChildren && isExpanded && category.children && (
                              <div className="ml-8 space-y-1 pb-2">
                                {category.children.map((subCategory) => (
                                  <Link
                                    key={subCategory.id}
                                    href={`/products/category/${subCategory.id}?name=${encodeURIComponent(subCategory.name)}`}
                                    className="block py-2 px-3 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {subCategory.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                </div>
              </div>

              {/* Accounts Section */}
              {profile?.data && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Accounts
                  </h3>
                  <div className="space-y-1">
                    <Link
                      href="/customer/account/overview"
                      className="flex items-center gap-3 py-3 px-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Clock width={18} height={18} className="text-gray-500" />
                      Account Overview
                    </Link>

                    <Link
                      href="/customer/account/orders"
                      className="flex items-center gap-3 py-3 px-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Package
                        width={18}
                        height={18}
                        className="text-gray-500"
                      />
                      Orders
                    </Link>

                    <Link
                      href="/customer/account/notifications"
                      className="flex items-center gap-3 py-3 px-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Bell width={18} height={18} className="text-gray-500" />
                      Notifications
                    </Link>

                    <Link
                      href="/customer/account/address"
                      className="flex items-center gap-3 py-3 px-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings
                        width={18}
                        height={18}
                        className="text-gray-500"
                      />
                      Address
                    </Link>

                    <Link
                      href="/customer/account/payment"
                      className="flex items-center gap-3 py-3 px-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Package
                        width={18}
                        height={18}
                        className="text-gray-500"
                      />
                      Payment Method
                    </Link>

                    <Link
                      href="/customer/account/settings"
                      className="flex items-center gap-3 py-3 px-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings
                        width={18}
                        height={18}
                        className="text-gray-500"
                      />
                      Account Setting
                    </Link>

                    <Link
                      href="/customer/account/refer"
                      className="flex items-center gap-3 py-3 px-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User width={18} height={18} className="text-gray-500" />
                      Refer & Earn
                    </Link>
                  </div>
                </div>
              )}

              {/* Wishlist - Available for both logged in and guest users */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  General
                </h3>
                <div className="space-y-1">
                  <Link
                    href="/customer/wishlist"
                    className="flex items-center gap-3 py-3 px-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Heart width={18} height={18} className="text-gray-500" />
                    Wishlist
                  </Link>

                  {!profile?.data && (
                    <Link
                      href="/sign-in"
                      className="flex items-center gap-3 py-3 px-2 text-sm text-primary hover:bg-primary/10 rounded-lg border border-primary/20"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User width={18} height={18} className="text-primary" />
                      Sign In
                    </Link>
                  )}
                </div>
              </div>

              {/* Other Links */}
              <div className="mb-6">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    About Us
                  </h3>
                  <button
                    className="block w-full text-left py-3 px-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                    onClick={() => {
                      const token = localStorage.getItem("accessToken");
                      if (token) {
                        // Customer is logged in, can create shop (which converts them to vendor)
                        window.location.href = "/vendor/create-shop";
                      } else {
                        // Customer not logged in, just show toast
                        toast.error(
                          "Please login as a customer first to create your shop"
                        );
                      }
                    }}
                  >
                    Sell with Us
                  </button>
                  <Link
                    href="/contact"
                    className="block py-3 px-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact Us
                  </Link>
                </div>
              </div>

              {/* Logout */}
              {profile?.data && (
                <div className="border-t border-gray-200 pt-4">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full py-3 px-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <LogOut width={18} height={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <div className="bg-primary hidden md:flex">
        <div className="flex justify-between  md:px-[60px] lg:px-[100px] w-full items-center">
          <CategoriesPopover />

          <div className="relative">
            <NavigationMenu>
              <NavigationMenuList>
                {menuItems.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    {item.submenu ? (
                      <>
                        <NavigationMenuTrigger
                          // onClick={() => toggleDropdown(item.name)}
                          onMouseEnter={() => toggleDropdown(item.name)}
                          // onMouseLeave={() => setActiveItem(null)}
                          className="text-[#FFFFFF] bg-primary"
                        >
                          {item.name}
                        </NavigationMenuTrigger>

                        {/* <NavigationMenuContent>
                          <ul className="w-[200px] rounded-md">
                            {item.submenu.map((subItem) => (
                              <li key={subItem.name} className="row-span-1">
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={subItem.href}
                                    className="block p-2 hover:bg-gray-100 rounded text-gray-700"
                                  >
                                    {subItem.name}
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent> */}

                        {activeItem === item.name && (
                          <div className="absolute top-full left-0 mt-1 w-[200px] bg-white rounded-md shadow-lg z-50">
                            {item.submenu.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="block p-2 hover:bg-gray-100 text-gray-700"
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link href={item.href} legacyBehavior passHref>
                        <NavigationMenuLink
                          className={`${navigationMenuTriggerStyle()} bg-primary text-[#FFFFFF]`}
                        >
                          {item.name}
                        </NavigationMenuLink>
                      </Link>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <Button
            className="bg-[#FFFFFF] my-2 border border-[#9C5432] rounded-4xl text-[#292929]"
            onClick={() => {
              const token = localStorage.getItem("accessToken");
              if (token) {
                // Customer is logged in, can create shop (which converts them to vendor)
                window.location.href = "/vendor/create-shop";
              } else {
                // Customer not logged in, just show toast
                toast.error(
                  "Please login as a customer first to create your shop"
                );
              }
            }}
          >
            Sell with us
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
