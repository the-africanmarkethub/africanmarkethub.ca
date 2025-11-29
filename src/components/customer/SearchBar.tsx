import { useState, useEffect, useRef } from "react";
import { Search, Loader2, Clock, ExternalLink } from "lucide-react";
import { useProductSearch } from "@/hooks/customer/useProductSearch";
import { useDebounce } from "@/hooks/customer/useDebounce";
import { NoResults } from "@/components/ui/no-results";
import Image from "next/image";
import Link from "next/link";

const RECENT_SEARCHES_KEY = "recent-searches";
const MAX_RECENT_SEARCHES = 5;

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);
  const searchMutation = useProductSearch();

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (error) {
          console.error("Error parsing recent searches:", error);
        }
      }
    }
  }, []);

  // Save search to recent searches
  const saveSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    const updated = [
      searchTerm,
      ...recentSearches.filter((s) => s !== searchTerm),
    ].slice(0, MAX_RECENT_SEARCHES);

    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  // Handle search selection
  const handleSearchSelect = (searchTerm: string) => {
    setQuery(searchTerm);
    saveSearch(searchTerm);
    setShowDropdown(false);
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveSearch(query.trim());
      searchMutation.mutate(query.trim());
    }
  };

  useEffect(() => {
    if (debouncedQuery) {
      searchMutation.mutate(debouncedQuery);
    }
  }, [debouncedQuery]);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const hasSearchResults =
    searchMutation.isSuccess && searchMutation.data.data.total > 0;
  const hasRecentSearches = recentSearches.length > 0;

  return (
    <div className="relative w-full" ref={searchRef}>
      <form onSubmit={handleSearchSubmit}>
        <div
          className={`flex items-center border rounded-[16px] px-4 w-full max-w-[620px] shadow-sm bg-white transition-all duration-200 ${
            showDropdown || query ? "border-[#F28C0D]" : "border-gray-300"
          }`}
        >
          <div className="flex justify-center items-center bg-[#FBF7F1] h-8 w-8 rounded-full">
            <Search className="w-5 h-5 text-primary" />
          </div>
          <input
            type="text"
            placeholder="Search by"
            className="ml-2 rounded-2xl w-full h-10 sm:h-16 outline-none bg-transparent"
            value={query}
            onFocus={handleInputFocus}
            onChange={(e) => setQuery(e.target.value)}
          />
          {searchMutation.isPending && (
            <Loader2 className="animate-spin w-5 h-5 text-gray-400" />
          )}
        </div>
      </form>

      {showDropdown && (
        <div className="absolute left-0 mt-2 w-full bg-white shadow-lg rounded-lg border z-50 p-4 max-h-96 overflow-y-auto">
          {/* Loading State */}
          {searchMutation.isPending && !searchMutation.data && (
            <div className="flex justify-center items-center p-4">
              <Loader2 className="animate-spin w-6 h-6 text-primary" />
              <span className="ml-2 text-gray-600">Searching...</span>
            </div>
          )}

          {/* Error State */}
          {searchMutation.isError && (
            <div className="text-center p-4">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 font-medium mb-1">Search failed</p>
              <p className="text-sm text-gray-400">
                {searchMutation.error?.response?.data?.message ||
                  "Please try again with different keywords"}
              </p>
            </div>
          )}

          {/* Search Results */}
          {hasSearchResults && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-gray-600 text-sm font-medium">
                  Found {searchMutation.data.data.total} result
                  {searchMutation.data.data.total !== 1 ? "s" : ""}
                </p>
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  className="text-primary text-sm hover:underline flex items-center gap-1"
                  onClick={() => setShowDropdown(false)}
                >
                  View All
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {searchMutation.data.data.data.slice(0, 5).map((product) => {
                  // Calculate display price - use first variation price if available, otherwise use product sales_price
                  const displayPrice =
                    product.variations && product.variations.length > 0
                      ? product.variations[0].price
                      : product.sales_price;

                  const regularPrice = parseFloat(product.regular_price);
                  const salesPrice = parseFloat(displayPrice);
                  const discountPercentage =
                    regularPrice > salesPrice
                      ? Math.round(
                          ((regularPrice - salesPrice) / regularPrice) * 100
                        )
                      : 0;

                  return (
                    <Link
                      href={`/products/${product.slug}`}
                      key={product.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => {
                        setShowDropdown(false);
                        saveSearch(query);
                      }}
                    >
                      <div className="relative">
                        <Image
                          src={product.images[0] || "/assets/default.png"}
                          alt={product.title}
                          width={48}
                          height={48}
                          className="rounded-md object-cover"
                        />
                        {discountPercentage > 0 && (
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded">
                            -{discountPercentage}%
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {product.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-primary font-semibold">
                            ${displayPrice}
                          </span>
                          {regularPrice > salesPrice && (
                            <span className="text-gray-400 text-xs line-through">
                              ${product.regular_price}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {product.views} views
                          </span>
                          {product.average_rating > 0 && (
                            <span className="text-xs text-yellow-600">
                              ⭐ {product.average_rating}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {searchMutation.data.data.total > 5 && (
                <div className="pt-2 border-t">
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    className="text-primary text-sm hover:underline flex items-center justify-center gap-1"
                    onClick={() => setShowDropdown(false)}
                  >
                    View {searchMutation.data.data.total - 5} more results
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* No Results */}
          {searchMutation.isSuccess &&
            searchMutation.data.data.total === 0 &&
            query && (
              <NoResults
                title={searchMutation.data.message || "Search not found"}
                message={`No products found for "${query}"`}
                icon="🔍"
                showGoBack={false}
                showBrowseAll={false}
                className="p-4"
              />
            )}

          {/* Recent Searches */}
          {!query && hasRecentSearches && (
            <div>
              <div className="text-gray-600 text-sm mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((searchTerm, index) => (
                  <button
                    key={index}
                    className="px-3 py-1 border rounded-full text-base text-[#292929] hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => handleSearchSelect(searchTerm)}
                  >
                    <Search className="w-3 h-3" />
                    {searchTerm}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Searches (Fallback) */}
          {!query && !hasRecentSearches && (
            <div>
              <p className="text-gray-600 text-sm mb-2">Suggested Searches</p>
              <div className="flex flex-wrap gap-2">
                {["Fashion", "Electronics", "Shoes", "Bags", "Watches"].map(
                  (item, index) => (
                    <button
                      key={index}
                      className="px-3 py-1 border rounded-full text-base text-[#292929] hover:bg-gray-100"
                      onClick={() => handleSearchSelect(item)}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
