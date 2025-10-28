import React, { useState, useEffect } from "react";
import SubmitButton from "../SubmitButton";
import { z } from "zod";
// import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useVerifyEmail } from "@/hooks/customer/useVerifyEmail";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

const VerifyOtpForm = () => {
  const [timeLeft, setTimeLeft] = useState(20);
  const [canResend, setCanResend] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();
  const verifyEmailMutation = useVerifyEmail();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  useEffect(() => {
    // Get email from sessionStorage on client side
    const email = sessionStorage.getItem("email");
    setUserEmail(email || "");
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleResendCode = () => {
    setTimeLeft(20);
    setCanResend(false);
    toast.success("New verification code sent!");
    // Add your resend code logic here
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);

    try {
      const email = sessionStorage.getItem("email");

      if (!email) {
        toast.error("Email not found. Please try signing up again.");
        router.replace("/sign-up");
        return;
      }

      const result = await verifyEmailMutation.mutateAsync({
        email,
        otp: data.pin,
      });

      if (result) {
        toast.success("Email verified successfully");
        router.replace("/sign-in");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      toast.error("Verification failed. Please try again.");
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6 py-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Enter Verification Code
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          We have sent a 6-digit to {userEmail}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem className="space-y-6">
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <div className="flex gap-2 justify-center">
                      <InputOTPGroup>
                        <InputOTPSlot
                          className="w-[63.67px] h-[52px] border border-gray-300 px-4 py-2.5 text-lg font-semibold focus:border-[#E7931A] focus:ring-2 focus:ring-[#E7931A]/20 focus-visible:outline-none !rounded-[4px]"
                          index={0}
                        />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot
                          className="w-[63.67px] h-[52px] border border-gray-300 px-4 py-2.5 text-lg font-semibold focus:border-[#E7931A] focus:ring-2 focus:ring-[#E7931A]/20 focus-visible:outline-none !rounded-[4px]"
                          index={1}
                        />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot
                          className="w-[63.67px] h-[52px] border border-gray-300 px-4 py-2.5 text-lg font-semibold focus:border-[#E7931A] focus:ring-2 focus:ring-[#E7931A]/20 focus-visible:outline-none !rounded-[4px]"
                          index={2}
                        />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot
                          className="w-[63.67px] h-[52px] border border-gray-300 px-4 py-2.5 text-lg font-semibold focus:border-[#E7931A] focus:ring-2 focus:ring-[#E7931A]/20 focus-visible:outline-none !rounded-[4px]"
                          index={3}
                        />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot
                          className="w-[63.67px] h-[52px] border border-gray-300 px-4 py-2.5 text-lg font-semibold focus:border-[#E7931A] focus:ring-2 focus:ring-[#E7931A]/20 focus-visible:outline-none !rounded-[4px]"
                          index={4}
                        />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot
                          className="w-[63.67px] h-[52px] border border-gray-300 px-4 py-2.5 text-lg font-semibold focus:border-[#E7931A] focus:ring-2 focus:ring-[#E7931A]/20 focus-visible:outline-none !rounded-[4px]"
                          index={5}
                        />
                      </InputOTPGroup>
                    </div>
                  </InputOTP>
                </FormControl>
                <FormMessage className="text-center text-red-500" />
              </FormItem>
            )}
          />

          <SubmitButton
            className="h-12 md:h-14 w-full text-white text-sm md:text-lg rounded-[39px] bg-[#E7931A] hover:bg-[#E7931A]/90"
            isLoading={verifyEmailMutation.isPending}
          >
            Verify
          </SubmitButton>

          <div className="text-center space-y-2">
            <p className="text-gray-600 text-sm md:text-base">
              {canResend ? (
                <span>
                  Haven&apos;t received code?{" "}
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-[#E7931A] hover:underline font-medium"
                  >
                    Resend Code
                  </button>
                </span>
              ) : (
                <span>
                  Haven&apos;t received code?{" "}
                  <span className="text-[#E7931A] font-medium">
                    Resend Code
                  </span>
                </span>
              )}
            </p>
            {!canResend && (
              <p className="text-[#E7931A] font-medium text-lg">
                {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
                {String(timeLeft % 60).padStart(2, "0")}s
              </p>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default VerifyOtpForm;
