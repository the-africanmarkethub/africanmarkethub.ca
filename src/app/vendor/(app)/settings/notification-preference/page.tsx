"use client";

import { PageHeader } from "@/components/vendor/page-header";
import { Switch } from "@/components/ui/switch";
import { tv } from "tailwind-variants";
import { useGetCommunicationPreferences, useUpdateCommunicationPreferences, type CommunicationPreferences } from "@/hooks/vendor/useCommunication";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const notificationPreference = tv({
  slots: {
    title: "text-lg/6 text-[#292929] font-semibold",
    subTitle: "text-[16px] leading-[22px] font-normal text-[#7C7C7C]",
    switchClass:
      "data-[state=unchecked]:bg-[#EEEEEE] bg-white [&>span]:bg-white",
    notificationMethod: "text-base font-normal leading-[22px]",
  },
});

const { title, subTitle, switchClass, notificationMethod } =
  notificationPreference();

export default function NotificationPreferencePage() {
  const { data: preferences, isLoading } = useGetCommunicationPreferences();
  const updatePreferences = useUpdateCommunicationPreferences();
  
  const [formData, setFormData] = useState<CommunicationPreferences>({
    marketing_emails: false,
    new_products: false,
    promotions: false,
    push_notification: false,
    email_notification: false,
    sms_notification: false,
    events: false,
  });

  // Update form data when preferences are loaded
  useEffect(() => {
    if (preferences) {
      setFormData({
        marketing_emails: preferences.marketing_emails || false,
        new_products: preferences.new_products || false,
        promotions: preferences.promotions || false,
        push_notification: preferences.push_notification || false,
        email_notification: preferences.email_notification || false,
        sms_notification: preferences.sms_notification || false,
        events: preferences.events || false,
      });
    }
  }, [preferences]);

  const handleToggle = (key: keyof CommunicationPreferences, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    updatePreferences.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 xl:space-y-8 xl:p-8">
        <PageHeader title="Notification Preference" />
        <div className="px-5 py-8 bg-white rounded-[16px] md:p-8">
          <p className="text-center text-gray-500">Loading preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 xl:space-y-8 xl:p-8">
      <PageHeader title="Notification Preference" />
      <div className="space-y-10 px-5 py-8 bg-white rounded-[16px] md:p-8">
        <div className="space-y-8">
          <div className="">
            <h2 className={title()}>Marketing Emails</h2>
            <p className={subTitle()}>
              Receive marketing and promotional emails
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex-between">
              <p className={notificationMethod()}>Marketing Emails</p>
              <Switch 
                className={switchClass()} 
                checked={formData.marketing_emails}
                onCheckedChange={(checked) => handleToggle('marketing_emails', checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="">
            <h2 className={title()}>Product Updates</h2>
            <p className={subTitle()}>
              Get notified about new products and updates
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex-between">
              <p className={notificationMethod()}>New Products</p>
              <Switch 
                className={switchClass()} 
                checked={formData.new_products}
                onCheckedChange={(checked) => handleToggle('new_products', checked)}
              />
            </div>
            <div className="flex-between">
              <p className={notificationMethod()}>Events</p>
              <Switch 
                className={switchClass()} 
                checked={formData.events}
                onCheckedChange={(checked) => handleToggle('events', checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="">
            <h2 className={title()}>Notification Methods</h2>
            <p className={subTitle()}>
              Choose how you want to receive notifications
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex-between">
              <p className={notificationMethod()}>Email Notifications</p>
              <Switch 
                className={switchClass()} 
                checked={formData.email_notification}
                onCheckedChange={(checked) => handleToggle('email_notification', checked)}
              />
            </div>
            <div className="flex-between">
              <p className={notificationMethod()}>SMS Notifications</p>
              <Switch 
                className={switchClass()} 
                checked={formData.sms_notification}
                onCheckedChange={(checked) => handleToggle('sms_notification', checked)}
              />
            </div>
            <div className="flex-between">
              <p className={notificationMethod()}>Push Notifications</p>
              <Switch 
                className={switchClass()} 
                checked={formData.push_notification}
                onCheckedChange={(checked) => handleToggle('push_notification', checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="">
            <h2 className={title()}>Promotional Offers</h2>
            <p className={subTitle()}>
              Be notified about exclusive deals and discounts
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex-between">
              <p className={notificationMethod()}>Promotions</p>
              <Switch 
                className={switchClass()} 
                checked={formData.promotions}
                onCheckedChange={(checked) => handleToggle('promotions', checked)}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <Button 
            onClick={handleSave}
            disabled={updatePreferences.isPending}
            className="w-full bg-[#F28C0D] hover:bg-[#F28C0D]/90 text-white"
          >
            {updatePreferences.isPending ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </div>
    </div>
  );
}
