import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const popularSearches = [
    "Fashion",
    "Electronics",
    "Shoes",
    "Bags",
    "Watches",
  ];

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setTimeout(() => setShowDropdown(false), 100); // Delay to prevent closing before onFocus
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-[612px]" ref={searchRef}>
      <div
        className={`flex items-center border rounded-[16px] px-3 sm:px-4 w-full shadow-sm bg-white transition-all duration-200 ${
          showDropdown || query ? "border-[#F28C0D]" : "border-gray-300"
        }`}
      >
        <div className="flex justify-center items-center bg-[#FBF7F1] h-8 w-8 rounded-full">
          <Search className="w-5 h-5 text-primary" />
        </div>
        <input
          type="text"
          placeholder="Search by"
          className="ml-2 rounded-2xl w-full h-12 sm:h-16 outline-none bg-transparent text-sm sm:text-base"
          value={query}
          onFocus={() => setShowDropdown(true)}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {showDropdown && (
        <div className="absolute left-0 mt-2 w-full bg-white shadow-lg rounded-lg border z-50 p-3 sm:p-4">
          <p className="text-gray-600 text-xs sm:text-sm mb-2">Popular Search</p>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {popularSearches.map((item, index) => (
              <button
                key={index}
                className="px-2 sm:px-3 py-1 border rounded-full text-xs sm:text-base text-[#292929] hover:bg-gray-100"
                onClick={() => {
                  setQuery(item);
                  setShowDropdown(false);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
