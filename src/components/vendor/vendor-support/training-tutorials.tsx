"use client";

import TutorialCard from "./product-feature-card";
import { useTutorials } from "@/hooks/vendor/useTutorials";

// Helper function to strip HTML tags and get clean text
const stripHtml = (html: string) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

// Helper function to truncate text to a specific length
const truncateText = (text: string, maxLength: number = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

export function TrainingTutorials() {
  const { data: tutorialData, isLoading, error } = useTutorials();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded-[16px]">
        <p className="text-red-500 text-center">
          Failed to load tutorials. Please try again later.
        </p>
      </div>
    );
  }

  if (!tutorialData?.data?.length) {
    return (
      <div className="p-4 bg-white rounded-[16px]">
        <p className="text-gray-500 text-center">No tutorials available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-[15px] gap-y-4 lg:gap-8 lg:grid-cols-3">
      {tutorialData.data.map((tutorial) => (
        <TutorialCard
          key={tutorial.id}
          id={tutorial.id.toString()}
          imageUrl={tutorial.image_url || "/assets/images/marketplace.png"}
          title={tutorial.title}
          description={truncateText(stripHtml(tutorial.description), 80)}
        />
      ))}
    </div>
  );
}
