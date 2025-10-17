import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Control, FieldValues } from "react-hook-form";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import { FormFieldType } from "@/constants/formFieldType";
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
        email?: string[];
        phone?: string[];
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
  phone: z.string().min(12, {
    message: "Phone number must be at least 10 characters.",
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
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
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
      location: "",
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
      if (res) {
        toast.success(`Welcome to African Market Hub, ${name}!`);
        sessionStorage.setItem("email", values.email);
        sessionStorage.setItem("phoneNumber", values.phone);
        router.replace("/verify-otp");
      }
    } catch (error) {
      setLoading(false);
      let errorMessage = "Failed to register. Please try again.";

      const err = error as ErrorResponse;
      if (err.response) {
        const { status, data } = err.response;
        if (status === 422) {
          if (data.errors?.email) {
            errorMessage =
              "This email is already registered. Please use a different email or try signing in.";
          } else if (data.errors?.phone) {
            errorMessage =
              "This phone number is already registered. Please use a different phone number.";
          } else {
            errorMessage =
              data.message || "Please check your input and try again.";
          }
        } else {
          errorMessage = data.message || "An unexpected error occurred.";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      console.error("Registration error:", error);
    }
  }

  return (
    <div className="space-y-4 pb-9">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="">
            <section className="font-semibold mb-3 md:mb-6 text-xl md:text-[28px]">
              Create Account
            </section>

            <div className="lg:w-[462px] w-[327px]">
              <section className="space-y-4">
                <CustomFormField
                  isEditable
                  fieldType={FormFieldType.INPUT}
                  control={form.control as unknown as Control<FieldValues>}
                  name="name"
                  label="Name"
                  placeholder="First name & Last name"
                  widthClass=""
                />
                <CustomFormField
                  isEditable
                  fieldType={FormFieldType.INPUT}
                  control={form.control as unknown as Control<FieldValues>}
                  name="email"
                  label="Email Address"
                  placeholder="Your Email Address"
                  widthClass=""
                />
                <CustomFormField
                  isEditable
                  fieldType={FormFieldType.PHONE_INPUT}
                  control={form.control as unknown as Control<FieldValues>}
                  name="phone"
                  label="Phone Number"
                  placeholder="Your Phone Number"
                  widthClass=""
                />
                <CustomFormField
                  isEditable
                  fieldType={FormFieldType.PASSWORD}
                  control={form.control as unknown as Control<FieldValues>}
                  name="password"
                  label="Password"
                  placeholder="Your password"
                  widthClass=""
                />
                <CustomFormField
                  isEditable
                  fieldType={FormFieldType.INPUT}
                  control={form.control as unknown as Control<FieldValues>}
                  name="location"
                  label="Location"
                  placeholder="Your Location"
                  widthClass=""
                />
              </section>
              <CustomFormField
                fieldType={FormFieldType.CHECKBOX}
                control={form.control as unknown as Control<FieldValues>}
                name="termsAndConditions"
                label="By creating an account you agree with our Terms of Service, and Privacy Policy."
                className="font-bold"
              />
            </div>
          </div>

          <SubmitButton
            className="h-11 md:h-14 w-full text-sm md:text-lg rounded-[39px]"
            isLoading={loading}
          >
            Create account
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
          Already have an account?
          <a href="/sign-in" className="text-[#7E442E] hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default CreateAccountForm;
