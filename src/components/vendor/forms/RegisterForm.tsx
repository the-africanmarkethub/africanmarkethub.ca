"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import GoogleAuthButton from "../authButton/GoogleAuthButton";
import { BusinessTypes, FormFieldType } from "@/constants/vendor/formFieldType";
import { useCreateShop } from "@/hooks/vendor/useCreateShop";
import { useLocation } from "@/hooks/vendor/useLocation";
import { useSubcription } from "@/hooks/vendor/useSubcription";
import useCategories from "@/hooks/vendor/useCategories";
import { VendorFormValidation } from "@/utils/validation";
import Link from "next/link";

// Extended validation schema to include all fields from both steps

const RegisterForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [countryOptions, setCountryOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [stateOptions, setStateOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [cityOptions, setCityOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const { mutate: createShop, isPending } = useCreateShop();
  const { data: location } = useLocation();
  const { data: subcription } = useSubcription();
  const { data: category } = useCategories();

  const subscriptionOptions =
    subcription?.map(
      (item: { id: number; name: string; monthly_price: number }) => ({
        label: `${item.name} - ₦${item.monthly_price}/month`, // or include yearly_price if needed
        value: item.id.toString(),
      })
    ) || [];

  const categoryOptions =
    category?.map((item: { id: number; name: string }) => ({
      label: `${item.name} `, // or include yearly_price if needed
      value: item.id.toString(),
    })) || [];

  console.log("categoryOptions data:", categoryOptions);

  // Initialize form with all fields for both steps
  const form = useForm<z.infer<typeof VendorFormValidation>>({
    resolver: zodResolver(VendorFormValidation),
    defaultValues: {
      name: "",
      address: "",
      type: "products", // default to 'products'
      description: "",
      logo: undefined,
      banner: undefined,
      subscription_id: "",
      state_id: "",
      city_id: "",
      country_id: "",
      category_id: "",
      terms: false,
    },
    mode: "onChange",
  });

  // Watch country_id and state_id for changes
  const country_id = form.watch("country_id");
  const state_id = form.watch("state_id");
  const termsChecked = form.watch("terms");

  console.log("termsChecked--", termsChecked);

  useEffect(() => {
    console.log("country_id--", location?.length);
    if (location && location?.length > 0) {
      const countries = location?.map(
        (country: {
          id: number;
          name: string;
          state: Array<{ id: number; name: string }>;
          city: Array<{ id: number; name: string; state_id: number }>;
        }) => ({
          label: country.name,
          value: country.id.toString(),
        })
      );
      setCountryOptions(countries);

      console.log("Countries:", countries);
    }
  }, [location]);

  // Update states when country is selected
  useEffect(() => {
    if (country_id && location) {
      const selectedCountry = location.find(
        (country: {
          id: number;
          name: string;
          state: Array<{ id: number; name: string }>;
          city: Array<{ id: number; name: string; state_id: number }>;
        }) => country.id.toString() === country_id
      );

      if (selectedCountry && selectedCountry.state) {
        const states = selectedCountry.state.map(
          (state: { id: number; name: string }) => ({
            label: state.name,
            value: state.id.toString(),
          })
        );
        setStateOptions(states);
        console.log("States:", states);

        // Reset city selection when country changes
        form.setValue("city_id", "");
        setCityOptions([]);
      }
    }
  }, [country_id, location, form]);

  // Update cities when state is selected
  useEffect(() => {
    if (state_id && country_id && location) {
      const selectedCountry = location.find(
        (country: {
          id: number;
          name: string;
          state: Array<{ id: number; name: string }>;
          city: Array<{ id: number; name: string; state_id: number }>;
        }) => country.id.toString() === country_id
      );

      if (selectedCountry) {
        const cities = selectedCountry.city
          .filter(
            (city: { state_id: number; name: string; id: number }) =>
              city.state_id.toString() === state_id
          )
          .map((city: { state_id: number; name: string; id: number }) => ({
            label: city.name,
            value: city.id.toString(),
          }));
        setCityOptions(cities);
      }
    }
  }, [state_id, country_id, location]);

  // Handle next button click - validate current fields before proceeding
  const handleNext = async () => {
    // Fields to validate in step 1
    const step1Fields = ["name", "address", "type", "description"];

    console.log("Before Next - current form values:", form.getValues());
    
    // Validate only step 1 fields
    const result = await form.trigger(
      step1Fields as (keyof z.infer<typeof VendorFormValidation>)[]
    );

    console.log("Step 1 validation result:", result);
    
    if (result) {
      console.log("Moving to step 2 - form values:", form.getValues());
      setCurrentStep(2);
    }
  };

  // Handle form submission for both steps
  async function onSubmit(values: z.infer<typeof VendorFormValidation>) {
    console.log("onSubmit called with values:", values);

    const payload = {
      name: values.name,
      country_id: values.country_id,
      state_id: values.state_id,
      city_id: values.city_id,
      address: values.address,
      type: values.type, // Keep as "products" or "services" - backend expects these values
      description: values.description,
      logo: values.logo,
      banner: values.banner,
      subscription_id: values.subscription_id,
      category_id: values.category_id,
    };
    console.log("Calling createShop with payload:", payload);
    createShop(payload);
  }

  // Determine which button to show based on the step
  const renderActionButton = () => {
    if (currentStep === 1) {
      return (
        <SubmitButton
          type="button"
          onClick={handleNext}
          className="h-11 w-full text-[#FFFFFF] rounded-[39px] text-sm md:h-14 md:text-lg"
        >
          Next
        </SubmitButton>
      );
    }

    return (
      <SubmitButton
        type="submit"
        isLoading={isPending}
        disabled={!termsChecked}
        className="h-11 w-full text-[#FFFFFF] rounded-[39px] text-sm md:h-14 md:text-lg"
      >
        Create Shop
      </SubmitButton>
    );
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log("Form validation errors:", errors);
            console.log("Current form values:", form.getValues());
            console.log("Failed validation fields:", Object.keys(errors));
          })}
          className="space-y-8 flex-1"
        >
          <section className="space-y-4">
            <h1 className="text-2xl font-semibold ">
              Create Your Vendor Account
            </h1>
          </section>

          {/* Step 1 Fields - Always render but hide when not active */}
          <div className={`space-y-4 ${currentStep !== 1 ? 'hidden' : ''}`}>
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                isEditable
                control={form.control}
                name="name"
                label="Business Name"
                placeholder="Business Name"
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                isEditable
                control={form.control}
                name="address"
                label="Business Address"
                placeholder="Business Address"
              />

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                isEditable
                control={form.control}
                name="type"
                label="Business Type"
                options={[
                  { label: "Products", value: BusinessTypes.PRODUCT },
                  { label: "Services", value: BusinessTypes.SERVICE },
                ]}
                placeholder="Select Business Type"
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                isEditable
                control={form.control}
                name="description"
                label="Business Description"
                placeholder="Business Address"
              />

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                isEditable
                control={form.control}
                name="category_id"
                label="Category"
                options={categoryOptions}
                placeholder="Select Category"
                // disabled={}
              />

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                isEditable
                control={form.control}
                name="subscription_id"
                label="Subscription"
                options={subscriptionOptions}
                placeholder="Select Subscription"
                // disabled={}
              />
            </div>
          
          {/* Step 2 Fields - Always render but hide when not active */}
          <div className={`space-y-4 ${currentStep !== 2 ? 'hidden' : ''}`}>
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                isEditable
                control={form.control}
                name="country_id"
                label="Country"
                options={countryOptions}
                placeholder="Select Country"
              />

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                isEditable
                control={form.control}
                name="state_id"
                label="State"
                options={stateOptions}
                placeholder="Select State"
                disable={!country_id || stateOptions.length === 0}
              />

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                isEditable
                control={form.control}
                name="city_id"
                label="City"
                options={cityOptions}
                placeholder="Select City"
                disable={!state_id || cityOptions.length === 0}
              />

              <CustomFormField
                control={form.control}
                name="logo"
                label="Business Logo"
                fieldType={FormFieldType.FILE_UPLOAD}
                placeholder="Choose files or drag and drop"
                acceptedFileTypes="image/*"
              />

              <CustomFormField
                control={form.control}
                name="banner"
                label="Business Banner"
                fieldType={FormFieldType.FILE_UPLOAD}
                placeholder="Choose files or drag and drop"
                acceptedFileTypes="image/*"
              />
              <CustomFormField
                fieldType={FormFieldType.CHECKBOX}
                name="terms"
                control={form.control}
                label="By creating an account you agree to our Terms of Service and Privacy Policy"
                isEditable
              />
            </div>

          {renderActionButton()}
        </form>
      </Form>

      <div className="mt-6 mb-4 flex items-center justify-center">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-sm text-gray-500">Or continue with</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      <GoogleAuthButton />

      <div className="text-center">
        <p className="flex justify-center gap-2 leading-[22px]">
          Already have an account?
          <Link
            href="/customer/login"
            className="text-[#7E442E] hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
