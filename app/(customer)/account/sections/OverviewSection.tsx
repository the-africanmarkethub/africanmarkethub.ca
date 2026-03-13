"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import { updateUserProfile, deleteUserAccount } from "@/lib/api/auth/profile";
import toast from "react-hot-toast";
import ShippingSection from "./ShippingSection";
import useCanadaGreeting from "@/hooks/useCanadaGreeting";
import { useRouter } from "next/navigation"; 
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
 
  const handleSave = async () => {
    if (!user?.id) return;

    if (!payload.name.trim()) {
      return toast.error("First name is required");
    }

    if (!payload.last_name.trim()) {
      return toast.error("Last name is required");
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
 
  return (
    <div className="mx-auto space-y-6">
      <WelcomeBox greeting={greeting} name={user?.name} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ProfileCard
          user={user}
          isEditing={isEditing}
          payload={payload}
          loading={loading}
          onEdit={() => setIsEditing(true)}
          onCancel={handleCancel}
          onSave={handleSave}
          onChange={handleChange}
        />
        <ShippingSection user={user} />
      </div>
 
    </div>
  );
}

function WelcomeBox({ greeting, name }: { greeting: string; name?: string }) {
  return (
    <div className="relative p-6 overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
      <div className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 rounded-full opacity-50 bg-green-50" />
      <h2 className="relative text-xl font-bold text-gray-900 sm:text-2xl">
        {greeting}, <span className="text-hub-secondary">{name ?? "Guest"}</span>
      </h2>
      <p className="relative max-w-xl mt-2 text-sm leading-relaxed text-gray-600">
        From your dashboard, you can track{" "}
        <span className="font-medium text-gray-900 underline decoration-green-200 underline-offset-4">
          Recent Orders
        </span>
        , manage your addresses, and keep your profile details up to date.
      </p>
    </div>
  );
}

interface ProfileCardProps {
  user: any;
  isEditing: boolean;
  payload: any;
  loading: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function ProfileCard({
  user,
  isEditing,
  payload,
  loading,
  onEdit,
  onCancel,
  onSave,
  onChange,
}: ProfileCardProps) {
  return (
    <div className="flex flex-col items-center p-4 bg-white border border-gray-100 shadow-sm rounded-2xl">
      <div className="relative group">
        <Image
          src={user?.profile_photo || "/default-avatar.png"}
          width={100}
          height={100}
          alt="Profile"
          className="border-4 rounded-full shadow-sm border-gray-50"
        />
        {!isEditing && (
          <button
            onClick={onEdit}
            className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md border border-gray-100 text-hub-secondary hover:scale-110 transition-transform"
          >
            <EditIcon />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="w-full mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <input
              className="input"
              name="name"
              value={payload.name}
              onChange={onChange}
              placeholder="First Name"
              disabled={loading}
            />
            <input
              className="input"
              name="last_name"
              value={payload.last_name}
              onChange={onChange}
              placeholder="Last Name"
              disabled={loading}
            />
            <input
              className="input"
              name="phone"
              value={payload.phone}
              onChange={onChange}
              placeholder="Phone Number"
              disabled={loading}
              maxLength={10}
            />
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <button
              className="btn btn-primary"
              onClick={onSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button className="btn btn-gray" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 text-center">
          <h3 className="text-lg font-bold text-gray-900">
            {user?.name} {user?.last_name}
          </h3>
          <p className="text-sm font-medium tracking-wider text-gray-500 uppercase">
            {user?.role || "Customer"}
          </p>
          <p className="mt-1 text-xs text-gray-400">{user?.email}</p>
        </div>
      )}
    </div>
  );
}

const EditIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
    />
  </svg>
);