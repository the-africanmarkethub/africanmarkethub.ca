import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormMessage 
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import SubmitButton from "../SubmitButton";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  pin: z.string().min(6, "Confirmation code must be 6 characters"),
});

const VerifyResetTokenForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Get email from localStorage only
    const emailFromStorage = localStorage.getItem("resetPasswordEmail");
    
    if (emailFromStorage) {
      setEmail(emailFromStorage);
    } else {
      // Redirect back to forgot password if no email found
      router.push("/customer/forgot-password");
    }
  }, [router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pin: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Store the token and navigate to reset password page
    localStorage.setItem("resetPasswordToken", values.pin);
    router.push("/customer/reset-password");
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6 py-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Verify Reset Code
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Enter the 6-digit code sent to {email}
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
            isLoading={form.formState.isSubmitting}
          >
            Verify Code
          </SubmitButton>
        </form>
      </Form>
    </div>
  );
};

export default VerifyResetTokenForm;