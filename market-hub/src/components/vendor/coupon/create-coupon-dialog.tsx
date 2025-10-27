import { Button } from "@/components/vendor/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/vendor/ui/dialog";
import { ArrowLeft, X } from "lucide-react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { CustomLabel } from "../CustomLabel";
import { CustomInput } from "../CustomInput";
import { DatePicker } from "../ui/date-picker";

type Props = {
  createCouponOpen: boolean;
  setCreateCouponOpen: (state: boolean) => void;
};

export const CreateCouponDialog = (props: Props) => {
  // const [stateDate, setStateDate] = useState<Date | undefined>();

  return (
    <Dialog
      open={props.createCouponOpen}
      onOpenChange={props.setCreateCouponOpen}
    >
      <DialogContent className="sm:max-w-[555px] h-full p-0 bg-white [&>button]:hidden overflow-auto">
        <DialogHeader className="flex-row flex-between px-6 h-fit py-6 border-b border-[#EEEEEE]">
          <DialogTitle className="flex items-center justify-start gap-x-2.5">
            <Button
              className="bg-white flex-center w-11 h-11 border border-[#F0EEF0] rounded-full hover:bg-white"
              onClick={() => props.setCreateCouponOpen(false)}
            >
              <ArrowLeft />
            </Button>
            <p className="text-[24px] leading-[31.92px]">Create Coupon Code</p>
          </DialogTitle>
          <button onClick={() => props.setCreateCouponOpen(false)}>
            <X />
          </button>
        </DialogHeader>
        <div className="space-y-4 px-6">
          <div className="space-y-8">
            <div>
              <CustomLabel htmlFor="couponCode" text="Coupon Code" />
              <CustomInput id="couponCode" placeholder="123SUM" />
            </div>

            <div>
              <CustomLabel htmlFor="address" text="Address" />
              {/* <CustomFormField
                control={form.control}
                name="start_time"
                label="Start Time"
                fieldType={FormFieldType.DATE_TIME_PICKER}
                isEditable
              /> */}
              <DatePicker />
            </div>

            <div>
              <CustomLabel htmlFor="cityState" text="City/Stater" />
              <CustomInput id="cityState" placeholder="City/State" />
            </div>

            <div>
              <CustomLabel htmlFor="country" text="Country" />
              <CustomInput id="country" placeholder="Country" />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="sameAddress" className="border-[#DCDCDC]" />
              <Label htmlFor="sameAddress" className="text-sm">
                Use same address for shipping and business profile
              </Label>
            </div>
            <div className="flex items-center gap-x-2 pb-6">
              <Button
                variant="outline"
                onClick={() => props.setCreateCouponOpen(false)}
                className=" flex-1 border-[#9C5432] text-sm font-semibold bg-white px-6 py-3 rounded-[32px]"
              >
                Cancel
              </Button>
              <Button
                onClick={() => props.setCreateCouponOpen(false)}
                className="bg-[#F28C0D] flex-1 text-sm font-semibold hover:bg-[#F28C0D] text-white rounded-[32px]"
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
