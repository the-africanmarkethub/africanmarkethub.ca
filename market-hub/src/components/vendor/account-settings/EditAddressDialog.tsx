import { Button } from "@/components/vendor/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/vendor/ui/dialog";
import { Alert, AlertDescription } from "@/components/vendor/ui/alert";
import { ArrowLeft, X } from "lucide-react";
import { Label } from "@/components/vendor/ui/label";
import { Checkbox } from "@/components/vendor/ui/checkbox";
import { CustomLabel } from "../CustomLabel";
import { CustomInput } from "../CustomInput";

type Props = {
  editAddressOpen: boolean;
  setEditAddressOpen: (state: boolean) => void;
};

export const EditAddressDialog = (props: Props) => {
  return (
    <Dialog
      open={props.editAddressOpen}
      onOpenChange={props.setEditAddressOpen}
    >
      <DialogContent className="sm:max-w-[555px] h-full p-0 bg-white [&>button]:hidden overflow-auto">
        <DialogHeader className="flex-row flex-between px-6 py-6 border-b border-[#EEEEEE]">
          <DialogTitle className="flex items-center justify-start gap-x-2.5">
            <Button
              className="bg-white flex-center w-11 h-11 border border-[#F0EEF0] rounded-full hover:bg-white"
              onClick={() => props.setEditAddressOpen(false)}
            >
              <ArrowLeft />
            </Button>
            <p className="text-[24px] leading-[31.92px]">Edit Address</p>
          </DialogTitle>
          <button onClick={() => props.setEditAddressOpen(false)}>
            <X />
          </button>
        </DialogHeader>
        <div className="space-y-4 px-6">
          <Alert className="border-[#F28C0D] bg-[#FFFBED] rounded-[16px] p-6">
            <AlertDescription className="text-[#292929] font-normal text-sm">
              This address will be used for all billing-related communications
              and documents.
            </AlertDescription>
          </Alert>

          <div className="space-y-8">
            <div className="space-y-2">
              <CustomLabel htmlFor="businessName" text="Business Name" />
              <CustomInput id="businessName" placeholder="Enter Bank Name" />
            </div>

            <div className="space-y-2">
              <CustomLabel htmlFor="address" text="Address" />
              <CustomInput id="address" placeholder="Address" />
            </div>

            <div className="space-y-2">
              <CustomLabel htmlFor="cityState" text="City/State" />
              <CustomInput id="cityState" placeholder="City/State" />
            </div>

            <div className="space-y-2">
              <CustomLabel htmlFor="postalCode" text="Postal Code" />
              <CustomInput id="postalCode" placeholder="e.g. 112909" />
            </div>

            <div className="space-y-2">
              <CustomLabel htmlFor="country" text="Country" />
              <CustomInput id="country" placeholder="Country" />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="sameAddress" className="border-[#DCDCDC]" />
              <Label htmlFor="sameAddress" className="text-sm">
                Use same address for shipping and business profile
              </Label>
            </div>
            <div className="w-full flex flex-col items-center gap-2 pb-6 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => props.setEditAddressOpen(false)}
                className="w-full flex-1 border-[#9C5432] text-sm font-semibold bg-white px-6 py-3 rounded-[32px]"
              >
                Cancel
              </Button>
              <Button
                onClick={() => props.setEditAddressOpen(false)}
                className="w-full bg-[#F28C0D] flex-1 text-sm font-semibold px-6 py-3 hover:bg-[#F28C0D] text-white rounded-[32px]"
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
