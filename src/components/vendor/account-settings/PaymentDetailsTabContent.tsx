"use client";

import { useState } from "react";
import { Button } from "@/components/vendor/ui/button";
import { CreditCard, Edit } from "lucide-react";
import { EditBankAccountDialog } from "./EditBankAccountDialog";
import { EditAddressDialog } from "./EditAddressDialog";
import { ProfileDetailCard } from "./ProfileDetailCard";

export default function PaymentDetailsTabContent() {
  const [editBankOpen, setEditBankOpen] = useState(false);
  const [editAddressOpen, setEditAddressOpen] = useState(false);

  return (
    <div className="mt-4 px-4 py-8 bg-white space-y-6 rounded-[16px] lg:p-8">
      <ProfileDetailCard
        title="Current Payment Method"
        content={
          <div className="flex flex-col items-start lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-x-4 pt-4 pb-2 lg:gap-x-7">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-[#292929] font-normal text-[16px] leading-[22px]">
                  **** **** **** 3432
                </div>
                <div className="text-sm text-[#989898] font-normal">
                  Expires 09/25
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#F28C0D] hover:text-[#F28C0D] px-0"
            >
              <Edit className="h-4 w-4 mr-0.5" />
              Edit
            </Button>
          </div>
        }
      />

      <ProfileDetailCard
        title="Add New Payment Method"
        content={
          <Button className="flex justify-start mt-4 mb-2 bg-[#F8F8F8] rounded-[39px] py-3 font-medium text-[16px] leading-[22px] text-[#9C939D] hover:text-[#9C939D] hover:bg-[#F8F8F8]">
            <CreditCard className="h-4 w-4 mr-[1px]" />
            Add Credit Card
          </Button>
        }
      />

      <ProfileDetailCard
        title="Current Bank Account"
        content={
          <div className="flex flex-col items-start lg:flex-row lg:items-center lg:justify-between">
            <div className="pt-4 pb-2">
              <p className="text-sm font-normal text-[#989898]">
                Connected to Citibank
              </p>
              <p className="text-[16px] text-[#292929] leading-[22px] font-normal">
                Account ****3432
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-sm text-[#F28C0D] hover:text-[#F28C0D] px-0"
              onClick={() => setEditBankOpen(true)}
            >
              <Edit className="h-4 w-4 mr-[1px]" />
              Change Bank Account
            </Button>
          </div>
        }
      />

      <ProfileDetailCard
        title="Billing Address"
        content={
          <div className="flex flex-col items-start pt-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-[16px] text-[#292929] leading-[22px] font-normal pb-2">
              6391 Elgin St. Celina, Delaware 10299
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-sm text-[#F28C0D] hover:text-[#F28C0D] px-0"
              onClick={() => setEditAddressOpen(true)}
            >
              <Edit className="h-4 w-4 mr-[1px]" />
              Edit Address
            </Button>
          </div>
        }
      />

      {/* Edit Bank Account Dialog */}
      <EditBankAccountDialog
        editBankOpen={editBankOpen}
        setEditBankOpen={setEditBankOpen}
      />

      {/* Edit Address Dialog */}
      <EditAddressDialog
        editAddressOpen={editAddressOpen}
        setEditAddressOpen={setEditAddressOpen}
      />
    </div>
  );
}
