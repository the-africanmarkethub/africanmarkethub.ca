import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import { FormFieldType } from "@/constants/vendor/formFieldType";
import SubmitButton from "../SubmitButton";
// import { useForgetPasswordCode } from "@/hooks/useForgetPasswordCode";

const formSchema = z.object({
  email: z.string().email(),
});

const ForgotPasswordForm = () => {
  // const { mutate: sendCode, isPending } = useForgetPasswordCode();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted", values);
    // sendCode(values.email);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <section className="flex flex-col items-center justify-center space-y-6">
            <div className="w-[327px] lg:w-[462px]">
              <div className="mb-3 text-[28px] font-semibold md:mb-6">
                <h1 className="mb-2 text-[28px] font-semibold">
                  Forgot Password
                </h1>
                <p className="text-xs leading-4 font-normal text-[#5C5F6A]">
                  Enter the email address or mobile phone number associated with
                  your African Market Hub account.
                </p>
              </div>

              <CustomFormField
                isEditable
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email Address"
                placeholder="Your Email Address"
                widthClass=""
              />
            </div>

            <SubmitButton
              className="h-11 w-full text-[#FFFFFF] rounded-[39px] text-sm font-semibold md:h-14 md:text-lg"
              isLoading={false}
            >
              Send Code
            </SubmitButton>
          </section>

          <div className="mt-4 flex flex-col gap-2 text-center">
            <p className="flex justify-center gap-2 leading-[22px]">
              Don’t have an account?
              <a href="/sign-up" className="text-[#7E442E] hover:underline">
                Create Account
              </a>
            </p>

            <p className="leading-[22px]">
              Already have an account?{" "}
              <a href="/" className="text-[#7E442E] hover:underline">
                Login
              </a>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordForm;
