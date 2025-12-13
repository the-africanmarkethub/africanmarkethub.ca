"use client";

import { useState } from "react";
import { useSettlementAccount, useCreateSettlementAccount } from "@/hooks/useSettlementAccount";
import { useWithdrawalRequest } from "@/hooks/useWithdrawalRequest";
import { useVendorEarnings } from "@/hooks/useVendorEarnings";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WithdrawalModal({ isOpen, onClose }: WithdrawalModalProps) {
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  
  const [accountForm, setAccountForm] = useState({
    name: "",
    code: "",
    institution_number: "",
    transit_number: "",
    account_number: "",
    account_name: "",
  });

  const { data: settlementData, isLoading: settlementLoading } = useSettlementAccount();
  const { data: earningsData } = useVendorEarnings();
  const { mutate: createAccount, isPending: isCreatingAccount } = useCreateSettlementAccount();
  const { mutate: requestWithdrawal, isPending: isRequestingWithdrawal } = useWithdrawalRequest();
  
  const settlementAccount = settlementData?.data;
  const availableBalance = earningsData?.data?.available_to_withdraw || 0;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString();
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accountForm.name || !accountForm.code || !accountForm.account_number || !accountForm.account_name) {
      alert("Please fill in all required fields");
      return;
    }

    createAccount(accountForm, {
      onSuccess: () => {
        setShowAddAccount(false);
        setAccountForm({
          name: "",
          code: "",
          institution_number: "",
          transit_number: "",
          account_number: "",
          account_name: "",
        });
      }
    });
  };

  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(withdrawalAmount);
    
    if (!amount || amount <= 0) {
      alert("Please enter a valid withdrawal amount");
      return;
    }
    
    if (amount > availableBalance) {
      alert("Withdrawal amount cannot exceed available balance");
      return;
    }

    if (!settlementAccount) {
      alert("Please add a bank account first");
      return;
    }

    requestWithdrawal({ amount }, {
      onSuccess: () => {
        setWithdrawalAmount("");
        onClose();
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {showAddAccount ? "Add Bank Account" : "Withdraw Funds"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {showAddAccount ? (
            /* Add Bank Account Form */
            <form onSubmit={handleAddAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Markacus"
                  value={accountForm.name}
                  onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Code *
                </label>
                <input
                  type="text"
                  placeholder="e.g., 091209"
                  value={accountForm.code}
                  onChange={(e) => setAccountForm({ ...accountForm, code: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution Number
                </label>
                <input
                  type="text"
                  placeholder="e.g., INT"
                  value={accountForm.institution_number}
                  onChange={(e) => setAccountForm({ ...accountForm, institution_number: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transit Number
                </label>
                <input
                  type="text"
                  placeholder="e.g., 12112"
                  value={accountForm.transit_number}
                  onChange={(e) => setAccountForm({ ...accountForm, transit_number: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g., 09120910911"
                  value={accountForm.account_number}
                  onChange={(e) => setAccountForm({ ...accountForm, account_number: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Mjkola"
                  value={accountForm.account_name}
                  onChange={(e) => setAccountForm({ ...accountForm, account_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddAccount(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingAccount}
                  className="flex-1 px-4 py-2 bg-[#F28C0D] text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                >
                  {isCreatingAccount ? "Adding..." : "Add Account"}
                </button>
              </div>
            </form>
          ) : (
            /* Withdrawal Form */
            <div className="space-y-6">
              {/* Available Balance */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Available Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(availableBalance)}CAD
                </p>
              </div>

              {/* Bank Account Info */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700">Bank Account</h3>
                  {!settlementLoading && !settlementAccount && (
                    <button
                      onClick={() => setShowAddAccount(true)}
                      className="text-[#F28C0D] text-sm hover:text-orange-600"
                    >
                      + Add Account
                    </button>
                  )}
                </div>
                
                {settlementLoading ? (
                  <div className="text-center text-gray-500 py-4">Loading account...</div>
                ) : settlementAccount ? (
                  <div className="border border-gray-200 rounded-lg p-3">
                    <p className="font-medium text-gray-900">{settlementAccount.name}</p>
                    <p className="text-sm text-gray-600">
                      {settlementAccount.account_name} • ****{settlementAccount.account_number.slice(-4)}
                    </p>
                    <button
                      onClick={() => setShowAddAccount(true)}
                      className="text-[#F28C0D] text-xs hover:text-orange-600 mt-1"
                    >
                      Change Account
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <p className="text-gray-500 mb-3">No bank account added</p>
                    <button
                      onClick={() => setShowAddAccount(true)}
                      className="text-[#F28C0D] hover:text-orange-600"
                    >
                      + Add Bank Account
                    </button>
                  </div>
                )}
              </div>

              {/* Withdrawal Amount */}
              <form onSubmit={handleWithdrawal}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Withdrawal Amount (CAD)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    min="0"
                    step="0.01"
                    max={availableBalance}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum: {formatCurrency(availableBalance)}CAD
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isRequestingWithdrawal || !settlementAccount}
                    className="flex-1 px-4 py-2 bg-[#F28C0D] text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                  >
                    {isRequestingWithdrawal ? "Processing..." : "Withdraw"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}