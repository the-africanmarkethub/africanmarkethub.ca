import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import { FormFieldType } from "@/constants/vendor/formFieldType";
import SubmitButton from "../SubmitButton";

const formSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const ResetPasswordForm = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <section className="flex flex-col items-center justify-center space-y-6">
            <div className="w-[327px] lg:w-[462px]">
              <div className="mb-3 text-[28px] font-semibold md:mb-6">
                <h1 className="mb-2 text-[28px] font-semibold">
                  Reset Password
                </h1>
              </div>

              <div className="space-y-4">
                <CustomFormField
                  isEditable
                  fieldType={FormFieldType.PASSWORD}
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="Password"
                  widthClass=""
                />
                <CustomFormField
                  isEditable
                  fieldType={FormFieldType.PASSWORD}
                  control={form.control}
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="Confirm Password"
                  widthClass=""
                />
              </div>
            </div>

            <SubmitButton
              className="h-11 text-[#FFFFFF] w-full rounded-[39px] text-sm font-semibold md:h-14 md:text-lg"
              isLoading={false}
            >
              Reset Password
            </SubmitButton>
          </section>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
