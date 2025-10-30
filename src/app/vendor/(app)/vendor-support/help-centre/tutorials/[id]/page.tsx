"use client";

import { useParams, useRouter } from "next/navigation";
import { useTutorials } from "@/hooks/vendor/useTutorials";
import { PageHeader } from "@/components/vendor/page-header";
import { Button } from "@/components/vendor/ui/button";
import { ArrowLeft, Play } from "lucide-react";
import Image from "next/image";

export default function TutorialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tutorialId = params.id as string;

  const { data: tutorialData, isLoading, error } = useTutorials();

  // Find the specific tutorial by ID
  const tutorial = tutorialData?.data?.find(
    (t) => t.id.toString() === tutorialId
  );

  const handleBack = () => {
    router.push("/vendor/vendor-support/help-centre");
  };

  const handleWatchVideo = () => {
    if (tutorial?.video_url) {
      window.open(tutorial.video_url, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 md:space-y-8 md:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !tutorial) {
    return (
      <div className="p-6 space-y-6 md:space-y-8 md:p-8">
        <PageHeader title="Tutorial Not Found" />
        <div className="bg-white rounded-[16px] p-8 text-center">
          <p className="text-gray-500 mb-4">
            {error
              ? "Failed to load tutorial."
              : "The requested tutorial could not be found."}
          </p>
          <Button
            onClick={handleBack}
            className="bg-[#F28C0D] hover:bg-[#F28C0D]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Help Centre
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 md:space-y-8 md:p-8">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="p-2 hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <nav className="text-sm text-gray-500">
          <span>Vendor Support</span>
          <span className="mx-2">›</span>
          <span>Help Centre</span>
          <span className="mx-2">›</span>
          <span>Tutorials</span>
        </nav>
      </div>

      {/* Tutorial Content */}
      <div className="bg-white rounded-[16px] overflow-hidden">
        {/* Hero Image */}
        <div className="relative w-full h-64 md:h-96">
          <Image
            src={tutorial.image_url || "/assets/images/marketplace.png"}
            alt={tutorial.title}
            fill
            className="object-cover"
          />
          {tutorial.video_url && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <Button
                onClick={handleWatchVideo}
                className="bg-[#F28C0D] hover:bg-[#F28C0D] text-white px-6 py-3 rounded-full flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Watch Video
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#292929] mb-6">
            {tutorial.title}
          </h1>

          {/* Description with HTML content */}
          <div
            className="prose prose-lg max-w-none text-[#333333] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: tutorial.description }}
          />

          {/* Action Buttons */}
          {/* <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
            {tutorial.video_url && (
              <Button
                onClick={handleWatchVideo}
                className="bg-[#F28C0D] hover:bg-[#F28C0D] text-white px-6 py-3 flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Watch Tutorial Video
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleBack}
              className="border-[#F28C0D] text-[#F28C0D] hover:bg-[#F28C0D] hover:text-white px-6 py-3"
            >
              Back to Tutorials
            </Button>
          </div> */}

          {/* Tutorial Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <span className="font-medium">Status:</span> {tutorial.status}
              </div>
              <div>
                <span className="font-medium">Type:</span> {tutorial.type}
              </div>
              <div>
                <span className="font-medium">Created:</span>{" "}
                {new Date(tutorial.created_at).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Updated:</span>{" "}
                {new Date(tutorial.updated_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
