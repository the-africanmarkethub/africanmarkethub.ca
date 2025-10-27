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

const EmailVerification = () => {
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
                  Verify Your Email
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
              isLoading={false}
            >
              Verify
            </SubmitButton>
          </section>
        </form>
      </Form>
    </div>
  );
};

export default EmailVerification;
