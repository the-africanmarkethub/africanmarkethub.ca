"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearch } from "@/hooks/useSearch";
import SearchResultsList from "./SearchResultsList";
import { useState, useRef, useEffect } from "react";

export default function DesktopSearch() {
  const { searchTerm, results, loading, isTouched, handleSearchChange } =
    useSearch();
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showResults = isFocused && (searchTerm.length > 0 || loading);

  return (
    <div className="hidden md:flex flex-1 mx-6 relative" ref={searchRef}>
      <div className="flex items-center w-full max-w-xl border border-orange-50 rounded-full px-4 py-2 bg-orange-200 shadow-sm">
        <MagnifyingGlassIcon className="w-5 h-5 text-yellow-900" />
        <input
          type="text"
          placeholder="Search for items..."
          className="flex-1 px-3 py-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setIsFocused(true)}
        />
      </div>

      {showResults && (
        <div className="absolute top-full left-0 w-full max-w-xl mt-2 bg-white shadow-lg rounded-lg z-50 max-h-64 overflow-y-auto border border-yellow-800">
          <SearchResultsList
            loading={loading}
            results={results}
            isTouched={isTouched}
            onItemClick={() => setIsFocused(false)}
          />
        </div>
      )}
    </div>
  );
}
