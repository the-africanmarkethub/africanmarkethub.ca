import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Control, FieldValues } from "react-hook-form";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import { FormFieldType } from "@/constants/customer/formFieldType";
import SubmitButton from "../SubmitButton";

const formSchema = z.object({
  email: z.string().email(),
});

const ResetPasswordForm = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
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
            <div className="lg:w-[462px] w-[327px] ">
              <div className="font-semibold mb-3 md:mb-6 text-[28px]">
                <h1 className="text-[28px] font-semibold mb-2">
                  Reset Password
                </h1>
              </div>

              <div className="space-y-4">
                <CustomFormField
                  isEditable
                  fieldType={FormFieldType.PASSWORD}
                  control={form.control as unknown as Control<FieldValues>}
                  name="password"
                  label="Password"
                  placeholder="Password"
                  widthClass=""
                />
                <CustomFormField
                  isEditable
                  fieldType={FormFieldType.PASSWORD}
                  control={form.control as unknown as Control<FieldValues>}
                  name="confrimPassword"
                  label="Confirm Password"
                  placeholder="Confirm Password"
                  widthClass=""
                />
              </div>
            </div>

            <SubmitButton
              className="h-11 md:h-14 w-full font-semibold text-sm md:text-lg rounded-[39px]"
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
