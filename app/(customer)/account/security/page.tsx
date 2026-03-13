"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { deleteUserAccount } from "@/lib/api/auth/profile";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Modal from "@/app/components/common/Modal";

export default function SecuritySection() {
    const router = useRouter();
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            await deleteUserAccount();
            toast.success("Account deleted. We hope to see you again.");
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
            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
                <h3 className="mb-4 text-lg font-bold text-gray-900">Change Password</h3>
                <div className="max-w-md space-y-4">
                    <input className="input" type="password" placeholder="Current Password" />
                    <input className="input" type="password" placeholder="New Password" />
                    <input className="input" type="password" placeholder="Confirm New Password" />
                    <button className="w-full px-8 btn btn-primary md:w-auto">
                        Update Password
                    </button>
                </div>
            </div>

            {/* 2. Danger Zone Section */}
            <div className="p-6 border border-red-100 bg-red-50/50 rounded-2xl">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="text-center md:text-left">
                        <h3 className="text-sm font-bold tracking-tight text-red-800 uppercase">
                            Delete Account
                        </h3>
                        <p className="max-w-sm mt-1 text-xs text-red-700/70">
                            This action is permanent. Deleting your account will remove all your
                            order history, saved addresses, and profile information from El Veep.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="w-full md:w-auto px-6 py-2.5 text-xs font-bold text-red-600 border-2 border-red-200 rounded-xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                    >
                        Delete Permanently
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Account"
                description="Are you absolutely sure? This cannot be undone."
            >
                <div className="flex flex-col-reverse justify-end gap-3 mt-8 sm:flex-row">
                    <button onClick={() => setIsDeleteModalOpen(false)} className="btn btn-gray" disabled={isDeleting}>
                        Cancel
                    </button>
                    <button onClick={handleDeleteAccount} className="btn btn-primary" disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : "Permanently Delete"}
                    </button>
                </div>
            </Modal>
        </div>
    );
}