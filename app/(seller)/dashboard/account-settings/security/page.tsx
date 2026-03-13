"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { changeUserPassword, deleteUserAccount } from "@/lib/api/auth/profile";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Modal from "@/app/components/common/Modal";
import { ShieldCheckIcon, EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";


export default function SecuritySection() {
    const router = useRouter();
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [passwords, setPasswords] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!passwords.current_password || !passwords.new_password) {
            return toast.error("Please fill in all password fields.");
        }

        if (passwords.new_password.length < 8) {
            return toast.error("New password must be at least 8 characters.");
        }

        if (passwords.new_password !== passwords.confirm_password) {
            return toast.error("New passwords do not match.");
        }

        setLoading(true);
        try {
            await changeUserPassword({
                current_password: passwords.current_password,
                new_password: passwords.new_password,
            });

            toast.success("Password updated successfully!");
            setPasswords({ current_password: "", new_password: "", confirm_password: "" });
            await clearAuth();
        } catch (err: any) {
            let errorMsg = err.response?.data?.message || "Failed to update password.";
            const validationErrors = err.response?.data?.errors;
            if (validationErrors) {
                const firstErrorKey = Object.keys(validationErrors)[0];
                errorMsg = validationErrors[firstErrorKey][0];
            }
            else if (err.response?.data?.new_password) {
                errorMsg = err.response.data.new_password[0];
            }

            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

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
            <form onSubmit={handleChangePassword} className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
                <div className="flex items-center gap-2 mb-6">
                    <ShieldCheckIcon className="w-5 h-5 text-hub-primary" />
                    <h3 className="text-lg font-bold text-gray-900">Login Security</h3>
                </div>

                <div className="max-w-md space-y-5">
                    {/* Current Password */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Current Password</label>
                        <div className="relative">
                            <input
                                name="current_password"
                                value={passwords.current_password}
                                onChange={handleInputChange}
                                className="pr-12 input focus:ring-2 focus:ring-hub-primary/10"
                                type={showCurrent ? "text" : "password"}
                                placeholder="Enter current password"
                                required
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
                                name="new_password"
                                value={passwords.new_password}
                                onChange={handleInputChange}
                                className="pr-12 input focus:ring-2 focus:ring-hub-primary/10"
                                type={showNew ? "text" : "password"}
                                placeholder="Minimum 8 characters"
                                required
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
                    {/* Confirm New Password */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Confirm New Password</label>
                        <div className="relative">
                            <input
                                name="confirm_password" // <--- ADD THIS NAME ATTRIBUTE
                                value={passwords.confirm_password}
                                onChange={handleInputChange}
                                className={`pr-12 input transition-all focus:ring-2 ${passwords.confirm_password && passwords.new_password !== passwords.confirm_password
                                    ? "border-red-300 focus:ring-red-100"
                                    : "focus:ring-hub-primary/10"
                                    }`}
                                type={showConfirm ? "text" : "password"}
                                placeholder="Repeat new password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute z-10 text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-hub-secondary"
                            >
                                {showConfirm ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 font-bold transition-transform btn btn-primary md:w-auto active:scale-95 disabled:opacity-70"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </div>
            </form>

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