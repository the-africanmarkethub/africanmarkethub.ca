"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { useEffect } from "react";
import CustomFormField from "@/components/CustomFormField";
import SubmitButton from "@/components/SubmitButton";
import { FormFieldType } from "@/constants/formFieldType";
import { useGetProducts } from "@/hooks/useGetProducts";
import { useAddCoupon } from "@/hooks/useAddCoupon";
import { useUpdateCoupon } from "@/hooks/useUpdateCoupon";

interface CouponFormData {
  product_id: string;
  start_time: string;
  end_time: string;
  discount_rate: string;
  notify_users: string;
  status: string;
  discount_type: string;
  discount_code: string;
}

interface CouponFormProps {
  couponId?: string;
  mode?: "create" | "edit";
  initialData?: {
    product_id: string;
    start_time: string;
    end_time: string;
    discount_rate: string;
    notify_users: boolean;
    status: string;
    discount_type: string;
    discount_code: string;
  };
}

export function CouponForm({ couponId, mode = "create", initialData }: CouponFormProps) {
  const router = useRouter();
  const form = useForm<CouponFormData>({
    defaultValues: {
      product_id: "",
      start_time: "",
      end_time: "",
      discount_rate: "",
      notify_users: "false",
      status: "active",
      discount_type: "percentage",
      discount_code: "",
    },
  });

  const { data: productsResponse } = useGetProducts();
  const products = productsResponse?.data.data || [];

  const addCouponMutation = useAddCoupon();
  const updateCouponMutation = useUpdateCoupon();

  const isEditing = mode === "edit" && couponId;

  // Populate form with existing coupon data when in edit mode
  useEffect(() => {
    if (initialData && isEditing) {
      form.reset({
        product_id: String(initialData.product_id),
        start_time: initialData.start_time.replace('Z', '').replace('.000000', ''),
        end_time: initialData.end_time.replace('Z', '').replace('.000000', ''),
        discount_rate: initialData.discount_rate,
        notify_users: initialData.notify_users ? "true" : "false",
        status: initialData.status,
        discount_type: initialData.discount_type,
        discount_code: initialData.discount_code,
      });
    }
  }, [initialData, isEditing, form]);

  const onSubmit = (data: CouponFormData) => {
    if (isEditing && couponId) {
      // Update existing coupon
      updateCouponMutation.mutate(
        { couponId: parseInt(couponId), data },
        {
          onSuccess: () => {
            router.push("/products/promotion");
          },
          onError: (error) => {
            console.error("Failed to update coupon:", error);
          },
        }
      );
    } else {
      // Create new coupon
      addCouponMutation.mutate(data, {
        onSuccess: () => {
          router.push("/products/promotion");
        },
        onError: (error) => {
          console.error("Failed to create coupon:", error);
        },
      });
    }
  };

  return (
    <div className="flex-1 bg-[#F8F8F8]">
      <div className="flex items-center gap-4 p-8">
        <Button variant="ghost" className="p-0" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-semibold">
          {isEditing ? "Edit Coupon" : "Add Coupon"}
        </h2>
      </div>

      {isEditing && !initialData ? (
        <div className="px-8">
          <Card className="p-8 border-none bg-[#FFFFFF] w-full">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E67E22] mx-auto mb-4"></div>
                <p className="text-gray-500">Loading coupon data...</p>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <FormProvider {...form}>
          <div className="px-8">
            <Card className="p-8 border-none bg-[#FFFFFF] w-full">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6">
                <CustomFormField
                  control={form.control}
                  name="discount_code"
                  label="Coupon Code"
                  fieldType={FormFieldType.INPUT}
                  placeholder="Code"
                  isEditable
                />

                <CustomFormField
                  control={form.control}
                  name="discount_rate"
                  label="Amount"
                  fieldType={FormFieldType.NUMBER}
                  placeholder="Amount"
                  isEditable
                />

                <CustomFormField
                  control={form.control}
                  name="start_time"
                  label="Active Date"
                  fieldType={FormFieldType.DATE_TIME_PICKER}
                  placeholder="Active Date"
                  isEditable
                />

                <CustomFormField
                  control={form.control}
                  name="end_time"
                  label="Expiry Date"
                  fieldType={FormFieldType.DATE_TIME_PICKER}
                  placeholder="Expiry Date"
                  isEditable
                />

                <CustomFormField
                  control={form.control}
                  name="product_id"
                  label="Products"
                  fieldType={FormFieldType.SELECT}
                  placeholder="Products"
                  options={products.map((p) => ({
                    label: p.title,
                    value: String(p.id),
                  }))}
                  isEditable
                />

                <CustomFormField
                  control={form.control}
                  name="discount_type"
                  label="Discount Type"
                  fieldType={FormFieldType.SELECT}
                  options={[
                    { label: "Percentage", value: "percentage" },
                    { label: "Fixed Amount", value: "fixed" },
                  ]}
                  isEditable
                />

                <CustomFormField
                  control={form.control}
                  name="status"
                  label="Status"
                  fieldType={FormFieldType.SELECT}
                  options={[
                    { label: "Active", value: "active" },
                    { label: "Deactivate", value: "deactivate" },
                  ]}
                  isEditable
                />

                <CustomFormField
                  control={form.control}
                  name="notify_users"
                  label="Notify Users"
                  fieldType={FormFieldType.SELECT}
                  options={[
                    { label: "Yes", value: "true" },
                    { label: "No", value: "false" },
                  ]}
                  isEditable
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="px-8 rounded-[39px] w-[213px] h-[48px]"
                >
                  Cancel
                </Button>
                <SubmitButton
                  type="submit"
                  className="px-8 text-[#FFFFFF] w-[213px] h-[48px] rounded-[39px]"
                  isLoading={isEditing ? updateCouponMutation.isPending : addCouponMutation.isPending}
                  disabled={isEditing ? updateCouponMutation.isPending : addCouponMutation.isPending}
                >
                  {isEditing 
                    ? (updateCouponMutation.isPending ? "Updating..." : "Update")
                    : (addCouponMutation.isPending ? "Creating..." : "Create")
                  }
                </SubmitButton>
              </div>
              </form>
            </Card>
          </div>
        </FormProvider>
      )}
    </div>
  );
}
