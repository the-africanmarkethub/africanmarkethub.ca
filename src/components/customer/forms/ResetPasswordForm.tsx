import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Control, FieldValues } from "react-hook-form";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import { FormFieldType } from "@/constants/customer/formFieldType";
import SubmitButton from "../SubmitButton";
import { useResetPassword } from "@/hooks/customer/useResetPassword";
import { getDeviceInfo } from "@/utils/helper";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPasswordForm = () => {
  const resetPasswordMutation = useResetPassword();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    // Get email and token from localStorage
    const storedEmail = localStorage.getItem("resetPasswordEmail");
    const storedToken = localStorage.getItem("resetPasswordToken");
    
    if (!storedEmail || !storedToken) {
      // Redirect back to forgot password if no data found
      router.push("/customer/forgot-password");
      return;
    }
    
    setEmail(storedEmail);
    setToken(storedToken);
  }, [router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const resetData = {
      email: email,
      new_password: values.password,
      confirmation_code: token,
      device_name: getDeviceInfo(),
    };
    
    resetPasswordMutation.mutate(resetData);
    
    // Clear stored data after successful submission
    localStorage.removeItem("resetPasswordEmail");
    localStorage.removeItem("resetPasswordToken");
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
                  label="New Password"
                  placeholder="Enter new password"
                  widthClass=""
                />
                <CustomFormField
                  isEditable
                  fieldType={FormFieldType.PASSWORD}
                  control={form.control as unknown as Control<FieldValues>}
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="Confirm new password"
                  widthClass=""
                />
              </div>
            </div>

            <SubmitButton
              className="h-11 md:h-14 w-full font-semibold text-sm md:text-lg rounded-[39px]"
              isLoading={resetPasswordMutation.isPending}
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
