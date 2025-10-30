import { CreditCard } from "lucide-react";
import { CustomInput } from "../CustomInput";
import { CustomLabel } from "../CustomLabel";
import { ProfileDetailCard } from "./ProfileDetailCard";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useChangePassword } from "@/hooks/vendor/useChangePassword";

export function AccountSecurityTabContent() {
  const { mutate: changePassword, isPending } = useChangePassword();
  
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const handleChangePassword = () => {
    // Basic validation
    if (!passwordData.current_password || !passwordData.new_password || !passwordData.new_password_confirmation) {
      return;
    }

    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      return;
    }

    changePassword(passwordData, {
      onSuccess: () => {
        // Reset form on success
        setPasswordData({
          current_password: "",
          new_password: "",
          new_password_confirmation: "",
        });
      },
    });
  };

  return (
    <div>
      <Card className="mt-4 px-4 py-8 bg-white rounded-2xl md:p-8">
        <CardContent className="space-y-8 p-0 pb-8">
          <div className="space-y-2">
            <CustomLabel htmlFor="currentPassword" text="Current Password" />
            <CustomInput 
              id="currentPassword" 
              type="password"
              placeholder="Current Password"
              value={passwordData.current_password}
              onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <CustomLabel htmlFor="newPassword" text="New Password" />
            <CustomInput 
              id="newPassword" 
              type="password"
              placeholder="New Password"
              value={passwordData.new_password}
              onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <CustomLabel htmlFor="confirmPassword" text="Confirm Password" />
            <CustomInput 
              id="confirmPassword" 
              type="password"
              placeholder="Confirm Password"
              value={passwordData.new_password_confirmation}
              onChange={(e) => setPasswordData({ ...passwordData, new_password_confirmation: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-y-5 text-[#525252] text-sm font-normal ">
            <h3 className="">Password requirements:</h3>
            <ul className="list-disc pl-4">
              <li>At least 8 characters long</li>
              <li>Include uppercase and lowercase letters</li>
              <li>Include at least one number</li>
              <li>Include at least one special character</li>
            </ul>
          </div>

          <div className="flex justify-end gap-x-3">
            <Button 
              onClick={handleChangePassword}
              disabled={isPending || !passwordData.current_password || !passwordData.new_password || !passwordData.new_password_confirmation}
              className="bg-[#F28C0D] text-sm font-semibold hover:bg-[#F28C0D] text-white rounded-[32px] disabled:opacity-50"
            >
              {isPending ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </CardContent>

        <ProfileDetailCard
          title="Two-Factor Authentication"
          action={
            <Switch className="data-[state=unchecked]:bg-[#EEEEEE] bg-white [&>span]:bg-white" />
          }
          content={
            <div className="flex items-center mt-8 gap-x-3 md:gap-x-4">
              <CreditCard className="h-6 w-6 flex-shrink-0" />
              <div className="space-y-2 md:space-y-0">
                <p className="text-[#292929] text-sm font-normal lg:text-[16px] lg:leading-[22px]">
                  Two-Factor Authentication is Disabled
                </p>
                <p className="text-xs text-[#989898] font-normal lg:text-sm">
                  We recommend enabling two-factor authentication to add an
                  extra layer of security to your account.
                </p>
              </div>
            </div>
          }
        />
      </Card>
    </div>
  );
}
