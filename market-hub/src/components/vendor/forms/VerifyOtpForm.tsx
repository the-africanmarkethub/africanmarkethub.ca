import React, { useEffect, useState } from "react";
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
// import { verifyEmail } from "@/hooks/useVerifyEmail";
// import { VerifyEmailPayload } from "@/types/auth.types";
// import { toast } from "sonner";
// import { useRouter, useSearchParams } from "next/navigation";

const formSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

const VerifyOtpForm = () => {
  const [loading, /* setLoading */] = useState(false);
  const [/* email */, /* setEmail */] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(20);
  // const searchParams = useSearchParams();
  // const emailFromUrl = sessionStorage.getItem("email");

  // const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pin: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("Form submitted", data);
    // setLoading(true);
    // const res = await verifyEmail({
    //   otp: data.pin,
    //   email: email as string,
    // });
    // setLoading(false);
    // if (res) {
    //   toast.success("Email verified successfully");
    //   router.replace("/sign-in");
    // }
  }

  // useEffect(() => {
  //   if (emailFromUrl) {
  //     setEmail(emailFromUrl);
  //   }
  // }, [emailFromUrl]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <div className="space-y-6">
                <section className="">
                  <h1 className="text-[28px] font-semibold">
                    Enter Verification Code
                  </h1>
                  <p className="text-xs leading-4 text-[#5C5F6A]">
                    We have sent a 6-digit code to your email
                  </p>
                </section>

                <FormItem className="flex flex-col  justify-center">
                  <FormControl>
                    <InputOTP className="space-x-4" maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot
                          className="h-[62px] w-[62px] border-[0.78px] border-[#9C5432] focus:ring focus:ring-[#E7E6E8] focus-visible:outline-none"
                          index={0}
                        />
                      </InputOTPGroup>

                      <InputOTPGroup>
                        <InputOTPSlot
                          className="h-[62px] w-[62px] border-[0.78px] border-[#9C5432] focus-visible:outline-none"
                          index={1}
                        />
                      </InputOTPGroup>

                      <InputOTPGroup>
                        <InputOTPSlot
                          className="h-[62px] w-[62px] border-[0.78px] border-[#9C5432] focus-visible:outline-none"
                          index={2}
                        />
                      </InputOTPGroup>

                      <InputOTPGroup>
                        <InputOTPSlot
                          className="h-[62px] w-[62px] border-[0.78px] border-[#9C5432] focus-visible:outline-none"
                          index={3}
                        />
                      </InputOTPGroup>

                      <InputOTPGroup>
                        <InputOTPSlot
                          className="h-[62px] w-[62px] border-[0.78px] border-[#9C5432] focus-visible:outline-none"
                          index={4}
                        />
                      </InputOTPGroup>

                      <InputOTPGroup>
                        <InputOTPSlot
                          className="h-[62px] w-[62px] border-[0.78px] border-[#9C5432] focus-visible:outline-none"
                          index={5}
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>

                  <FormMessage />
                </FormItem>

                <SubmitButton
                  className="h-11 w-full text-[#FFFFFF] rounded-[39px] text-sm md:h-14 md:text-lg"
                  isLoading={loading}
                >
                  Verify
                </SubmitButton>

                <FormDescription className="text-center text-base leading-6 font-normal text-[#000000]">
                  {timeLeft > 0 ? (
                    <>
                      Request a new code in{" "}
                      <span className="text-[#7E442E]">{timeLeft} seconds</span>
                    </>
                  ) : (
                    <span className="cursor-pointer text-[#7E442E] hover:underline">
                      Request new code
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
