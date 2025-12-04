"use client";

import { useState } from "react";
import { useVendorFAQs } from "@/hooks/useFAQ";
import { useTickets } from "@/hooks/useTickets";
import { useVendorTutorials } from "@/hooks/useTutorials";
// The layout is handled by vendor/layout.tsx

// FAQ Component
const FAQSection = () => {
  const { data: faqsResponse, isLoading, error } = useVendorFAQs();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-gray-500">
          Failed to load FAQs. Please try again later.
        </p>
      </div>
    );
  }

  const faqs = faqsResponse?.data || [];

  if (faqs.length === 0) {
    return (
      <div className="text-center py-12">
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
              strokeWidth={1}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-gray-500">No FAQs available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-gray-600">
      <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleFaq(faq.id)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
            >
              <span className="font-medium">{faq.question}</span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  openFaq === faq.id ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {openFaq === faq.id && (
              <div className="px-6 pb-4">
                <div
                  className="text-gray-800"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Support Ticket System Component
const SupportTicketSystem = () => {
  const { data: ticketsResponse, isLoading, error } = useTickets();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  // Handle different possible response structures
  const tickets = Array.isArray(ticketsResponse?.data?.data)
    ? ticketsResponse.data.data
    : Array.isArray(ticketsResponse?.data)
    ? ticketsResponse.data
    : Array.isArray(ticketsResponse)
    ? ticketsResponse
    : [];

  return (
    <div>
      <div className="flex justify-between text-gray-600 items-center mb-6">
        <h3 className="text-xl font-semibold">Support Ticket System</h3>
        {/* <button className="bg-[#F28C0D] text-white px-4 py-2 rounded-lg hover:opacity-90">
          Create Ticket
        </button> */}
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <svg
            className="w-5 h-5 absolute left-3 top-3 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option>Date</option>
            <option>Today</option>
            <option>Last Week</option>
            <option>Last Month</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option>Location</option>
            <option>Toronto</option>
            <option>Vancouver</option>
            <option>Montreal</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <div className="animate-pulse">
              <div className="grid grid-cols-5 gap-4 mb-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="grid grid-cols-5 gap-4 mb-4">
                  {Array.from({ length: 5 }, (_, j) => (
                    <div key={j} className="h-8 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-500">
              Failed to load tickets. Please try again later.
            </p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12">
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
                  strokeWidth={1}
                  d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0v10a2 2 0 002 2h8a2 2 0 002-2V8"
                />
              </svg>
            </div>
            <p className="text-gray-500">No support tickets found.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map((ticket: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ticket.ticket_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <img
                          src={ticket.profile_photo || "/default-avatar.png"}
                          alt={ticket.full_name}
                          className="h-8 w-8 rounded-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/default-avatar.png";
                          }}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {ticket.full_name}
                        </div>
                        <div className="flex items-center">
                          <div
                            className={`h-2 w-2 rounded-full mr-1 ${
                              ticket.online_status === "online"
                                ? "bg-green-400"
                                : "bg-gray-400"
                            }`}
                          ></div>
                          <span className="text-xs text-gray-500 capitalize">
                            {ticket.online_status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {ticket.last_message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(ticket.last_message_time).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative">
                      <button
                        onClick={() =>
                          setShowActionMenu(
                            showActionMenu === ticket.ticket_id
                              ? null
                              : ticket.ticket_id
                          )
                        }
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                      {showActionMenu === ticket.ticket_id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <div className="py-1">
                            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                              <svg
                                className="w-4 h-4 mr-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 616 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              View
                            </button>
                            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                              <svg
                                className="w-4 h-4 mr-3"
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
                              Reply
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// Product Features (Tutorials) Component
const ProductFeatures = () => {
  const { data: tutorialsResponse, isLoading, error } = useVendorTutorials();
  const [selectedTutorial, setSelectedTutorial] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const handleTutorialClick = (tutorial: any) => {
    setSelectedTutorial(tutorial);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTutorial(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 text-gray-600">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid gap-6">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-gray-500">
          Failed to load tutorials. Please try again later.
        </p>
      </div>
    );
  }

  const tutorials = tutorialsResponse?.data || [];

  if (tutorials.length === 0) {
    return (
      <div className="text-center py-12">
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
              strokeWidth={1}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <p className="text-gray-500">No tutorials available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-gray-600">
      <h3 className="text-xl font-semibold mb-4">Vendor Tutorials</h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tutorials.map((tutorial) => (
          <div
            key={tutorial.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              <img
                src={tutorial.image_url || "/icon/default-tutorial.png"}
                alt={tutorial.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/icon/default-tutorial.png";
                }}
              />
              {tutorial.video_url && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <div className="bg-white bg-opacity-90 rounded-full p-3">
                    <svg
                      className="w-6 h-6 text-[#F28C0D]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6">
              <h4 className="text-lg font-semibold mb-2 line-clamp-2">
                {tutorial.title}
              </h4>
              <div
                className="text-gray-600 mb-4 text-sm line-clamp-3"
                dangerouslySetInnerHTML={{
                  __html:
                    tutorial.description
                      .replace(/<[^>]*>/g, "")
                      .substring(0, 150) + "...",
                }}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {new Date(tutorial.created_at).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleTutorialClick(tutorial)}
                  className="text-[#F28C0D] hover:opacity-80 text-sm font-medium"
                >
                  {tutorial.video_url ? "Watch Video" : "Read More"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tutorial Modal */}
      {showModal && selectedTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedTutorial.title}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Video Section */}
              {selectedTutorial.video_url && (
                <div className="mb-6">
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                    {selectedTutorial.video_url.includes('youtube.com') || selectedTutorial.video_url.includes('youtu.be') ? (
                      <iframe
                        src={selectedTutorial.video_url.replace('watch?v=', 'embed/')}
                        title={selectedTutorial.title}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        controls
                        className="w-full h-full object-cover"
                        src={selectedTutorial.video_url}
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                </div>
              )}

              {/* Image Section (if no video) */}
              {!selectedTutorial.video_url && selectedTutorial.image_url && (
                <div className="mb-6">
                  <img
                    src={selectedTutorial.image_url}
                    alt={selectedTutorial.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Description */}
              <div className="prose max-w-none">
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedTutorial.description }}
                />
              </div>

              {/* Meta Information */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Published on {new Date(selectedTutorial.created_at).toLocaleDateString()}</span>
                  <span className="capitalize">Type: {selectedTutorial.type}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function VendorSupportPage() {
  const [activeTab, setActiveTab] = useState("faq");

  const tabs = [
    { id: "faq", label: "FAQ" },
    { id: "tickets", label: "Support Ticket System" },
    { id: "tutorials", label: "Product Features" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Vendor Support</h1>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-[#F28C0D] text-[#F28C0D]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white">
        {activeTab === "faq" && <FAQSection />}
        {activeTab === "tickets" && <SupportTicketSystem />}
        {activeTab === "tutorials" && <ProductFeatures />}
      </div>
    </div>
  );
}
