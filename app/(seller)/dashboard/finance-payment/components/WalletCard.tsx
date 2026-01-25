"use client";

import { formatAmount } from "@/utils/formatCurrency";
import React, { useState } from "react";
import { withdrawRequest } from "@/lib/api/seller/earnings";
import toast from "react-hot-toast";
import ConfirmationModal from "../../components/commons/ConfirmationModal";
import { LuExternalLink, LuZap, LuShieldCheck, LuInfo } from "react-icons/lu";

// Updated to match your NEW Laravel Response
export interface Wallet {
  available_to_withdraw: number;
  pending_clearance: number;
  instant_cashout: number;
  reserved_for_refunds: number;
  currency: string;
}

interface WalletCardProps {
  wallet?: Wallet;
  loading?: boolean;
}

export default function WalletCard({ wallet, loading = false }: WalletCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Extract values
  const available = wallet?.available_to_withdraw || 0;
  const pending = wallet?.pending_clearance || 0;
  const reserved = wallet?.reserved_for_refunds || 0;
  const instant_cashout = wallet?.instant_cashout || 0;
  
  // Logical Total
  const totalBalance = available + pending + reserved;
  const canWithdraw = available > 0;

  const handleWithdraw = async () => {
    const numericAmount = Number(amount);
    if (!amount || numericAmount <= 0 || numericAmount > available) {
      return toast.error("Please enter a valid amount");
    }

    setSubmitting(true);
    try {
      await withdrawRequest(numericAmount);
      toast.success("Withdrawal request submitted successfully");
      setIsModalOpen(false);
      setAmount("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="card p-6 bg-white shadow-sm border border-gray-100 rounded-2xl">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-4 flex-1">
            {/* Gross Balance Section */}
            <div className="group relative w-fit">
              <div className="flex items-center gap-1.5 cursor-help">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Gross Balance
                </h3>
                <LuInfo
                  size={14}
                  className="text-gray-300 group-hover:text-hub-primary transition-colors"
                />
              </div>

              {/* Tooltip - Appears on Hover */}
              <div className="absolute left-0 top-full mt-2 hidden group-hover:block w-64 p-3 bg-gray-900 text-[11px] text-gray-200 rounded-xl shadow-2xl z-50 border border-gray-800 animate-in fade-in slide-in-from-top-1">
                <p className="font-bold text-white mb-1">Total Account Value</p>
                The combined value of all funds (Available + Pending + Reserved)
                currently held in your Stripe account.
              </div>

              {!loading ? (
                <p className="text-4xl font-black text-gray-900 tracking-tight mt-1">
                  {formatAmount(totalBalance)}
                </p>
              ) : (
                <div className="h-10 bg-gray-100 animate-pulse rounded-lg w-32 mt-1"></div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {/* Available - Minimal View */}
              <div className="group relative p-3 bg-green-50 border border-green-100 rounded-xl cursor-help hover:border-green-300 transition-all">
                <p className="text-[10px] font-bold text-green-600 uppercase">
                  Available Now
                </p>
                <p className="text-lg font-bold text-green-700">
                  {formatAmount(available)}
                </p>

                {/* Tooltip */}
                <div className="absolute inset-x-0 bottom-full mb-2 hidden group-hover:block p-2 bg-gray-800 text-[10px] text-white rounded-lg shadow-lg z-50">
                  Funds cleared and ready for withdrawal.
                </div>
              </div>

              {/* Pending - Minimal View */}
              <div className="group relative p-3 bg-gray-50 border border-gray-100 rounded-xl cursor-help hover:border-gray-200 transition-all">
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Pending
                </p>
                <p className="text-lg font-bold text-gray-600">
                  {formatAmount(pending)}
                </p>

                {/* Tooltip */}
                <div className="absolute inset-x-0 bottom-full mb-2 hidden group-hover:block p-2 bg-gray-800 text-[10px] text-white rounded-lg shadow-lg z-50">
                  Recent sales currently being processed (3-5 days).
                </div>
              </div>

              {/* Reserved - Minimal View */}
              <div className="group relative p-3 bg-blue-50 border border-blue-100 rounded-xl cursor-help hover:border-blue-200 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold text-blue-600 uppercase">
                      Reserved
                    </p>
                    <p className="text-lg font-bold text-blue-700">
                      {formatAmount(reserved)}
                    </p>
                  </div>
                  <LuShieldCheck className="text-blue-200" size={18} />
                </div>

                {/* Tooltip */}
                <div className="absolute inset-x-0 bottom-full mb-2 hidden group-hover:block p-2 bg-gray-800 text-[10px] text-white rounded-lg shadow-lg z-50">
                  Held to cover potential refunds or disputes.
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 w-full lg:w-64">
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={!canWithdraw || loading}
              className={`w-full px-6 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all
          ${canWithdraw ? "bg-gray-900 text-white hover:bg-black shadow-md" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
            >
              Withdraw
              <LuExternalLink size={16} />
            </button>

            {instant_cashout > 0 && (
              <button className="group relative w-full px-6 py-3 bg-amber-50 text-amber-700 border border-amber-100 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-amber-100 transition-colors">
                <LuZap size={14} className="fill-amber-500" />
                Instant Payout
                {/* Minimal Tooltip for Instant Payout */}
                <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-32 p-2 bg-amber-700 text-[9px] text-white rounded shadow-lg z-50">
                  Withdraw in minutes for a 1% fee.
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => !submitting && setIsModalOpen(false)}
        title="Withdraw Funds"
      >
        <div className="space-y-4 pt-4">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Max Withdrawal:</span>
              <span className="font-bold text-gray-900">
                {formatAmount(available)}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">
              *Transferred to your connected bank account
            </p>
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xl">
              $
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-9 pr-4 py-4 border-2 border-gray-100 rounded-2xl focus:border-hub-secondary outline-none text-2xl font-bold transition-all"
              max={available}
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              className="flex-1 px-6 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl"
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              className="flex-2 px-6 py-3 bg-hub-secondary text-white font-bold rounded-xl disabled:bg-gray-200 shadow-lg shadow-green-100"
              onClick={handleWithdraw}
              disabled={submitting || !amount || Number(amount) > available}
            >
              {submitting ? "Processing..." : "Confirm & Send"}
            </button>
          </div>
        </div>
      </ConfirmationModal>
    </>
  );
}