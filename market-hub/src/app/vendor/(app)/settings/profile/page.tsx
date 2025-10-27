"use client";
import { PageHeader } from "@/components/vendor/page-header";
import { BusinessProfileEdit } from "@/components/vendor/account-settings/BusinessProfileEdit";
import { GeneralProfileView } from "@/components/vendor/account-settings/GeneralProfileView";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleBack = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    console.log("Profile saved!");
    setIsEditing(false);
  };

  return (
    <div className="p-8">
      {isEditing ? (
        <div className="space-y-6 xl:space-y-8">
          <div className="flex items-center gap-x-2">
            <button onClick={handleBack}>
              <ArrowLeft />
            </button>
            <PageHeader title="Edit Profile Settings" />
          </div>
          <BusinessProfileEdit onBack={handleBack} onSave={handleSave} />
        </div>
      ) : (
        <div className="space-y-6 xl:space-y-8">
          <PageHeader title="Profile Settings" />
          <GeneralProfileView onEdit={handleEdit} />
        </div>
      )}
    </div>
  );
}
