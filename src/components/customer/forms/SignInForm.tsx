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
    <div className="space-y-4 pb-9">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="">
            <section className="font-semibold mb-3 md:mb-6 text-xl md:text-[28px]">
              Log in
            </section>

            <div className="lg:w-[462px] w-[327px]">
              <section className="space-y-4">
                <CustomFormField
                  isEditable
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="email"
                  label="Email Address"
                  placeholder="Your Email Address"
                  widthClass=""
                />

                <CustomFormField
                  isEditable
                  fieldType={FormFieldType.PASSWORD}
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="Your password"
                  widthClass=""
                />
              </section>

              <div className="text-[#7E442E] mt-2 text-xs md:text-sm flex justify-end">
                <a href="/forgot-password" className="hover:underline">
                  Forgot Password?
                </a>
              </div>
            </div>
          </div>

          <SubmitButton
            className="h-11 md:h-14 w-full text-sm md:text-lg rounded-[39px]"
            isLoading={loginMutation.isPending}
          >
            Log in
          </SubmitButton>
        </form>
      </Form>

      <div className="flex items-center justify-center mt-6 mb-4">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-gray-500 text-xs md:text-sm">
          Or continue with
        </span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      <GoogleAuthButton />

      <div className="text-center text-xs md:text-sm">
        <p className="leading-[22px]">
          Don&apos;t have an account?{" "}
          <a
            href="/customer/sign-up"
            className="text-[#7E442E] hover:underline"
          >
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignInForm;
