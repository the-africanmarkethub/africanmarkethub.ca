"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import toast from "react-hot-toast";
import { useRegister } from "@/hooks/useAuth";
import { PasswordInput } from "@/components/PasswordInput";
import { GoogleOAuthButton } from "@/components/GoogleOAuthButton";

// Validation schema
const schema = yup.object({
  name: yup
    .string()
    .required("First name is required")
    .min(2, "Must be at least 2 characters")
    .matches(/^[A-Za-z\s]+$/, "Name must contain only letters"),
  last_name: yup
    .string()
    .required("Last name is required")
    .min(2, "Must be at least 2 characters")
    .matches(/^[A-Za-z\s]+$/, "Last name must contain only letters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  phone: yup
    .string()
    .required("Phone number is required")
    .min(10, "Please enter a valid phone number"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain an uppercase letter")
    .matches(/[a-z]/, "Password must contain a lowercase letter")
    .matches(/\d/, "Password must contain a number")
    .matches(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      "Password must contain a symbol"
    ),
});

type FormData = yup.InferType<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const register = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = (data: FormData) => {
    register.mutate(
      {
        name: data.name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        role: "customer",
        password: data.password,
      },
      {
        onSuccess: () => {
          toast.success("Account created successfully!");
          router.push(
            `/auth/verify-email?email=${encodeURIComponent(data.email)}`
          );
        },
        onError: (error: any) => {
          console.error("Registration failed:", error);

          // Handle the exact API error structure: {errors: {email: ["message"]}}
          if (error?.errors) {
            const apiErrors = error.errors;
            Object.keys(apiErrors).forEach((field) => {
              const messages = apiErrors[field];
              if (Array.isArray(messages)) {
                messages.forEach((message: string) => {
                  toast.error(message);
                });
              } else if (typeof messages === "string") {
                toast.error(messages);
              }
            });
          } else {
            toast.error(
              error?.message || "Registration failed. Please try again."
            );
          }
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              First Name
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="name"
                  type="text"
                  placeholder="First name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors text-gray-900"
                />
              )}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Last Name
            </label>
            <Controller
              name="last_name"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="last_name"
                  type="text"
                  placeholder="Last name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors text-gray-900"
                />
              )}
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.last_name.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id="email"
                type="email"
                placeholder="Your Email Address"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors text-gray-900"
              />
            )}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Phone Number
          </label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInput
                {...field}
                countries={["CA"]}
                defaultCountry="CA"
                placeholder="(123) 456-7890"
                className="phone-input-custom"
              />
            )}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
          <style jsx global>{`
            .phone-input-custom {
              display: flex !important;
            }
            .phone-input-custom .PhoneInputInput {
              width: 100% !important;
              padding: 0.75rem 1rem !important;
              border: 1px solid #e5e7eb !important;
              border-left: none !important;
              border-radius: 0 0.5rem 0.5rem 0 !important;
              font-size: 1rem !important;
              outline: none !important;
              transition: border-color 0.2s !important;
              background-color: white !important;
              color: #1f2937 !important;
            }
            .phone-input-custom .PhoneInputInput:focus {
              border-color: #f28c0d !important;
              box-shadow: 0 0 0 1px #f28c0d !important;
            }
            .phone-input-custom .PhoneInputCountrySelect {
              border: 1px solid #e5e7eb !important;
              border-right: none !important;
              border-radius: 0.5rem 0 0 0.5rem !important;
              padding: 0.75rem 0.5rem !important;
              background-color: white !important;
            }
            .phone-input-custom .PhoneInputCountrySelect:focus {
              border-color: #f28c0d !important;
              box-shadow: 0 0 0 1px #f28c0d !important;
            }
          `}</style>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <PasswordInput
                id="password"
                value={field.value || ""}
                onChange={field.onChange}
                placeholder="Your Password"
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors text-gray-900"
              />
            )}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}

          {/* Password requirements */}
          <div className="mt-2 text-xs text-gray-500">
            Password must contain: uppercase, lowercase, number, symbol (min 8
            chars)
          </div>
        </div>

        <div className="text-sm text-gray-500">
          By creating an account you agree with our{" "}
          <Link
            href="/market-hub/terms"
            className="text-[#F28C0D] hover:text-orange-400"
          >
            Terms of Service
          </Link>
          , and{" "}
          <Link
            href="/market-hub/privacy"
            className="text-[#F28C0D] hover:text-orange-400"
          >
            Privacy Policy
          </Link>
          .
        </div>

        <button
          type="submit"
          disabled={register.isPending}
          className="w-full bg-[#F28C0D] hover:bg-orange-400 text-white font-medium py-3 px-4 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#F28C0D] focus:ring-offset-2 disabled:opacity-50"
        >
          {register.isPending ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className="text-center">
        <span className="text-gray-500">Or continue with</span>
      </div>

      <GoogleOAuthButton text="Continue with Google" />

      <div className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-[#F28C0D] hover:text-orange-400 font-medium"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
