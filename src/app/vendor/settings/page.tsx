"use client";

import { useState } from "react";
import { useVendorShops } from "@/hooks/useVendorShops";
import { useSettlementAccount } from "@/hooks/useSettlementAccount";
import { PasswordInput } from "@/components/PasswordInput";

export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] = useState("business");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankForm, setBankForm] = useState({
    name: "",
    code: "",
    transit_number: "",
    account_number: "",
    account_name: "",
    institution_number: "",
  });
  const [authorizePlatform, setAuthorizePlatform] = useState(false);

  const { data: shopData, isLoading: shopLoading } = useVendorShops();
  const { data: settlementData, isLoading: settlementLoading } = useSettlementAccount();
  
  const shop = shopData?.shops?.[0]; // Get the first shop from the shops array
  const settlementAccount = settlementData?.data;

  const handleEditClick = () => {
    if (shop) {
      setEditForm({
        name: shop.name || "",
        description: shop.description || "",
        phone: shop.vendor?.phone || "",
        email: shop.vendor?.email || "",
        address: shop.address || "",
        city: shop.city?.name || "",
        state: shop.state?.name || "",
        postal_code: "",
        country: shop.vendor?.country || "",
      });
    }
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement shop update API call
    console.log("Update shop:", editForm);
    setIsEditing(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      alert("New passwords don't match");
      return;
    }
    // TODO: Implement password change API call
    console.log("Change password");
    setPasswordForm({
      current_password: "",
      new_password: "",
      confirm_password: "",
    });
  };

  const handleBankEdit = () => {
    if (settlementAccount) {
      setBankForm({
        name: settlementAccount.name || "",
        code: settlementAccount.code || "",
        transit_number: settlementAccount.transit_number || "",
        account_number: settlementAccount.account_number || "",
        account_name: settlementAccount.account_name || "",
        institution_number: settlementAccount.institution_number || "",
      });
    }
    setShowBankModal(true);
  };

  const handleBankSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorizePlatform) {
      alert("Please authorize the platform to verify this account");
      return;
    }
    // TODO: Implement bank account update API call
    console.log("Update bank account:", bankForm);
    setShowBankModal(false);
    setAuthorizePlatform(false);
  };

  const tabs = [
    { id: "business", label: "Business Information" },
    { id: "payment", label: "Payment Details" },
    { id: "security", label: "Account Security" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Account & Settings</h1>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-[#F28C0D] text-[#F28C0D]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Business Information Tab */}
            {activeTab === "business" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Business Information</h2>
                  {!isEditing && (
                    <button
                      onClick={handleEditClick}
                      className="px-4 py-2 bg-[#F28C0D] text-white rounded-lg hover:bg-orange-600"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {shopLoading ? (
                  <div className="text-center text-gray-500 py-8">Loading shop information...</div>
                ) : isEditing ? (
                  /* Edit Form */
                  <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Name
                        </label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          value={editForm.address}
                          onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={editForm.city}
                          onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State/Province
                        </label>
                        <input
                          type="text"
                          value={editForm.state}
                          onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          value={editForm.postal_code}
                          onChange={(e) => setEditForm({ ...editForm, postal_code: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          value={editForm.country}
                          onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                        placeholder="Tell customers about your business..."
                      />
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#F28C0D] text-white rounded-lg hover:bg-orange-600"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Display Mode */
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Business Name</label>
                          <p className="text-gray-900">{shop?.name || "Not provided"}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                          <p className="text-gray-900">{shop?.vendor?.email || "Not provided"}</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                          <p className="text-gray-900">{shop?.vendor?.phone || "Not provided"}</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Business Type</label>
                          <p className="text-gray-900 capitalize">{shop?.type || "Not specified"}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                          <p className="text-gray-900">{shop?.address || "Not provided"}</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">City</label>
                          <p className="text-gray-900">{shop?.city?.name || "Not provided"}</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">State/Province</label>
                          <p className="text-gray-900">{shop?.state?.name || "Not provided"}</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Country</label>
                          <p className="text-gray-900">{shop?.vendor?.country || "Not provided"}</p>
                        </div>
                      </div>
                    </div>

                    {shop?.description && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                        <p className="text-gray-900">{shop.description}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Payment Details Tab */}
            {activeTab === "payment" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Payment Details</h2>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-md font-medium text-gray-900">Bank Account Information</h3>
                    <button 
                      onClick={handleBankEdit}
                      className="text-[#F28C0D] text-sm hover:text-orange-600"
                    >
                      {settlementAccount ? "Change Account" : "+ Add Account"}
                    </button>
                  </div>
                  
                  {settlementLoading ? (
                    <div className="text-center text-gray-500 py-4">Loading bank account...</div>
                  ) : settlementAccount ? (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Bank Name:</span>
                        <span className="text-sm text-gray-900">{settlementAccount.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Account Name:</span>
                        <span className="text-sm text-gray-900">{settlementAccount.account_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Account Number:</span>
                        <span className="text-sm text-gray-900">****{settlementAccount.account_number.slice(-4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Bank Code:</span>
                        <span className="text-sm text-gray-900">{settlementAccount.code}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <p className="text-gray-500 mb-4">No bank account added</p>
                      <button className="px-4 py-2 bg-[#F28C0D] text-white rounded-lg hover:bg-orange-600">
                        Add Bank Account
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-md font-medium text-gray-900 mb-4">Payment History</h3>
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500">No payment history available</p>
                  </div>
                </div>
              </div>
            )}

            {/* Account Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Account Security</h2>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-md font-medium text-gray-900 mb-4">Change Password</h3>
                  
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <PasswordInput
                        value={passwordForm.current_password}
                        onChange={(value) => setPasswordForm({ ...passwordForm, current_password: value })}
                        placeholder="Enter current password"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <PasswordInput
                        value={passwordForm.new_password}
                        onChange={(value) => setPasswordForm({ ...passwordForm, new_password: value })}
                        placeholder="Enter new password"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <PasswordInput
                        value={passwordForm.confirm_password}
                        onChange={(value) => setPasswordForm({ ...passwordForm, confirm_password: value })}
                        placeholder="Confirm new password"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#F28C0D] text-white rounded-lg hover:bg-orange-600"
                    >
                      Update Password
                    </button>
                  </form>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-md font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      <p className="text-xs text-gray-500 mt-1">Not enabled</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                      Enable
                    </button>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-md font-medium text-red-900 mb-2">Danger Zone</h3>
                  <p className="text-sm text-red-700 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bank Account Edit Modal */}
        {showBankModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    onClick={() => setShowBankModal(false)}
                    className="mr-3 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="text-xl font-semibold text-gray-900">Edit</h2>
                </div>
                <button
                  onClick={() => setShowBankModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Warning Notice */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-orange-800">
                    Your existing bank details will be replaced with the new account details.
                  </p>
                </div>

                {/* Current Bank Account */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Current Bank Account</h3>
                  <p className="text-sm text-gray-600">
                    {settlementAccount?.name} ****{settlementAccount?.account_number?.slice(-4)}
                  </p>
                </div>

                {/* Edit Form */}
                <form onSubmit={handleBankSave} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Bank Name"
                      value={bankForm.name}
                      onChange={(e) => setBankForm({ ...bankForm, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Code
                    </label>
                    <input
                      type="text"
                      placeholder="Code"
                      value={bankForm.code}
                      onChange={(e) => setBankForm({ ...bankForm, code: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transit Number
                    </label>
                    <input
                      type="text"
                      placeholder="Code"
                      value={bankForm.transit_number}
                      onChange={(e) => setBankForm({ ...bankForm, transit_number: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      placeholder="Account Number"
                      value={bankForm.account_number}
                      onChange={(e) => setBankForm({ ...bankForm, account_number: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Name
                    </label>
                    <input
                      type="text"
                      placeholder="Account Name"
                      value={bankForm.account_name}
                      onChange={(e) => setBankForm({ ...bankForm, account_name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Authorization Checkbox */}
                  <div className="flex items-start space-x-3 pt-4">
                    <input
                      type="checkbox"
                      id="authorize"
                      checked={authorizePlatform}
                      onChange={(e) => setAuthorizePlatform(e.target.checked)}
                      className="mt-1 h-4 w-4 text-[#F28C0D] border-gray-300 rounded focus:ring-[#F28C0D]"
                      required
                    />
                    <label htmlFor="authorize" className="text-sm text-gray-700">
                      I authorize the platform to verify this account and initiate debits and 
                      credits as needed for services rendered.
                    </label>
                  </div>

                  {/* Buttons */}
                  <div className="flex space-x-3 pt-6">
                    <button
                      type="button"
                      onClick={() => setShowBankModal(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-[#F28C0D] text-white rounded-lg hover:bg-orange-600 font-medium"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}