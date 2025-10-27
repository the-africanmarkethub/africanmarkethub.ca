import { Button } from "@/components/vendor/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/vendor/ui/dialog";
import { Alert, AlertDescription } from "@/components/vendor/ui/alert";
import { ArrowLeft, X } from "lucide-react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { CustomLabel } from "../CustomLabel";
import { CustomInput } from "../CustomInput";

type Props = {
  editBankOpen: boolean;
  setEditBankOpen: (state: boolean) => void;
};

export const EditBankAccountDialog = (props: Props) => {
  return (
    <Dialog open={props.editBankOpen} onOpenChange={props.setEditBankOpen}>
      <DialogContent className="sm:max-w-[555px] h-full p-0 bg-white [&>button]:hidden overflow-auto">
        <DialogHeader className="flex-row flex-between px-6 py-6 border-b border-[#EEEEEE]">
          <DialogTitle className="flex items-center justify-start gap-x-2.5">
            <Button
              className="bg-white flex-center w-11 h-11 border border-[#F0EEF0] rounded-full hover:bg-white"
              onClick={() => props.setEditBankOpen(false)}
            >
              <ArrowLeft />
            </Button>
            <p className="text-[24px] leading-[31.92px]">Edit</p>
          </DialogTitle>
          <button onClick={() => props.setEditBankOpen(false)}>
            <X />
          </button>
        </DialogHeader>
        <div className="space-y-6 px-6">
          <Alert className="border-[#F28C0D] bg-[#FFFBED] rounded-[16px] p-6">
            <AlertDescription className="text-orange-800">
              Your existing bank details will be replaced with the new account
              details.
            </AlertDescription>
          </Alert>

          <div className="bg-[#F8F8F8] border-[#DCDCDC] rounded-[16px] p-6">
            <Label className="text-sm font-normal text-[#292929]">
              Current Bank Account
            </Label>
            <div className="mt-1 text-[16px] font-normal leading-[22px]">
              Citibank ****3432
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <CustomLabel htmlFor="bankName" text=" Bank Name" />
              <CustomInput id="bankName" placeholder="Enter Bank Name" />
            </div>

            <div className="space-y-2">
              <CustomLabel htmlFor="code" text="Code" />
              <CustomInput id="code" placeholder="Code" />
            </div>

            <div className="space-y-2">
              <CustomLabel htmlFor="transitNumber" text="Transit Number" />
              <CustomInput id="transitNumber" placeholder="Code" />
            </div>

            <div className="space-y-2">
              <CustomLabel htmlFor="accountNumber" text="Account Number" />
              <CustomInput id="accountNumber" placeholder="Account Number" />
            </div>

            <div className="space-y-2">
              <CustomLabel htmlFor="accountName" text="Account Name" />
              <CustomInput id="accountName" placeholder="Account Name" />
            </div>

            <div className="flex items-start gap-x-1">
              <Checkbox className="border-[#DCDCDC]" />
              <p className="text-sm text-muted-foreground">
                I authorize the platform to verify this account and initiate
                debits and credits as needed for services rendered.
              </p>
            </div>
            <div className="w-full flex flex-col items-center gap-2 pb-6 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => props.setEditBankOpen(false)}
                className="w-full flex-1 border-[#9C5432] text-sm font-semibold bg-white px-6 py-3 rounded-[32px]"
              >
                Cancel
              </Button>
              <Button
                onClick={() => props.setEditBankOpen(false)}
                className="w-full bg-[#F28C0D] flex-1 text-sm px-6 py-3 font-semibold hover:bg-[#F28C0D] text-white rounded-[32px]"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
