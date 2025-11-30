import { useState } from "react";
import { Button } from "../ui/button";
import { Smile, X } from "lucide-react";
import { CustomLabel } from "../CustomLabel";
import { CustomInput } from "../CustomInput";
import { useInitiateWithdraw } from "@/hooks/vendor/useInitiateWithdrawal";
import { tv } from "tailwind-variants";

const parentModal = tv({
  slots: {
    base: [
      "fixed inset-0 z-[100] flex bg-black/50 transition-opacity duration-200",
      "items-end sm:items-center sm:justify-center",
    ],
    container: [
      "w-full sm:max-w-[555px] bg-white transition-transform duration-200 p-6",
      "h-auto rounded-t-[32px]",
      "sm:rounded-[32px]",
    ],
  },
  variants: {
    isOpen: {
      true: {
        container: "translate-y-0",
        base: "pointer-events-auto opacity-100",
      },
      false: {
        container: "translate-y-full sm:translate-y-0",
        base: "pointer-events-none opacity-0",
      },
    },
  },
});

interface WithdrawFund {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
}

export default function WithdrawFunds(props: WithdrawFund) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");

  const initiateWithdrawMutation = useInitiateWithdraw();

  const handleSubmit = async (amount: string) => {
    setShowSuccess(true);
    try {
      await initiateWithdrawMutation.mutateAsync({ amount });
      setShowSuccess(true);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleClose = () => {
    props.setIsOpen(false);

    setTimeout(() => {
      setShowSuccess(false);
      setWithdrawalAmount("");
    }, 200);
    setWithdrawalAmount("");
  };

  const handleCancel = () => {
    props.setIsOpen(false);
    setWithdrawalAmount("");
  };

  const { base, container } = parentModal({
    isOpen: props.isOpen,
  });

  return (
    <>
      <div className={base()}>
        <div className={container()}>
          {!showSuccess ? (
            <>
              <div className="p-0 pb-4">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-semibold text-[#292929]">
                    Withdraw Funds
                  </div>
                  <Button
                    variant="ghost"
                    onClick={handleClose}
                    className="[&_svg]:size-8 p-0"
                  >
                    <X />
                  </Button>
                </div>
              </div>

              <div className="space-y-8">
                <div className="p-4 pb-9 bg-white border border-[#DCDCDC] rounded-[16px] space-y-10">
                  <h3 className="font-semibold text-[16px] leading-[22px] text-gray-900 mb-2">
                    Current Bank Account
                  </h3>
                  <div>
                    <p className="text-sm font-normal text-[#989898] mb-1">
                      Connected to Citibank
                    </p>
                    <p className="text-[16px] leading-[22px] font-normal text-[#292929]">
                      Account **** 3432
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <CustomLabel htmlFor="amount" text="Amount" />
                  <CustomInput
                    id="amount"
                    placeholder="Amount"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => handleSubmit(withdrawalAmount)}
                    className="w-full bg-[#F28C0D] hover:bg-[#F28C0D] text-white text-[16px] leading-[22px] py-3 rounded-full"
                  >
                    Confirm
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="w-full py-3 rounded-full text-[16px] leading-[22px] border-[#9C5432] text-[#292929] hover:bg-gray-50 bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 flex flex-col gap-y-6 items-center justify-center">
              <div className="flex items-center justify-center w-16 h-16 bg-[#FFFBED] rounded-full">
                <Smile className="w-[30px] h-[30px] text-[#F28C0D]" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Withdrawal Successful!
              </h2>
              <Button
                onClick={handleClose}
                variant="outline"
                className="w-full py-4 rounded-full font-semibold text-sm border-[#9C5432] text-[#292929] hover:bg-transparent bg-transparent"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
