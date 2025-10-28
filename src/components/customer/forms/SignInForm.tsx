import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SubmitButton from "../SubmitButton";
import CustomFormField from "../CustomFormField";
import { FormFieldType } from "@/constants/customer/formFieldType";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import GoogleAuthButton from "../authBotton/GoogleAuthButton";
import { getDeviceInfo, getIpAddress } from "@/utils/helper";
import { useLogin } from "@/hooks/customer/useLogin";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function SignInForm() {
  const loginMutation = useLogin();

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
    const deviceInfo = getDeviceInfo();
    const ipAddress = await getIpAddress();

    loginMutation.mutate({
      email: values.email,
      password: values.password,
      device_name: deviceInfo,
      ip_address: ipAddress,
    });
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <h1 className="font-semibold text-2xl text-gray-900">Log in</h1>

          {/* Form Fields */}
          <div className="space-y-4">
            <CustomFormField
              isEditable
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label="Email Address"
              placeholder="Your Email Address"
              widthClass="w-full"
            />

            <CustomFormField
              isEditable
              fieldType={FormFieldType.PASSWORD}
              control={form.control}
              name="password"
              label="Password"
              placeholder="Your Password"
              widthClass="w-full"
            />

            <div className="text-[#7E442E] mt-2 text-sm flex justify-end">
              <a href="/customer/forgot-password" className="hover:underline">
                Forgot password?
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <SubmitButton
            className="h-12 w-full text-white text-base font-medium rounded-full"
            isLoading={loginMutation.isPending}
          >
            Log in
          </SubmitButton>
        </form>
      </Form>

      {/* Divider */}
      <div className="flex items-center justify-center">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-gray-500 text-sm">Or continue with</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Google Button */}
      <GoogleAuthButton />

      {/* Sign up link */}
      <div className="text-center text-sm">
        <p>
          Don&apos;t have an account?{" "}
          <a
            href="/customer/sign-up"
            className="text-[#7E442E] hover:underline font-medium"
          >
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignInForm;
