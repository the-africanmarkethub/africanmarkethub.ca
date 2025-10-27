"use client";

import React from "react";
import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";
import AccountSidebar from "@/components/customer/account/AccountSidebar";

export default function ChatsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MaxWidthWrapper className="py-8">
        {/* Main Content */}
        <div className="flex-1 bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Chats</h1>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Chat Interface Placeholder */}
            <div className="flex h-96 border border-gray-200 rounded-lg">
              {/* Chat List */}
              <div className="w-1/3 border-r border-gray-200 p-4">
                <div className="space-y-3">
                  {/* Sample chat items */}
                  {[
                    {
                      name: "John Doe",
                      time: "16:45",
                      message: "Thank you for work, see you!",
                      unread: false,
                      active: false,
                    },
                    {
                      name: "Travis Barker",
                      time: "16:42",
                      message: "...is typing",
                      unread: false,
                      active: true,
                    },
                    {
                      name: "Kate Rose",
                      time: "15:30",
                      message: "See you at office tomorrow!",
                      unread: false,
                      active: false,
                    },
                    {
                      name: "Robert Parker",
                      time: "14:20",
                      message: "Hello! Have you seen my backpack...",
                      unread: true,
                      unreadCount: 2,
                      active: false,
                    },
                    {
                      name: "Franz Kafka",
                      time: "13:15",
                      message: "Meeting at 3 PM",
                      unread: false,
                      active: false,
                    },
                    {
                      name: "Tom Hardy",
                      time: "12:30",
                      message: "Project update ready",
                      unread: false,
                      active: false,
                    },
                    {
                      name: "Vivienne Westwood",
                      time: "11:45",
                      message: "Design review complete",
                      unread: false,
                      active: false,
                    },
                    {
                      name: "Anthony Paul",
                      time: "10:20",
                      message:
                        "Hello! Have you seen my backpack anywhere in office?",
                      unread: false,
                      active: false,
                    },
                    {
                      name: "Stan Smith",
                      time: "09:15",
                      message: "Good morning!",
                      unread: false,
                      active: false,
                    },
                  ].map((chat, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        chat.active
                          ? "bg-yellow-100 border border-yellow-300"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {chat.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {chat.name}
                            </h3>
                            <p className="text-sm text-gray-500">{chat.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {chat.unread && (
                            <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {chat.unreadCount || 1}
                            </span>
                          )}
                          {!chat.unread && (
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {chat.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Window */}
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        TB
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Travis Barker
                      </h3>
                      <p className="text-sm text-green-600">Online</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                  {/* Sample messages */}
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        TB
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg p-3 max-w-md">
                        <img
                          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop"
                          alt="Car tire work"
                          className="w-full h-32 object-cover rounded mb-2"
                        />
                        <a
                          href="https://dribbble.com/shots/17742253-ui-kit-designjam"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          https://dribbble.com/shots/17742253-ui-kit-designjam
                        </a>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">15:42</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-blue-500 text-white rounded-lg p-3 max-w-md">
                      <p>Thank you for work, see you!</p>
                      <p className="text-xs text-blue-100 mt-1">15:42</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      Today
                    </span>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        AP
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg p-3 max-w-md">
                        <p>
                          Hello! Have you seen my backpack anywhere in office?
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">15:42</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-blue-500 text-white rounded-lg p-3 max-w-md">
                      <p>Hi, yes, David have found it, ask our concierge ••</p>
                      <p className="text-xs text-blue-100 mt-1">15:42</p>
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                    <input
                      type="text"
                      placeholder="Type here"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
