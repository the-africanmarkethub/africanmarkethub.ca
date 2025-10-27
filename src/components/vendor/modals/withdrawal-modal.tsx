"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/vendor/ui/dialog";
import { Button } from "@/components/vendor/ui/button";
import { Card } from "@/components/vendor/ui/card";
import { X } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import CustomFormField from "@/components/vendor/CustomFormField";
import { FormFieldType } from "@/constants/vendor/formFieldType";
import SubmitButton from "@/components/vendor/SubmitButton";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  totalEarning: string;
  isLoading?: boolean;
}

interface WithdrawalFormData {
  amount: string;
}

export function WithdrawalModal({
  isOpen,
  onClose,
  onConfirm,
  totalEarning,
  isLoading = false,
}: WithdrawalModalProps) {
  const maxAmount = parseFloat(totalEarning.replace(/[^\d.-]/g, "")) || 0;

  const form = useForm<WithdrawalFormData>({
    defaultValues: {
      amount: "",
    },
  });

  const onSubmit = (data: WithdrawalFormData) => {
    const amount = parseFloat(data.amount);

    if (amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (amount > maxAmount) {
      alert("Amount cannot exceed available earnings");
      return;
    }

    onConfirm(amount);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[400px] p-0 bg-white">
        <DialogHeader className="px-6 py-4 border-b border-[#EEEEEE]">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Withdraw Funds
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 py-4">
          {/* Available Balance Card */}
          <Card className="p-4 bg-[#FFF6D5] border-[#E67E22] mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Available Balance</p>
              <p className="text-2xl font-bold text-[#E67E22]">
                {totalEarning}
              </p>
            </div>
          </Card>

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Amount Field */}
              <CustomFormField
                control={form.control}
                name="amount"
                label="Withdrawal Amount"
                fieldType={FormFieldType.NUMBER}
                placeholder="Enter amount"
                isEditable
              />

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <SubmitButton
                  type="submit"
                  className="flex-1 text-white"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Confirm Withdrawal"}
                </SubmitButton>
              </div>
            </form>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}
