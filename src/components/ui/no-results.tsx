import React from "react";
import { Button } from "./button";

interface NoResultsProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  showGoBack?: boolean;
  showBrowseAll?: boolean;
  onGoBack?: () => void;
  onBrowseAll?: () => void;
  goBackText?: string;
  browseAllText?: string;
  className?: string;
}

export function NoResults({
  title = "No results found",
  message = "We couldn't find what you're looking for.",
  icon = "📦",
  showGoBack = true,
  showBrowseAll = true,
  onGoBack,
  onBrowseAll,
  goBackText = "Go Back",
  browseAllText = "Browse All",
  className = "",
}: NoResultsProps) {
  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      window.history.back();
    }
  };

  const handleBrowseAll = () => {
    if (onBrowseAll) {
      onBrowseAll();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div
      className={`w-full flex flex-col items-center justify-center ${className}`}
    >
      <div className="text-center">
        <div className="text-6xl mb-4">{icon}</div>
        <h3 className="text-sm md:text-xl font-medium md:font-semibold text-gray-700 mb-2">
          {title}
        </h3>
        <p className="text-gray-500 text-sm md:text-base mb-6">{message}</p>
        {(showGoBack || showBrowseAll) && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {showGoBack && (
              <Button
                onClick={handleGoBack}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                {goBackText}
              </Button>
            )}
            {showBrowseAll && (
              <Button
                onClick={handleBrowseAll}
                variant="outline"
                className="px-6 py-2 border text-sm md:text-base border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {browseAllText}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
