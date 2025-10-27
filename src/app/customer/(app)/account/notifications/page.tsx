"use client";

import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import {
  useNotificationSettings,
  NotificationSettings,
} from "@/hooks/customer/useNotificationSettings";
import SubmitButton from "@/components/customer/SubmitButton";

export default function NotificationsPage() {
  const {
    settings: fetchedSettings,
    isLoading,
    updateSettings,
    isUpdating,
  } = useNotificationSettings();

  // Initialize with default values (all false initially)
  const [settings, setSettings] = useState<NotificationSettings>({
    marketing_emails: false,
    new_products: false,
    promotions: false,
    push_notification: false,
    email_notification: false,
    sms_notification: false,
    events: false,
  });

  // Update local state when fetched settings are loaded
  useEffect(() => {
    if (fetchedSettings) {
      setSettings({
        marketing_emails: fetchedSettings.marketing_emails,
        new_products: fetchedSettings.new_products,
        promotions: fetchedSettings.promotions,
        push_notification: fetchedSettings.push_notification,
        email_notification: fetchedSettings.email_notification,
        sms_notification: fetchedSettings.sms_notification,
        events: fetchedSettings.events,
      });
    }
  }, [fetchedSettings]);

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveSettings = () => {
    updateSettings(settings);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-semibold mb-8">Notification Settings</h2>
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-500">Loading notification settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-semibold mb-8">Notification Settings</h2>

      <div className="space-y-8">
        {/* Order Status Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Order Status</h3>
            <p className="md:text-sm text-xs text-gray-600 mb-4">
              Receive notifications about the progress of your orders.
            </p>
          </div>

          <div className="space-y-4 md:ml-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Push Notification</span>
              <Switch
                checked={settings.push_notification}
                onCheckedChange={() => handleToggle("push_notification")}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Emails</span>
              <Switch
                checked={settings.email_notification}
                onCheckedChange={() => handleToggle("email_notification")}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">SMS</span>
              <Switch
                checked={settings.sms_notification}
                onCheckedChange={() => handleToggle("sms_notification")}
              />
            </div>
          </div>
        </div>

        {/* Promotional Offers Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Promotional Offers</h3>
            <p className="text-xs md:text-sm text-gray-600 mb-4">
              Be notified about exclusive deals and discounts.
            </p>
          </div>

          <div className="space-y-4 md:ml-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Marketing Emails</span>
              <Switch
                checked={settings.marketing_emails}
                onCheckedChange={() => handleToggle("marketing_emails")}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">New Products</span>
              <Switch
                checked={settings.new_products}
                onCheckedChange={() => handleToggle("new_products")}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Promotions</span>
              <Switch
                checked={settings.promotions}
                onCheckedChange={() => handleToggle("promotions")}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Events</span>
              <Switch
                checked={settings.events}
                onCheckedChange={() => handleToggle("events")}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6">
          <SubmitButton
            onClick={handleSaveSettings}
            isLoading={isUpdating}
            className="w-full md:w-auto"
          >
            Save Settings
          </SubmitButton>
        </div>
      </div>
    </div>
  );
}
