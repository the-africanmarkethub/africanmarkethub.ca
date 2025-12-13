"use client";

import { useState, useEffect } from "react";
import { useNotificationPreferences, useUpdateNotificationPreferences } from "@/hooks/useNotificationPreferences";

export default function NotificationPreferencePage() {
  const [preferences, setPreferences] = useState({
    marketing_emails: false,
    new_products: false,
    promotions: false,
    push_notification: false,
    email_notification: false,
    sms_notification: false,
    events: false,
  });

  const { data: preferencesData, isLoading } = useNotificationPreferences();
  const { mutate: updatePreferences, isPending: isUpdating } = useUpdateNotificationPreferences();

  useEffect(() => {
    if (preferencesData?.data) {
      const data = preferencesData.data;
      setPreferences({
        marketing_emails: data.marketing_emails,
        new_products: data.new_products,
        promotions: data.promotions,
        push_notification: data.push_notification,
        email_notification: data.email_notification,
        sms_notification: data.sms_notification,
        events: data.events,
      });
    }
  }, [preferencesData]);

  const handleToggle = (key: keyof typeof preferences) => {
    const newPreferences = {
      ...preferences,
      [key]: !preferences[key],
    };
    setPreferences(newPreferences);
  };

  const handleSavePreferences = () => {
    updatePreferences(preferences);
  };

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#F28C0D] focus:ring-offset-2 ${
        checked ? "bg-[#F28C0D]" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Notification Preference</h1>
          <div className="text-center text-gray-500 py-8">Loading notification preferences...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Notification Preference</h1>

        {/* Single Card Container */}
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl">
          <div className="space-y-8">
            
            {/* Marketing Emails Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketing Emails</h3>
              <p className="text-sm text-gray-500 mb-4">Receive marketing and promotional emails</p>
              
              <div className="flex items-center justify-between py-3">
                <span className="text-base text-gray-900">Marketing Emails</span>
                <ToggleSwitch
                  checked={preferences.marketing_emails}
                  onChange={() => handleToggle("marketing_emails")}
                />
              </div>
            </div>

            {/* Product Updates Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Updates</h3>
              <p className="text-sm text-gray-500 mb-4">Get notified about new products and updates</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3">
                  <span className="text-base text-gray-900">New Products</span>
                  <ToggleSwitch
                    checked={preferences.new_products}
                    onChange={() => handleToggle("new_products")}
                  />
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <span className="text-base text-gray-900">Events</span>
                  <ToggleSwitch
                    checked={preferences.events}
                    onChange={() => handleToggle("events")}
                  />
                </div>
              </div>
            </div>

            {/* Notification Methods Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Notification Methods</h3>
              <p className="text-sm text-gray-500 mb-4">Choose how you want to receive notifications</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3">
                  <span className="text-base text-gray-900">Email Notifications</span>
                  <ToggleSwitch
                    checked={preferences.email_notification}
                    onChange={() => handleToggle("email_notification")}
                  />
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <span className="text-base text-gray-900">SMS Notifications</span>
                  <ToggleSwitch
                    checked={preferences.sms_notification}
                    onChange={() => handleToggle("sms_notification")}
                  />
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <span className="text-base text-gray-900">Push Notifications</span>
                  <ToggleSwitch
                    checked={preferences.push_notification}
                    onChange={() => handleToggle("push_notification")}
                  />
                </div>
              </div>
            </div>

            {/* Promotional Offers Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Promotional Offers</h3>
              <p className="text-sm text-gray-500 mb-4">Be notified about exclusive deals and discounts</p>
              
              <div className="flex items-center justify-between py-3">
                <span className="text-base text-gray-900">Promotions</span>
                <ToggleSwitch
                  checked={preferences.promotions}
                  onChange={() => handleToggle("promotions")}
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6">
              <button
                onClick={handleSavePreferences}
                disabled={isUpdating}
                className="w-full px-6 py-3 bg-[#F28C0D] text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg transition-colors"
              >
                {isUpdating ? "Saving..." : "Save Preferences"}
              </button>
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {isUpdating && (
          <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#F28C0D]"></div>
                <span className="text-sm text-gray-600">Updating preferences...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}