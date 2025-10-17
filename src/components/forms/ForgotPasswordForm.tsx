import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import { FormFieldType } from "@/constants/formFieldType";
import SubmitButton from "../SubmitButton";
import { Control, FieldValues } from "react-hook-form";
import { useForgotPassword } from "@/hooks/useForgotPassword";

const formSchema = z.object({
  email: z.string().email(),
});

const ForgotPasswordForm = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordMutation = useForgotPassword();

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    forgotPasswordMutation.mutate(values);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <section className="flex flex-col items-center justify-center space-y-6">
            <div className="lg:w-[462px] w-[327px] ">
              <div className="font-semibold mb-3 md:mb-6 text-[28px]">
                <h1 className="text-[28px] font-semibold mb-2">
                  {" "}
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
                control={form.control as unknown as Control<FieldValues>}
                name="email"
                label="Email Address"
                placeholder="Your Email Address"
                widthClass=""
              />
            </div>

            <SubmitButton
              className="h-11 md:h-14 w-full font-semibold text-sm md:text-lg rounded-[39px]"
              isLoading={forgotPasswordMutation.isPending}
            >
              Send Code{" "}
            </SubmitButton>
          </section>

          <div className="text-center mt-4 flex flex-col gap-2">
            <p className="leading-[22px] flex gap-2 justify-center">
              Don&apos;t have an account?
              <a href="/sign-up" className="text-[#7E442E] hover:underline">
                Create Account
              </a>
            </p>

            <p className="leading-[22px]">
              Already have an account?{" "}
              <a href="/sign-in" className="text-[#7E442E] hover:underline">
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
