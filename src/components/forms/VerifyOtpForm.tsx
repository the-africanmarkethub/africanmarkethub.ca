import React, { useState, useEffect } from "react";
import SubmitButton from "../SubmitButton";
import { z } from "zod";
// import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useVerifyEmail } from "@/hooks/useVerifyEmail";

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
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <div className="space-y-4 sm:space-y-6">
                <section className="">
                  <h1 className="font-semibold text-xl sm:text-2xl md:text-[28px] text-center md:text-left">
                    Enter Verification Code
                  </h1>
                  <p className="text-xs sm:text-sm leading-4 text-[#5C5F6A] text-center md:text-left">
                    We have sent a 6-digit code to {userEmail}
                  </p>
                </section>

                <FormItem className="flex flex-col justify-center items-center">
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <div className="flex gap-2 sm:gap-3 justify-center">
                        <InputOTPGroup>
                          <InputOTPSlot
                            className="border-[0.78px] border-[#9C5432] w-10 h-10 sm:w-12 sm:h-12 md:w-[62px] md:h-[62px] focus-visible:outline-none focus:ring focus:ring-[#E7E6E8] text-sm sm:text-base"
                            index={0}
                          />
                        </InputOTPGroup>

                        <InputOTPGroup>
                          <InputOTPSlot
                            className="border-[0.78px] border-[#9C5432] w-10 h-10 sm:w-12 sm:h-12 md:w-[62px] md:h-[62px] focus-visible:outline-none text-sm sm:text-base"
                            index={1}
                          />
                        </InputOTPGroup>

                        <InputOTPGroup>
                          <InputOTPSlot
                            className="border-[0.78px] border-[#9C5432] w-10 h-10 sm:w-12 sm:h-12 md:w-[62px] md:h-[62px] focus-visible:outline-none text-sm sm:text-base"
                            index={2}
                          />
                        </InputOTPGroup>

                        <InputOTPGroup>
                          <InputOTPSlot
                            className="border-[0.78px] border-[#9C5432] w-10 h-10 sm:w-12 sm:h-12 md:w-[62px] md:h-[62px] focus-visible:outline-none text-sm sm:text-base"
                            index={3}
                          />
                        </InputOTPGroup>

                        <InputOTPGroup>
                          <InputOTPSlot
                            className="border-[0.78px] border-[#9C5432] w-10 h-10 sm:w-12 sm:h-12 md:w-[62px] md:h-[62px] focus-visible:outline-none text-sm sm:text-base"
                            index={4}
                          />
                        </InputOTPGroup>

                        <InputOTPGroup>
                          <InputOTPSlot
                            className="border-[0.78px] border-[#9C5432] w-10 h-10 sm:w-12 sm:h-12 md:w-[62px] md:h-[62px] focus-visible:outline-none text-sm sm:text-base"
                            index={5}
                          />
                        </InputOTPGroup>
                      </div>
                    </InputOTP>
                  </FormControl>

                  <FormMessage />
                </FormItem>

                <SubmitButton
                  className="h-11 md:h-14 w-full text-sm md:text-lg rounded-[39px]"
                  isLoading={verifyEmailMutation.isPending}
                >
                  Verify
                </SubmitButton>

                <FormDescription className="text-center leading-6 text-[#000000] font-normal text-base">
                  {canResend ? (
                    <span>
                      Didn&apos;t receive the code?{" "}
                      <button
                        type="button"
                        onClick={handleResendCode}
                        className="text-[#7E442E] hover:underline cursor-pointer"
                      >
                        Resend code
                      </button>
                    </span>
                  ) : (
                    <span>
                      Request a new code in{" "}
                      <span className="text-[#7E442E]">{timeLeft} seconds</span>
                    </span>
                  )}
                </FormDescription>
              </div>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default VerifyOtpForm;
