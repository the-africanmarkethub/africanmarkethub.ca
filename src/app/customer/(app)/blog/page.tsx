import React from "react";
import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <MaxWidthWrapper className="py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-black">
            Blog
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed mb-8">
              Welcome to the African Market Hub blog! Here you'll find insights,
              tips, success stories, and the latest news about African
              businesses, e-commerce trends, and our platform updates.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <article className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-2">
                    January 15, 2025
                  </div>
                  <h2 className="text-xl font-semibold mb-3">
                    The Future of African E-commerce
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Explore the growing trends in African e-commerce and how
                    digital marketplaces are transforming traditional business
                    models across the continent.
                  </p>
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read More →
                  </a>
                </div>
              </article>

              <article className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-2">
                    January 10, 2025
                  </div>
                  <h2 className="text-xl font-semibold mb-3">
                    Success Story: Mama's Kitchen
                  </h2>
                  <p className="text-gray-700 mb-4">
                    How a small family restaurant in Lagos grew from local
                    deliveries to international shipping through African Market
                    Hub.
                  </p>
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read More →
                  </a>
                </div>
              </article>

              <article className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-2">
                    January 5, 2025
                  </div>
                  <h2 className="text-xl font-semibold mb-3">
                    Tips for New Sellers
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Essential strategies for new sellers to maximize their
                    success on African Market Hub, from product photography to
                    customer service.
                  </p>
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read More →
                  </a>
                </div>
              </article>

              <article className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-2">
                    December 28, 2024
                  </div>
                  <h2 className="text-xl font-semibold mb-3">
                    African Artisan Spotlight
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Meet the talented artisans creating beautiful handcrafted
                    products and learn about the traditional techniques they
                    preserve.
                  </p>
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read More →
                  </a>
                </div>
              </article>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">
                Featured Categories
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3 text-blue-800">
                    Business Tips
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Practical advice for growing your business, from marketing
                    strategies to financial management.
                  </p>
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Articles →
                  </a>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3 text-green-800">
                    Success Stories
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Inspiring stories from sellers who have built successful
                    businesses on our platform.
                  </p>
                  <a
                    href="#"
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    View Articles →
                  </a>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3 text-purple-800">
                    Platform Updates
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Stay informed about new features, improvements, and changes
                    to African Market Hub.
                  </p>
                  <a
                    href="#"
                    className="text-purple-600 hover:text-purple-800 font-medium"
                  >
                    View Articles →
                  </a>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Popular Topics</h2>
              <div className="flex flex-wrap gap-3">
                <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">
                  E-commerce Trends
                </span>
                <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">
                  Digital Marketing
                </span>
                <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">
                  African Culture
                </span>
                <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">
                  Business Growth
                </span>
                <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">
                  Customer Service
                </span>
                <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">
                  Product Photography
                </span>
                <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">
                  Shipping & Logistics
                </span>
                <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">
                  Payment Solutions
                </span>
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-800">
                Subscribe to Our Newsletter
              </h2>
              <p className="text-gray-700 mb-4">
                Get the latest articles, business tips, and platform updates
                delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">
                Want to Contribute?
              </h2>
              <p className="text-gray-700 mb-4">
                We're always looking for talented writers to share their
                insights about African business, e-commerce, and
                entrepreneurship. If you have a story to tell or expertise to
                share, we'd love to hear from you.
              </p>
              <div className="space-y-2">
                <p>
                  <strong>Email:</strong> blog@africanmarkethub.com
                </p>
                <p>
                  <strong>Topics we're interested in:</strong> Business growth,
                  e-commerce trends, African culture, success stories, and
                  practical tips for sellers and buyers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
