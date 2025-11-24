import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Control, FieldValues } from "react-hook-form";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import { FormFieldType } from "@/constants/customer/formFieldType";
import SubmitButton from "../SubmitButton";
import GoogleAuthButton from "../authBotton/GoogleAuthButton";
import { getDeviceInfo, getIpAddress } from "@/utils/helper";
import { signUp } from "@/services/authService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Define error response type
interface ErrorResponse {
  response?: {
    status: number;
    data: {
      message?: string;
      errors?: {
        [key: string]: string[];
      };
    };
  };
}

// Simple payload type for signup
interface SignupPayload {
  email: string;
  password: string;
  name: string;
  last_name: string;
  phone: string;
  ip_address: string;
  device_name: string;
  role: string;
  referral_code?: string;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email(),
  phone: z.string()
    .min(1, { message: "Phone number is required" })
    .refine((phone) => {
      // Canadian phone number validation for +1XXXXXXXXXX format
      const phoneRegex = /^\+1[2-9]\d{9}$/;
      return phoneRegex.test(phone);
    }, {
      message: "Please enter a valid Canadian phone number (+1 XXX XXX XXXX)",
    }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&]/, {
      message: "Password must contain at least one special character",
    }),
  // location: z.string().min(2, {
  //   message: "Location must be at least 2 characters.",
  // }),
  referral_code: z.string().optional(),
  termsAndConditions: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

interface CreateAccountFormProps {
  referralCode?: string | null;
}

function CreateAccountForm({ referralCode }: CreateAccountFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      // location: "",
      referral_code: referralCode || "",
      termsAndConditions: false,
    },
  });

  async function onSubmit(values: FormData) {
    const deviceInfo = getDeviceInfo();
    const ipAddress = await getIpAddress();

    const nameParts = values.name.trim().split(" ");
    const name = nameParts[0] || "";
    const last_name = nameParts.slice(1).join(" ") || "";

    const payload: SignupPayload = {
      email: values.email,
      password: values.password,
      name: name,
      last_name: last_name,
      phone: values.phone,
      ip_address: ipAddress,
      device_name: deviceInfo,
      role: "customer",
      ...(values.referral_code && { referral_code: values.referral_code }),
    };
    try {
      setLoading(true);
      const res = await signUp(payload);
      // Check if we got a successful response (with message field)
      if (res && res.message) {
        toast.success(res.message || `Welcome to African Market Hub, ${name}!`);
        sessionStorage.setItem("email", values.email);
        sessionStorage.setItem("phoneNumber", values.phone);
        router.replace("/customer/verify-otp");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      let errorMessage = "Failed to register. Please try again.";

      const err = error as ErrorResponse;
      if (err.response) {
        const { status, data } = err.response;

        if (status === 422) {
          if (data.errors) {
            // Extract first validation error
            const firstErrorKey = Object.keys(data.errors)[0];
            const firstError = data.errors[firstErrorKey];
            if (Array.isArray(firstError) && firstError.length > 0) {
              errorMessage = firstError[0];
            }
          } else if (data.message) {
            errorMessage = data.message;
          }
        } else {
          errorMessage = data.message || "An unexpected error occurred.";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6 pb-9">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="">
            <h1 className="font-semibold text-xl md:text-[28px] text-gray-900">
              Create Account
            </h1>
          </div>

          <div className="space-y-4">
            <CustomFormField
              isEditable
              fieldType={FormFieldType.INPUT}
              control={form.control as unknown as Control<FieldValues>}
              name="name"
              label="Name"
              placeholder="First name & Last name"
              widthClass="w-full"
            />
            <CustomFormField
              isEditable
              fieldType={FormFieldType.INPUT}
              control={form.control as unknown as Control<FieldValues>}
              name="email"
              label="Email Address"
              placeholder="Your Email Address"
              widthClass="w-full"
            />
            <CustomFormField
              isEditable
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control as unknown as Control<FieldValues>}
              name="phone"
              label="Phone Number"
              placeholder="+1 604 555 5555"
              widthClass="w-full"
            />
            <CustomFormField
              isEditable
              fieldType={FormFieldType.PASSWORD}
              control={form.control as unknown as Control<FieldValues>}
              name="password"
              label="Password"
              placeholder="Your password"
              widthClass="w-full"
            />
          </div>

          <div className="mt-4">
            <CustomFormField
              fieldType={FormFieldType.CHECKBOX}
              control={form.control as unknown as Control<FieldValues>}
              name="termsAndConditions"
              label="By creating an account you agree with our Terms of Service, and Privacy Policy."
              className="text-sm"
            />
          </div>

          <SubmitButton
            className="h-11 md:h-14 w-full text-white text-sm md:text-lg rounded-[39px] mt-6"
            isLoading={loading}
          >
            Create account
          </SubmitButton>
        </form>
      </Form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <GoogleAuthButton />

      <div className="text-center mt-6">
        <p className="text-xs md:text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/customer/sign-in"
            className="text-[#7E442E] hover:underline font-medium"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default CreateAccountForm;
