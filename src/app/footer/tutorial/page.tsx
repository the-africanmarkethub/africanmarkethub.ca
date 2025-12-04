"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCustomerTutorials } from "@/hooks/useTutorials";

export default function TutorialPage() {
  const [openItem, setOpenItem] = useState<number | null>(null);
  const { data: tutorialResponse, isLoading, error } = useCustomerTutorials();

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };

  const extractYouTubeVideoId = (url: string | null) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    );
    return match ? match[1] : null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F28C0D] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tutorials...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error loading tutorials
          </h3>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  const tutorials = tutorialResponse?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative text-white py-16 overflow-hidden">
        <Image
          src="/icon/banner.svg"
          alt="Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center">Tutorials</h1>
          <div className="flex items-center justify-center space-x-2 mt-2 text-orange-100">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>›</span>
            <span>Tutorials</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {tutorials.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tutorials available
            </h3>
            <p className="text-gray-600">
              Check back later for helpful tutorials and guides.
            </p>
          </div>
        ) : (
          <>
            {/* Tutorial Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900">
                Customer Tutorials ({tutorials.length} available)
              </h2>
              <p className="text-gray-600 mt-2">
                Learn how to make the most of African Market Hub with our
                step-by-step guides.
              </p>
            </div>

            {/* Tutorials Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tutorials.map((tutorial) => {
                const videoId = extractYouTubeVideoId(tutorial.video_url);

                return (
                  <div
                    key={tutorial.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Tutorial Image/Video Thumbnail */}
                    <div className="relative aspect-video bg-gray-100">
                      {videoId ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                            alt={tutorial.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer">
                              <svg
                                className="w-6 h-6 text-white ml-1"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Image
                          src={tutorial.image_url}
                          alt={tutorial.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    {/* Tutorial Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                        {tutorial.title}
                      </h3>

                      <div
                        className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4"
                        dangerouslySetInnerHTML={{
                          __html:
                            tutorial.description
                              .replace(/<[^>]*>/g, " ")
                              .substring(0, 150) + "...",
                        }}
                      />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {tutorial.video_url && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                              Video
                            </span>
                          )}
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {tutorial.type}
                          </span>
                        </div>

                        <button
                          onClick={() => toggleItem(tutorial.id)}
                          className="text-[#F28C0D] hover:text-orange-600 font-medium text-sm transition-colors"
                        >
                          {openItem === tutorial.id ? "Read Less" : "Read More"}
                        </button>
                      </div>

                      {/* Expanded Content */}
                      {openItem === tutorial.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div
                            className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: tutorial.description,
                            }}
                          />

                          {tutorial.video_url && (
                            <div className="mt-4">
                              <a
                                href={tutorial.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                              >
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                                Watch Video
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Contact CTA */}
            {/* <div className="bg-white rounded-lg shadow-sm p-8 mt-12 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Need more help?</h2>
              <p className="text-gray-600 mb-6">
                Can't find what you're looking for? Our support team is ready to assist you.
              </p>
              <Link
                href="/footer/contact"
                className="inline-flex items-center bg-[#F28C0D] hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Contact Support
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div> */}
          </>
        )}
      </div>
    </div>
  );
}
