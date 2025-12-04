"use client";

import { useState } from "react";
import Image from "next/image";
import { useReviews } from "@/hooks/useReviews";

export default function VendorRatingsReviewsPage() {
  const { data: reviewsData, isLoading } = useReviews();
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  const reviews = reviewsData?.data || [];

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F28C0D]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Ratings & Reviews</h1>
          <p className="text-gray-600 mt-1">View and manage customer feedback</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Total Reviews</p>
            <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Average Rating</p>
            <div className="flex items-center mt-1">
              <p className="text-2xl font-bold text-gray-900 mr-2">
                {reviews.length > 0
                  ? (
                      reviews.reduce((acc, rev) => acc + rev.rating, 0) /
                      reviews.length
                    ).toFixed(1)
                  : "0.0"}
              </p>
              {renderStars(
                Math.round(
                  reviews.reduce((acc, rev) => acc + rev.rating, 0) /
                    reviews.length || 0
                )
              )}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">5 Star Reviews</p>
            <p className="text-2xl font-bold text-gray-900">
              {reviews.filter((r) => r.rating === 5).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">With Images</p>
            <p className="text-2xl font-bold text-gray-900">
              {reviews.filter((r) => r.images && r.images.length > 0).length}
            </p>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product/Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Images
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No reviews yet
                    </td>
                  </tr>
                ) : (
                  reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {review.user.profile_photo ? (
                              <Image
                                src={review.user.profile_photo}
                                alt={review.user.name}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-full"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-gray-600 font-medium">
                                  {review.user.name.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {review.user.name} {review.user.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {review.user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {review.product.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {review.product.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStars(review.rating)}
                        <span className="ml-2 text-sm text-gray-600">
                          ({review.rating})
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 max-w-xs truncate">
                          {review.comment}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {review.images && review.images.length > 0 ? (
                          <div className="flex -space-x-2">
                            {review.images.slice(0, 3).map((img, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  setSelectedImage(img);
                                  setShowImageModal(true);
                                }}
                                className="h-8 w-8 rounded-full border-2 border-white overflow-hidden hover:z-10"
                              >
                                <Image
                                  src={img}
                                  alt={`Review ${idx + 1}`}
                                  width={32}
                                  height={32}
                                  className="h-full w-full object-cover"
                                />
                              </button>
                            ))}
                            {review.images.length > 3 && (
                              <div className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                                <span className="text-xs text-gray-600">
                                  +{review.images.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">No images</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(review.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedReview(review)}
                          className="text-[#F28C0D] hover:text-orange-700"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Review Detail Modal */}
        {selectedReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold">Review Details</h2>
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Customer Info */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Customer</h3>
                    <div className="flex items-center">
                      {selectedReview.user.profile_photo ? (
                        <Image
                          src={selectedReview.user.profile_photo}
                          alt={selectedReview.user.name}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-full"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {selectedReview.user.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {selectedReview.user.name} {selectedReview.user.last_name}
                        </p>
                        <p className="text-sm text-gray-500">{selectedReview.user.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Product/Service</h3>
                    <p className="text-sm text-gray-900">{selectedReview.product.title}</p>
                  </div>

                  {/* Rating */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Rating</h3>
                    <div className="flex items-center">
                      {renderStars(selectedReview.rating)}
                      <span className="ml-2 text-sm text-gray-600">
                        ({selectedReview.rating} out of 5)
                      </span>
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Comment</h3>
                    <p className="text-sm text-gray-900">{selectedReview.comment}</p>
                  </div>

                  {/* Images */}
                  {selectedReview.images && selectedReview.images.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Images</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedReview.images.map((img: string, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedImage(img);
                              setShowImageModal(true);
                            }}
                            className="relative aspect-square rounded-lg overflow-hidden hover:opacity-90"
                          >
                            <Image
                              src={img}
                              alt={`Review image ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Date */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Date</h3>
                    <p className="text-sm text-gray-900">
                      {formatDate(selectedReview.created_at)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Modal */}
        {showImageModal && selectedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setShowImageModal(false)}
          >
            <div className="relative max-w-4xl max-h-[90vh]">
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute -top-10 right-0 text-white hover:text-gray-300"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <Image
                src={selectedImage}
                alt="Review image"
                width={800}
                height={600}
                className="rounded-lg"
                style={{ maxHeight: '90vh', width: 'auto', height: 'auto' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}