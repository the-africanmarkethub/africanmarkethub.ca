"use client";

import { useState } from "react";
import { PageHeader } from "@/components/vendor/page-header";
import { EmailSidebar } from "@/components/vendor/customer-feedback/email-sidebar";
import { EmailDetail } from "@/components/vendor/customer-feedback/email-detail";
import { EmailList } from "@/components/vendor/customer-feedback/email-list";
import EmailComposer from "@/components/vendor/customer-feedback/email-composer";
export interface Email {
  id: string;
  sender: string;
  email: string;
  subject: string;
  preview: string;
  time: string;
  isRead: boolean;
  isStarred: boolean;
  avatar: string;
}

const mockEmails: Email[] = [
  {
    id: "1",
    sender: "Brooklyn Simmons",
    email: "brooklynsimmons@gmail.com",
    subject: "Enquiry",
    preview: "Hi, I want make enquiries about your s...",
    time: "12:55 am",
    isStarred: false,
    isRead: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    sender: "James Smith",
    email: "jamessmith@gmail.com",
    subject: "Product Details",
    preview: "Can you provide details about the late...",
    time: "1:15 am",
    isStarred: false,
    isRead: true,
    avatar: "/assets/images/avatar.png",
  },
  {
    id: "3",
    sender: "Emily Johnson",
    email: "emilyjohnson@gmail.com",
    subject: "Return Policy",
    preview: "I would like to know the return policy f...",
    time: "1:30 am",
    isStarred: false,
    isRead: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    sender: "Michael Brown",
    email: "michaelbrown@gmail.com",
    subject: "Recommendations",
    preview: "Do you have recommendations for sh...",
    time: "2:00 am",
    isStarred: false,
    isRead: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    sender: "Henry, Arthur",
    email: "henryarthur@gmail.com",
    subject: "Size Inquiry",
    preview: "What sizes do you have available for t...",
    time: "2:45 am",
    isStarred: false,
    isRead: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "6",
    sender: "Miles, Esther",
    email: "milesester@gmail.com",
    subject: "Size Inquiry",
    preview: "What sizes do you have available for t...",
    time: "2:45 am",
    isStarred: false,
    isRead: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "7",
    sender: "Black, Marvin",
    email: "blackmarvin@gmail.com",
    subject: "Size Inquiry",
    preview: "What sizes do you have available for t...",
    time: "2:45 am",
    isStarred: false,
    isRead: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "8",
    sender: "Nguyen, Shane",
    email: "nguyenshane@gmail.com",
    subject: "Size Inquiry",
    preview: "What sizes do you have available for t...",
    time: "2:45 am",
    isStarred: false,
    isRead: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "9",
    sender: "Sofia Martinez",
    email: "sofiamartinez@gmail.com",
    subject: "Material Question",
    preview: "Can you tell me more about the mater...",
    time: "3:10 am",
    isStarred: false,
    isRead: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "10",
    sender: "Liam Johnson",
    email: "liamjohnson@gmail.com",
    subject: "Discount Inquiry",
    preview: "Are there any discounts available for...",
    time: "3:25 am",
    isStarred: false,
    isRead: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "11",
    sender: "Ava Wilson",
    email: "avawilson@gmail.com",
    subject: "Shipping Question",
    preview: "Do you offer international shipping for...",
    time: "3:40 am",
    isStarred: false,
    isRead: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

export default function CustomerMessagePage() {
  const [emails] = useState<Email[]>(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isComposingMail, setIsComposingMail] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleEmailSelect = (email: Email) => {
    setSelectedEmail(email);
    setSidebarOpen(false); // Close sidebar on mobile when email is selected
  };

  const handleBackToList = () => {
    setSelectedEmail(null);
  };

  const handleStarToggle = (emailId: string) => {
    // star toggle logic
    console.log("Toggle star for email:", emailId);
  };

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="xl:space-y-8 xl:p-8">
      <div className="hidden xl:block">
        <PageHeader title="Customer Message" />
      </div>

      <div className="flex h-screen xl:h-full xl:gap-x-6">
        {/* Sidebar */}
        <div className="hidden xl:block">
          <EmailSidebar />
        </div>

        {/* Mobile Sidebar */}
        <EmailSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          setIsComposingMail={() => setIsComposingMail(true)}
          className="xl:hidden"
        />

        {/* Main Content */}
        <div className="flex flex-1 xl:rounded-2xl overflow-hidden">
          {selectedEmail ? (
            <EmailDetail
              email={selectedEmail}
              onBack={handleBackToList}
              onStarToggle={handleStarToggle}
              onMenuToggle={handleMenuToggle}
            />
          ) : isComposingMail ? (
            <EmailComposer
              setIsComposingMail={() => setIsComposingMail(false)}
            />
          ) : (
            <EmailList
              emails={emails}
              setIsComposingMail={() => setIsComposingMail(true)}
              onEmailSelect={handleEmailSelect}
              onStarToggle={handleStarToggle}
              onMenuToggle={handleMenuToggle}
            />
          )}
        </div>
      </div>
    </div>
  );
}
