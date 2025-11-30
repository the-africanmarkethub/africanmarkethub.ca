"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SubmitButton from "../SubmitButton";
import CustomFormField from "../CustomFormField";
import { Form } from "@/components/vendor/ui/form";
import { useForm } from "react-hook-form";
// import { useAuth } from "@/hooks/useAuth";
// import { getDeviceInfo, getIpAddress } from "@/utils/helper";
import GoogleAuthButton from "../authButton/GoogleAuthButton";
import { FormFieldType } from "@/constants/vendor/formFieldType";
import { getDeviceInfo, getIpAddress } from "@/utils/utils";
import { useSignIn, ValidationError } from "@/hooks/vendor/useSignIn";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function SignInForm() {
  const { mutate: login, isPending: isLoginLoading } = useSignIn();

  //   1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {

    // try {
    const deviceInfo = getDeviceInfo();
    const ipAddress = await getIpAddress();
    const payload = {
      email: values.email,
      password: values.password,
      device_name: deviceInfo,
      ip_address: ipAddress,
    };
    login(payload, {
      onError: (error: ValidationError) => {
        // Set field-specific errors if available
        if (error.validationErrors) {
          Object.entries(error.validationErrors).forEach(
            ([field, messages]) => {
              if (field === "email" || field === "password") {
                form.setError(field as "email" | "password", {
                  type: "manual",
                  message: messages[0],
                });
              }
            }
          );
        }
      },
    });
    // } catch (error) {
    //   console.error("Login failed", error);
    // }
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="">
            <section className="mb-3 text-[28px] font-semibold md:mb-6">
              Vendor Log in
            </section>

            <section className="w-[327px] lg:w-[462px]">
              <div className="space-y-4">
                <CustomFormField
                  isEditable
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="email"
                  label="Email Address"
                  placeholder="Your Email Address"
                  // widthClass=""
                />

                <CustomFormField
                  isEditable
                  fieldType={FormFieldType.PASSWORD}
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="Your password"
                  // widthClass=""
                />
              </div>
              <div className="mt-2 flex justify-end text-sm text-[#7E442E]">
                <a href="/vendor/forgot-password" className="hover:underline">
                  Forgot Password?
                </a>
              </div>
            </section>
          </div>

          <SubmitButton
            className="h-11 w-full rounded-[39px] text-sm md:h-14 md:text-lg"
            isLoading={isLoginLoading}
          >
            Log in
          </SubmitButton>
        </form>
      </Form>

      <div className="mt-6 mb-4 flex items-center justify-center">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-sm text-gray-500">Or continue with</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      <GoogleAuthButton />

      {/* <div className="mt-4 text-center">
        <p className="flex justify-center gap-2 leading-[22px]">
          Don’t have an account?
          <a href="/create-shop" className="text-[#7E442E] hover:underline">
            Create Account
          </a>
        </p>
      </div> */}
    </div>
  );
}

export default SignInForm;
