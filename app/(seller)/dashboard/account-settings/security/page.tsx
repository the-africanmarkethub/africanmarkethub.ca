"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { deleteUserAccount } from "@/lib/api/auth/profile";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Modal from "@/app/components/common/Modal";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { LockClosedIcon, ShieldCheckIcon } from "@heroicons/react/20/solid";

export default function SecuritySection() {
    const router = useRouter();
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            await deleteUserAccount();
            toast.success("Account deleted successfully.");
            clearAuth();
            router.replace("/");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Action failed.");
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* 1. Change Password Card */}
            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
                <div className="flex items-center gap-2 mb-6">
                    <ShieldCheckIcon className="w-5 h-5 text-hub-primary" />
                    <h3 className="text-lg font-bold text-gray-900">Login Security</h3>
                </div>

                <div className="max-w-full space-y-5">
                    {/* Current Password */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Current Password</label>
                        <div className="relative">
                            <input
                                className="pr-12 input focus:ring-2 focus:ring-hub-primary/10"
                                type={showCurrent ? "text" : "password"}
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-hub-secondary"
                            >
                                {showCurrent ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <hr className="border-gray-50" />

                    {/* New Password */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">New Secure Password</label>
                        <div className="relative">
                            <input
                                className="pr-12 input focus:ring-2 focus:ring-hub-primary/10"
                                type={showNew ? "text" : "password"}
                                placeholder="Minimum 8 characters"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-hub-secondary"
                            >
                                {showNew ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </button>
                        </div>
                        <p className="text-[11px] text-gray-500 italic">Use a mix of letters, numbers, and symbols.</p>
                    </div>

                    {/* Confirm New Password */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Confirm New Password</label>
                        <div className="relative">
                            <input
                                className="pr-12 input focus:ring-2 focus:ring-hub-primary/10"
                                type={showConfirm ? "text" : "password"}
                                placeholder="Repeat new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-hub-secondary"
                            >
                                {showConfirm ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button className="w-full mt-2 font-bold transition-transform btn btn-primary md:w-auto active:scale-95">
                        Update Password
                    </button>
                </div>
            </div>

            {/* 2. Danger Zone Section */}
            <div className="p-6 border border-red-100 bg-red-50/50 rounded-2xl">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="text-center md:text-left">
                        <h3 className="flex items-center justify-center gap-2 text-sm font-bold tracking-tight text-red-800 uppercase md:justify-start">
                            <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            Danger Zone
                        </h3>
                        <p className="max-w-sm mt-1 text-xs text-red-700/70">
                            Once you delete your account, there is no going back. All your data
                            including order history and African Market Hub credits will be cleared.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="w-full md:w-auto px-6 py-2.5 text-xs font-bold text-red-600 border-2 border-red-200 rounded-xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm"
                    >
                        Delete Permanently
                    </button>
                </div>
            </div>

            {/* Modal remains same but updated button labels for clarity */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Account Deletion"
                description="This will permanently remove your access to El Veep. Are you sure?"
            >
                <div className="flex flex-col-reverse justify-end gap-3 mt-8 sm:flex-row">
                    <button onClick={() => setIsDeleteModalOpen(false)} className="btn btn-gray" disabled={isDeleting}>
                        Keep My Account
                    </button>
                    <button onClick={handleDeleteAccount} className="bg-red-600 border-red-600 btn btn-primary hover:bg-red-700" disabled={isDeleting}>
                        {isDeleting ? "Processing..." : "Confirm Deletion"}
                    </button>
                </div>
            </Modal>
        </div>
    );
}