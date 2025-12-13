"use client";

import { useState, useEffect } from "react";
import { PasswordInput } from "@/components/PasswordInput";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useChangePassword } from "@/hooks/useAuth";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string;
  last_name: string;
  email: string;
  phone: string;
  profile_photo?: string;
}

export default function AccountSettings() {
  const { isAuthenticated, user } = useAuthGuard();
  const changePassword = useChangePassword();
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    email: "",
    phone: "",
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update
    console.log("Profile updated:", formData);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.new_password !== formData.confirm_password) {
      toast.error("New passwords don't match!");
      return;
    }

    if (formData.new_password.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    changePassword.mutate({
      current_password: formData.current_password,
      new_password: formData.new_password,
      new_password_confirmation: formData.confirm_password,
    }, {
      onSuccess: (data) => {
        toast.success(data.message || "Password changed successfully!");
        setFormData(prev => ({
          ...prev,
          current_password: "",
          new_password: "",
          confirm_password: "",
        }));
      },
      onError: (error: any) => {
        if (error?.errors) {
          const apiErrors = error.errors;
          Object.keys(apiErrors).forEach(field => {
            const messages = apiErrors[field];
            if (Array.isArray(messages)) {
              messages.forEach((message: string) => {
                toast.error(message);
              });
            } else if (typeof messages === 'string') {
              toast.error(messages);
            }
          });
        } else if (error?.message) {
          toast.error(error.message);
        } else {
          toast.error("Failed to change password. Please try again.");
        }
      }
    });
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F28C0D] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 max-w-4xl mx-auto">
      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Profile Information
        </h2>
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                First Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-[#F28C0D] hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Change Password
        </h2>
        <form onSubmit={handleChangePassword} className="space-y-6">
          <div>
            <label
              htmlFor="current_password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Current Password
            </label>
            <PasswordInput
              id="current_password"
              name="current_password"
              value={formData.current_password}
              onChange={handlePasswordChange("current_password")}
              placeholder="Enter current password"
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="new_password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <PasswordInput
                id="new_password"
                name="new_password"
                value={formData.new_password}
                onChange={handlePasswordChange("new_password")}
                placeholder="Enter new password"
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label
                htmlFor="confirm_password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm New Password
              </label>
              <PasswordInput
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handlePasswordChange("confirm_password")}
                placeholder="Confirm new password"
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              Password requirements: At least 8 characters with uppercase,
              lowercase, number, and special character.
            </p>
          </div>

          <button
            type="submit"
            disabled={changePassword.isPending}
            className="bg-[#F28C0D] hover:bg-orange-600 disabled:opacity-50 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            {changePassword.isPending ? "Updating Password..." : "Update Password"}
          </button>
        </form>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Account Actions
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Email Notifications</h3>
              <p className="text-sm text-gray-600">
                Receive order updates and promotional emails
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F28C0D]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">SMS Notifications</h3>
              <p className="text-sm text-gray-600">
                Receive important updates via SMS
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F28C0D]"></div>
            </label>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-6">
            <button className="text-red-600 hover:text-red-700 font-medium transition-colors">
              Delete Account
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
