"use client";

import contactUs from "@/lib/api/contact";
import { COMPANY_CONTACT_INFO } from "@/setting";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaBuilding,
  FaPhoneAlt,
  FaPaperPlane,
  FaWhatsapp,
} from "react-icons/fa";
import { FaMailchimp, FaPhone } from "react-icons/fa6";
import { ClipLoader } from "react-spinners";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [puzzle, setPuzzle] = useState<string>("");
  const [expectedAnswer, setExpectedAnswer] = useState<string>("");
  const [userAnswer, setUserAnswer] = useState<string>("");

  // Generate a random puzzle question
  useEffect(() => {
    const random = Math.random();
    if (random < 0.5) {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      setPuzzle(`What is ${a} + ${b}?`);
      setExpectedAnswer((a + b).toString());
    } else {
      const words = [
        ["sky", "blue"],
        ["grass", "green"],
        ["snow", "white"],
        ["coal", "black"],
        ["lemon", "yellow"],
        ["cherry", "red"],
        ["ocean", "blue"],
        ["cloud", "white"],
        ["rose", "red"],
        ["sand", "brown"],
        ["night", "black"],
        ["apple", "red"],
        ["banana", "yellow"],
        ["tree", "green"],
        ["milk", "white"],
        ["fire", "orange"],
        ["sun", "yellow"],
        ["grape", "purple"],
        ["mud", "brown"],
        ["chocolate", "brown"],
        ["carrot", "orange"],
        ["peach", "pink"],
        ["frog", "green"],
        ["lavender", "purple"],
        ["ice", "white"],
      ];

      const [item, color] = words[Math.floor(Math.random() * words.length)];
      const questionFormats = [
        `What color is the ${item}?`,
        `The ${item} is usually what color?`,
        `Fill in: The color of ${item} is _____.`,
        `Which color is the ${item}?`,
      ];
      setPuzzle(
        questionFormats[Math.floor(Math.random() * questionFormats.length)]
      );
      setExpectedAnswer(color);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userAnswer.trim().toLowerCase() !== expectedAnswer.toLowerCase()) {
      toast.error("Incorrect puzzle answer. Please try again.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await contactUs(formData);

      if (response.success) {
        toast.success("Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        setUserAnswer("");
      } else {
        toast.error(response.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 space-y-6 text-gray-700 bg-white border border-gray-100 shadow-2xl rounded-xl"
    >
      <h3 className="mb-4 text-2xl font-bold text-gray-900">
        Send Us a Message
      </h3>

      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          Your Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isSubmitting}
          className="input"
        />
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="email"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Your Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="input"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Your Phone
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="input"
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="subject"
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          Subject
        </label>
        <input
          type="text"
          name="subject"
          id="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          disabled={isSubmitting}
          className="input"
        />
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          Message
        </label>
        <textarea
          name="message"
          id="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          required
          disabled={isSubmitting}
          maxLength={255}
          className="input"
        />
      </div>

      {/* Puzzle validation */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Security Question
        </label>
        <p className="mb-2 text-gray-600">{puzzle}</p>
        <input
          type="text"
          name="puzzle"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          required
          disabled={isSubmitting}
          placeholder="Your answer"
          className="input"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center w-full btn btn-primary"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center gap-2">
            <ClipLoader size={20} color="#fff" />
            <span>Processing...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <FaPaperPlane className="w-5 h-5" />
            <span>Submit Message</span>
          </div>
        )}
      </button>
    </form>
  );
};

const ContactUsPage: React.FC = () => {
  const waMessage = encodeURIComponent(
    "Hello African Market Hub Support! I'm reaching out from the marketplace and I'd like some assistance."
  );
  return (
    <div className="p-4 font-sans bg-gray-50 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="py-16 mb-12 text-center bg-white shadow-lg rounded-xl">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Contact{" "}
            <span className="text-hub-secondary">
              {COMPANY_CONTACT_INFO.companyName}
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-700 sm:text-xl">
            {COMPANY_CONTACT_INFO.companyDescription}
          </p>
        </header>

        {/* Contact Content Grid */}
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Contact Info Sidebar (2/3) */}
          <div className="p-6 space-y-8 lg:col-span-1 lg:p-0">
            <div className="p-6 border-l-4 shadow-md bg-green-50 rounded-xl border-hub-secondary">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                Get in Touch
              </h2>
              <p className="mb-6 text-gray-600">
                Connect with our team directly via email for specific
                inquiries.
              </p>

              {/* Email */}
              <div className="flex items-start mb-4">
                <FaMailchimp className="w-6 h-6 mt-1 text-hub-primary shrink-0" />
                <div className="ml-3">
                  <p className="text-sm font-semibold text-gray-900">
                    Email Us
                  </p>
                  <p className="text-gray-700 transition-colors hover:text-hub-secondary">
                    <Link href="mailto:support@africanmarkethub.ca">
                      Send us a message
                    </Link>
                  </p>
                </div>
              </div>
              {/* WhatsApp */}
              <div className="flex items-start mb-4">
                <FaWhatsapp className="w-6 h-6 mt-1 text-hub-primary shrink-0" />
                <div className="ml-3">
                  <p className="text-sm font-semibold text-gray-900">
                    WhatsApp Us
                  </p>
                  <p className="text-gray-700 transition-colors hover:text-hub-secondary">
                    <Link href={`https://wa.me/${COMPANY_CONTACT_INFO.whatsappNumber}?text=${waMessage}`} target="_blank" rel="noopener noreferrer">
                      Chat on WhatsApp
                    </Link>
                  </p>
                </div>
              </div>
              {/* Phone */}
              <div className="flex items-start mb-4">
                <FaPhone className="w-6 h-6 mt-1 text-hub-primary shrink-0" />
                <div className="ml-3">
                  <p className="text-sm font-semibold text-gray-900">
                    Call Us
                  </p>
                  <p className="text-gray-700 transition-colors hover:text-hub-secondary">
                    <Link href={`tel:${COMPANY_CONTACT_INFO.whatsappNumber}`} >
                      Phone Call
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
