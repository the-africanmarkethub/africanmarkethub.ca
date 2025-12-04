"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartItems } from "@/hooks/useCart";
import { useProductSearch } from "@/hooks/useProductSearch";
import { useDebounce } from "@/hooks/useDebounce";
import { CategoriesDropdown } from "./CategoriesDropdown";
import toast from "react-hot-toast";

export function Header() {
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  // Debounce search query to avoid too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Get cart items only if user is logged in
  const { data: cartData } = useCartItems();

  // Get search results
  const { data: searchResults, isLoading: isSearching } = useProductSearch({
    query: debouncedSearchQuery,
    page: 1,
    per_page: 5,
  });

  useEffect(() => {
    // Check for user in localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Show/hide search results based on query and results
    if (debouncedSearchQuery && searchResults?.data?.data) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  }, [debouncedSearchQuery, searchResults]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setUser(null);
    setShowDropdown(false);
    router.push("/");
  };

  const handleSearchItemClick = (slug: string) => {
    setSearchQuery("");
    setShowSearchResults(false);
    router.push(`/products/${slug}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handlePopularTagClick = (tag: string) => {
    setSearchQuery(tag);
    setShowSearchResults(false);
    router.push(`/search?q=${encodeURIComponent(tag)}`);
  };

  const handleSellWithUs = () => {
    const token = localStorage.getItem("auth_token");
    console.log(token);
    if (!token) {
      toast.error("Please login to create a vendor account");
      router.push("/auth/login");
    } else {
      router.push("/vendor/create-shop");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2 md:py-4">
          <Link href="/">
            <Image
              src="/icon/logo.svg"
              alt="African Market Hub"
              width={200}
              height={67}
              className="h-8 md:h-12 w-auto"
            />
          </Link>

          {/* Search Bar - Hidden on mobile, shown on tablet+ */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form
              onSubmit={handleSearchSubmit}
              className="relative group w-full"
              ref={searchRef}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                className="block text-[#000000] w-full pl-10 pr-3 py-3 border border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:border-[#F28C0D]"
              />

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                  {isSearching ? (
                    <div className="p-4 text-center">
                      <div className="inline-flex items-center">
                        <svg
                          className="animate-spin h-5 w-5 text-gray-400 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span className="text-gray-600">Searching...</span>
                      </div>
                    </div>
                  ) : searchResults?.data?.data &&
                    searchResults.data.data.length > 0 ? (
                    <>
                      <div className="p-2">
                        {searchResults.data.data.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => handleSearchItemClick(product.slug)}
                            className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                          >
                            <div className="w-12 h-12 mr-3 flex-shrink-0">
                              <Image
                                src={
                                  product.images[0] || "/icon/placeholder.svg"
                                }
                                alt={product.title}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {product.title}
                              </p>
                              <p className="text-sm text-gray-500">
                                ${product.sales_price}
                                {product.regular_price !==
                                  product.sales_price && (
                                  <span className="line-through ml-2 text-gray-400">
                                    ${product.regular_price}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {searchResults.data.total >
                        searchResults.data.data.length && (
                        <div className="p-3 bg-gray-50 text-center border-t">
                          <button
                            type="submit"
                            className="text-sm text-[#F28C0D] hover:opacity-90 font-medium"
                          >
                            View all {searchResults.data.total} results
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No products found
                    </div>
                  )}
                </div>
              )}

              {/* Popular Search Tags - Only show when not searching */}
              {!searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200">
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Popular Search
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Fashion",
                        "Electronics",
                        "Food & Drink",
                        "Arts & Crafts",
                        "Traditional",
                        "Accessories",
                      ].map((tag, index) => (
                        <span
                          key={index}
                          onClick={() => handlePopularTagClick(tag)}
                          className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 cursor-pointer"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search icon for mobile */}
            <button className="md:hidden p-2 text-gray-600 hover:text-[#F28C0D] transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {user ? (
              // User is logged in - show user dropdown
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="hidden sm:flex items-center space-x-2 text-white px-4 md:px-6 py-2 rounded-full font-medium transition-colors hover:opacity-90 text-sm"
                  style={{ backgroundColor: "#F28C0D" }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <span>
                    {user.name} {user.last_name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                          <Image
                            src={user.profile_photo || "/icon/auth.svg"}
                            alt={`${user.name} ${user.last_name}`}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name} {user.last_name}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        href="/customer/account"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <svg
                          className="w-4 h-4 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Account Overview
                      </Link>

                      <Link
                        href="/customer/orders"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <svg
                          className="w-4 h-4 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                        Orders
                      </Link>

                      <Link
                        href="/customer/wishlist"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <svg
                          className="w-4 h-4 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        Wishlist
                      </Link>

                      <Link
                        href="/customer/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <svg
                          className="w-4 h-4 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Account Setting
                      </Link>

                      <Link
                        href="/customer/support"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <svg
                          className="w-4 h-4 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25zM8.25 12l7.5 0"
                          />
                        </svg>
                        Customer Support
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <svg
                          className="w-4 h-4 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // User not logged in - show sign in button
              <Link href="/auth/login" className="hidden sm:block">
                <button
                  className="text-white px-4 md:px-6 py-2 rounded-full font-medium transition-colors hover:opacity-90 text-sm"
                  style={{ backgroundColor: "#F28C0D" }}
                >
                  Sign in
                </button>
              </Link>
            )}

            <button className="hidden sm:block p-2 text-gray-600 hover:text-[#F28C0D] transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5 5l-5-5h5V3h5v14z"
                />
              </svg>
            </button>

            <Link href="/cart">
              <button className="flex items-center space-x-1 md:space-x-2 text-gray-600 hover:text-[#F28C0D] transition-colors relative">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                  />
                </svg>
                <span className="hidden sm:inline">Cart</span>

                {/* Cart Count Badge */}
                {cartData?.data && cartData.data.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#F28C0D] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {cartData.data.length}
                  </span>
                )}
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div style={{ backgroundColor: "#F28C0D" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-2 text-white">
              <CategoriesDropdown />
            </div>

            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-white">
              <Link
                href="/"
                className="hover:text-[#FFE5CC] transition-colors text-sm xl:text-base"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="hover:text-[#FFE5CC] transition-colors text-sm xl:text-base"
              >
                Product
              </Link>
              <Link
                href="/services"
                className="hover:text-[#FFE5CC] transition-colors text-sm xl:text-base"
              >
                Service
              </Link>
              <a
                href="/footer/about"
                className="hover:text-[#FFE5CC] transition-colors text-sm xl:text-base"
              >
                About us
              </a>
              <a
                href="#"
                className="hover:text-[#FFE5CC] transition-colors text-sm xl:text-base"
              >
                Contact us
              </a>
            </nav>

            <button
              onClick={handleSellWithUs}
              className="bg-white px-3 md:px-6 py-2 rounded-full font-medium hover:bg-gray-50 transition-colors text-sm md:text-base"
              style={{ color: "#F28C0D" }}
            >
              <span className="hidden sm:inline">Sell with us</span>
              <span className="sm:hidden">Sell</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:border-[#F28C0D]"
            />
          </form>

          {/* Mobile Search Results */}
          {showSearchResults && (
            <div className="mt-3 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center">
                  <span className="text-gray-600">Searching...</span>
                </div>
              ) : searchResults?.data?.data &&
                searchResults.data.data.length > 0 ? (
                searchResults.data.data.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSearchItemClick(product.slug)}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                  >
                    <div className="w-10 h-10 mr-3">
                      <Image
                        src={product.images[0] || "/icon/placeholder.svg"}
                        alt={product.title}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {product.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        ${product.sales_price}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No products found
                </div>
              )}
            </div>
          )}

          {/* Popular Search Tags for Mobile */}
          {!searchQuery && (
            <div className="mt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Popular Search
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Fashion",
                  "Electronics",
                  "Food & Drink",
                  "Arts & Crafts",
                ].map((tag, index) => (
                  <span
                    key={index}
                    onClick={() => handlePopularTagClick(tag)}
                    className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
