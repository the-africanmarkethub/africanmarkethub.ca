import SettingsForm from "@/components/customer/account/SettingsForm";

export default function SettingsPage() {
  return (
    <div>
      <div className="bg-white mb-8 rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold">Account Settings</h2>
      </div>
      <SettingsForm />
    </div>
  );
}
