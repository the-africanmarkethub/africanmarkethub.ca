"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import { updateUserProfile, deleteUserAccount } from "@/lib/api/auth/profile"; // Ensure correct path
import toast from "react-hot-toast";
import ShippingSection from "./ShippingSection";
import useCanadaGreeting from "@/hooks/useCanadaGreeting";
import { useRouter } from "next/navigation";
import Modal from "@/app/components/common/Modal";
 
interface UpdateProfilePayload {
  name: string;
  last_name: string;
  phone: string;
}

export default function OverviewSection() {
  const router = useRouter();
  const greeting = useCanadaGreeting();

  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [payload, setPayload] = useState<UpdateProfilePayload>({
    name: user?.name || "",
    last_name: user?.last_name || "",
    phone: user?.phone || "",
  });

  useEffect(() => {
    if (user) {
      setPayload({
        name: user.name || "",
        last_name: user.last_name || "",
        phone: user.phone || "",
      });
    }
  }, [user]);
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPayload((prev) => ({ ...prev, [name]: value }));
  }; 

  const handleCancel = () => {
    if (user) {
      setPayload({
        name: user.name || "",
        last_name: user.last_name || "",
        phone: user.phone || "",
      });
    }
    setIsEditing(false);
  };

  /**
   * Sends the updated payload to the server
   */
  const handleSave = async () => {
    if (!user?.id) return;

    if (!payload.name.trim()) {
      return toast.error("First name is required");
    }

    if (!payload.phone.trim()) {
      return toast.error("Phone number is required");
    }

    setLoading(true);
    try {
      const updatedUser = await updateUserProfile(payload);
      updateUser(updatedUser);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to update profile";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles account deletion and cleanup
   */
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteUserAccount();
      toast.success("Account deleted. We're sorry to see you go.");
      clearAuth();
      router.replace("/");
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Delete failed. Please contact support.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };
  return (
    <div className="space-y-6">
      {/* Welcome Box */}
      <div className="card">
        <h2 className="text-lg font-semibold">
          {greeting}, {user?.name ?? "Guest"}
        </h2>
        <p className="text-sm mt-1 text-gray-600">
          From your account dashboard, you can easily check & view your
          <span className="text-orange-800"> Recent Orders</span>, manage your
          <span className="text-orange-800">
            {" "}
            Shipping and Billing Addresses
          </span>
          , and edit your
          <span className="text-orange-800"> Account Details</span>.
        </p>
      </div>

      {/* Profile Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card flex flex-col items-center text-center py-6">
          <Image
            src={user?.profile_photo || "/default-avatar.png"}
            width={80}
            height={80}
            alt="Profile"
            className="rounded-full"
          />

          {isEditing ? (
            <div className="mt-4 w-full space-y-2 px-4">
              <input
                className="input w-full disabled:bg-gray-50 disabled:cursor-not-allowed"
                name="name"
                value={payload.name} 
                onChange={handleChange}
                placeholder="First Name"
                disabled={loading}
              />
              <input
                className="input w-full disabled:bg-gray-50 disabled:cursor-not-allowed"
                name="last_name"
                value={payload.last_name}
                onChange={handleChange}
                placeholder="Last Name"
                disabled={loading}
              />

              <input
                className="input w-full disabled:bg-gray-50 disabled:cursor-not-allowed"
                name="phone"
                value={payload.phone} 
                onChange={handleChange}
                placeholder="Phone Number"
                maxLength={10}
                disabled={loading}
              />

              <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
                <button
                  className="btn btn-primary w-full flex items-center justify-center"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>

                <button
                  className="btn btn-gray w-full"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="mt-4 font-semibold text-lg">
                {user?.name} {user?.last_name ?? "Guest"}
              </h3>
              <p className="text-gray-500 text-sm">
                {user?.role ?? "Customer"}
              </p>
              <button
                className="mt-3 text-orange-800 hover:underline cursor-pointer"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </>
          )}
        </div>

        {/* Shipping Address Card */}
        <ShippingSection user={user} />
      </div>

      {/* Danger Zone / Delete Section */}
      <div className="card border-red-100 bg-red-50/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 px-4 sm:px-6">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-red-800">Danger Zone</h3>
          <p className="text-xs text-gray-600 leading-relaxed max-w-xs sm:max-w-none">
            Once you delete your account, there is no going back. All data will
            be permanently removed.
          </p>
        </div>

        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="w-full sm:w-auto text-center text-xs font-semibold text-red-600 hover:bg-red-600 hover:text-white border border-red-600 px-6 py-2.5 rounded-md transition-all active:scale-95 shadow-sm cursor-pointer"
        >
          Delete Account
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        // Ensure your Modal component uses responsive text classes like:
        // Title: text-lg sm:text-xl
        // Description: text-sm sm:text-base
        title="Delete Account"
        description="Are you sure you want to delete your account? All your data, including order history and saved addresses, will be permanently removed."
      >
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="cursor-pointer w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            onClick={handleDeleteAccount}
            className="cursor-pointer w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 flex justify-center items-center shadow-sm"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                Deleting...
              </>
            ) : (
              "Permanently Delete"
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
}
