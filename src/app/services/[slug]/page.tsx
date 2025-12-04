"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useProductDetail } from "@/hooks/useProductDetail";
import { ItemCard } from "@/components/ItemCard";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { data: serviceData, isLoading, error } = useProductDetail(slug);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(5);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">(
    "description"
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="mb-6">
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-200 rounded"
                    ></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-12 bg-gray-200 rounded w-1/3"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !serviceData || !serviceData.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Service not found
          </h1>
          <p className="text-gray-600 mb-6">
            The service you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/services">
            <button className="bg-[#F28C0D] text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-colors">
              Back to Services
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const service = serviceData.data.product;
  const relatedServices = serviceData.data.frequently_bought_together || [];
  const recommendedServices = serviceData.data.recommended || [];
  const starRating = serviceData.data.star_rating;

  const hasDiscount =
    service.regular_price &&
    service.sales_price &&
    parseFloat(service.regular_price) > parseFloat(service.sales_price);

  const handleBookNow = () => {
    // Check if user is logged in
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      // Not logged in - redirect to login with Google, then to chat
      const returnUrl = `/chat?vendor=${service.shop.id}&service=${service.id}`;
      router.push(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}&authType=google`);
    } else {
      // Check user role
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (user.role === 'vendor') {
        // Vendor trying to book - show toast message
        toast.error('Only customers can book services. Vendors cannot book from other vendors.');
      } else {
        // Customer - go directly to chat
        router.push(`/chat?vendor=${service.shop.id}&service=${service.id}`);
      }
    }
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
          <span className="mx-2 text-gray-400">&gt;</span>
          <Link href="/services" className="text-gray-500 hover:text-gray-700">
            Category
          </Link>
          <span className="mx-2 text-gray-400">&gt;</span>
          <span className="text-gray-900">
            {service.category?.name || "Service"}
          </span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg p-4">
              {/* Main Image */}
              <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden mb-4">
                <Image
                  src={service.images[selectedImageIndex] || "/placeholder.svg"}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Thumbnail Images */}
              {service.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {service.images
                    .slice(0, 4)
                    .map((img: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`flex-shrink-0 w-20 h-20 relative bg-gray-100 rounded overflow-hidden border-2 ${
                          selectedImageIndex === idx
                            ? "border-[#F28C0D]"
                            : "border-gray-200"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${service.title} ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Middle Column - Details */}
          <div className="lg:col-span-4">
            <div className="space-y-4">
              {/* Title and Status */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {service.title}
                </h1>
                {service.status === "active" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Available Now
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < (service.average_rating || 4)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600 text-sm">
                  {(service.average_rating || 0).toFixed(1)} (
                  {starRating?.total || 0} customer reviews)
                </span>
              </div>

              {/* Price */}
              <div className="border-b pb-4">
                <p className="text-sm text-gray-600 mb-1">Starting From</p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ${parseFloat(service.sales_price).toFixed(2)} CAD
                  </span>
                  {hasDiscount && (
                    <span className="text-lg text-gray-400 line-through">
                      ${parseFloat(service.regular_price).toFixed(2)} CAD
                    </span>
                  )}
                </div>
              </div>

              {/* Short Description */}
              <div className="text-gray-600">
                <div
                  dangerouslySetInnerHTML={{ __html: service.description }}
                  className="line-clamp-3"
                />
              </div>

              {/* Service Package - only show if service has pricing model */}
              {/* {service.pricing_model && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Service Package ({service.pricing_model})</p>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">
                      Basic
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">
                      Standard
                    </button>
                    <button className="px-4 py-2 bg-[#F28C0D] text-white rounded-lg text-sm">
                      Premium
                    </button>
                  </div>
                </div>
              )} */}

              {/* Quantity Selector and Book Button */}
              <div className="flex items-center space-x-4">
                <div className="flex text-[#000000] items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={decrementQuantity}
                    className="p-3 hover:bg-gray-100"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <span className="px-4 py-2 min-w-[50px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="p-3 hover:bg-gray-100"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>

                <button
                  onClick={handleBookNow}
                  className="flex-1 bg-[#F28C0D] text-white py-3 px-8 rounded-full font-medium hover:opacity-90 transition-colors"
                >
                  Book Now
                </button>

                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <svg
                    className="w-5 h-5 text-gray-600"
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
                </button>
              </div>

              {/* Category and Share */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <span className="text-sm font-bold text-gray-600">
                    Category:{" "}
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    {service.category?.name || "Services"}, Automobile
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Share:</span>
                  <button className="p-1">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                  <button className="p-1">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </button>
                  <button className="p-1">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg p-6 space-y-6">
              {/* Delivery & Return Policy */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Delivery & Return Policy
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <svg
                      className="w-5 h-5 text-[#F28C0D] mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {service.estimated_delivery_time
                          ? `Estimated delivery time: ${service.estimated_delivery_time}`
                          : "Estimated delivery time 1-9 business days"}
                      </p>
                      {service.delivery_method && (
                        <p className="text-xs text-gray-500">
                          Delivery method: {service.delivery_method}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Return Policy */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Return Policy
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <svg
                      className="w-5 h-5 text-[#F28C0D] mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                      />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-600">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seller Information */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  <span className="text-[#F28C0D]">Seller Information</span>
                  <span className="ml-2 text-xs bg-[#FFF4E6] text-[#F28C0D] px-2 py-1 rounded">
                    View Shop
                  </span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <svg
                      className="w-5 h-5 text-[#F28C0D] mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-600">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Reviews</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#FFF4E6] rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-[#F28C0D]"
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
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {service.shop?.name || "Service Provider"}
                      </p>
                      {service.shop && (
                        <p className="text-xs text-gray-500">
                          {service.shop.status === "active" ? "✓ Verified" : ""}{" "}
                          • {service.views || 0} views
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Seller Rating
                    </p>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }, (_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < 4 ? "text-yellow-400" : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">4.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("description")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "description"
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "reviews"
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Reviews
              </button>
            </nav>
          </div>

          <div className="py-8 bg-white mt-6 rounded-lg p-6">
            {activeTab === "description" ? (
              <div>
                <h3 className="text-lg font-semibold mb-4">{service.title}</h3>
                <div className="prose max-w-none text-gray-600">
                  <div
                    dangerouslySetInnerHTML={{ __html: service.description }}
                  />

                  {/* Service Availability */}
                  {(service.available_days ||
                    service.available_from ||
                    service.available_to) && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Service Availability
                      </h4>
                      {service.available_days &&
                        service.available_days.length > 0 && (
                          <div className="mb-2">
                            <span className="text-sm text-gray-600">
                              Available Days:{" "}
                            </span>
                            <span className="text-sm font-medium">
                              {service.available_days.join(", ")}
                            </span>
                          </div>
                        )}
                      {(service.available_from || service.available_to) && (
                        <div>
                          <span className="text-sm text-gray-600">
                            Available Time:{" "}
                          </span>
                          <span className="text-sm font-medium">
                            {service.available_from} - {service.available_to}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Service Features */}
                  <div className="mt-6 space-y-3">
                    {service.quantity > 0 && (
                      <div className="flex items-start space-x-2">
                        <svg
                          className="w-5 h-5 text-green-500 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>
                          Available for booking ({service.quantity} slots
                          remaining)
                        </span>
                      </div>
                    )}
                    {service.sku && (
                      <div className="flex items-start space-x-2">
                        <svg
                          className="w-5 h-5 text-green-500 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Service Code: {service.sku}</span>
                      </div>
                    )}
                    {service.pricing_model && (
                      <div className="flex items-start space-x-2">
                        <svg
                          className="w-5 h-5 text-green-500 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Pricing Model: {service.pricing_model}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {service.reviews && service.reviews.length > 0 ? (
                  service.reviews.map((review: any) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-200 pb-6 last:border-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div>
                            <p className="font-medium">
                              {review.user?.name || "Anonymous"}
                            </p>
                            <div className="flex">
                              {Array.from({ length: 5 }, (_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-2">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No reviews yet. Be the first to review!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
