"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetProfile } from "@/hooks/useGetProfile";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { useChangePassword } from "@/hooks/useChangePassword";
import { Edit2, Eye, EyeOff } from "lucide-react";

interface SettingsFormData {
  name: string;
  lastName: string;
  email: string;
  phone: string;
}

interface PasswordFormData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export default function SettingsForm() {
  const { data, isLoading } = useGetProfile();
  const user = data?.data;
  const updateProfileMutation = useUpdateProfile(user?.id || 0);
  const changePasswordMutation = useChangePassword();

  const [editingField, setEditingField] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const { register, handleSubmit, setValue, watch } = useForm<SettingsFormData>(
    {
      defaultValues: {
        name: "",
        lastName: "",
        email: "",
        phone: "",
      },
    }
  );
  
  const { 
    register: registerPassword, 
    handleSubmit: handlePasswordSubmit, 
    reset: resetPassword,
    formState: { errors: passwordErrors }
  } = useForm<PasswordFormData>({
    defaultValues: {
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });

  useEffect(() => {
    if (user) {
      setValue("name", user.name || "");
      setValue("lastName", user.last_name || "");
      setValue("email", user.email || "");
      setValue("phone", user.phone || "");
    }
  }, [user, setValue]);

  const onSubmit = async (data: SettingsFormData) => {
    if (!user?.id || !editingField) return;

    const updateData: Record<string, string> = {};

    if (editingField === "name") {
      updateData.name = data.name;
    } else if (editingField === "lastName") {
      updateData.last_name = data.lastName;
    } else if (editingField === "email") {
      updateData.email = data.email;
    } else if (editingField === "phone") {
      updateData.phone = data.phone;
    }

    try {
      await updateProfileMutation.mutateAsync(updateData);
      setEditingField(null);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };
  
  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      await changePasswordMutation.mutateAsync(data);
      resetPassword();
      setEditingField(null);
      setShowPasswords({ current: false, new: false, confirm: false });
    } catch (error) {
      console.error("Failed to change password:", error);
    }
  };

  const handleEditClick = (field: string) => {
    setEditingField(field);
  };

  const handleCancelEdit = () => {
    if (user) {
      setValue("name", user.name || "");
      setValue("lastName", user.last_name || "");
      setValue("email", user.email || "");
      setValue("phone", user.phone || "");
    }
    if (editingField === "password") {
      resetPassword();
      setShowPasswords({ current: false, new: false, confirm: false });
    }
    setEditingField(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* <h1 className="text-2xl font-semibold text-gray-900">Account Setting</h1> */}
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border-b border-gray-200 pb-6">
              <div className="h-6 w-32 bg-gray-100 rounded animate-pulse mb-2" />
              <div className="h-5 w-64 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const formValues = watch();

  return (
    <div className="space-y-8">
      {/* <h1 className="text-2xl font-semibold text-gray-900">Account Setting</h1> */}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex bg-[#ffffff] rounded-2xl shadow-sm py-4 px-6 items-center justify-between">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              First Name
            </h3>
            {editingField === "name" ? (
              <div className="flex items-center gap-3">
                <Input {...register("name")} className="max-w-md" autoFocus />
                <Button
                  type="submit"
                  size="sm"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <p className="text-gray-600">{formValues.name || "Not set"}</p>
            )}
          </div>
          {editingField !== "name" && (
            <button
              type="button"
              onClick={() => handleEditClick("name")}
              className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>

        <div className="flex bg-[#ffffff] rounded-2xl shadow-sm py-4 px-6 items-center justify-between">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              Last Name
            </h3>
            {editingField === "lastName" ? (
              <div className="flex items-center gap-3">
                <Input
                  {...register("lastName")}
                  className="max-w-md"
                  autoFocus
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <p className="text-gray-600">
                {formValues.lastName || "Not set"}
              </p>
            )}
          </div>
          {editingField !== "lastName" && (
            <button
              type="button"
              onClick={() => handleEditClick("lastName")}
              className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>

        <div className="flex bg-[#ffffff] rounded-2xl shadow-sm py-4 px-6 items-center justify-between">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              Email
            </h3>
            <p className="text-gray-600">{formValues.email || "Not set"}</p>
          </div>
          {/* Email is not editable */}
          {/* {editingField !== "email" && (
            <button
              type="button"
              onClick={() => handleEditClick("email")}
              className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          )} */}
        </div>

        <div className="flex bg-[#ffffff] rounded-2xl shadow-sm py-4 px-6 items-center justify-between">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              Phone Number
            </h3>
            <p className="text-gray-600">{formValues.phone || "Not set"}</p>
          </div>
          {/* Phone number is not editable */}
          {/* {editingField !== "phone" && (
            <button
              type="button"
              onClick={() => handleEditClick("phone")}
              className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          )} */}
        </div>
      </form>

      <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
        <div className="flex bg-[#ffffff] rounded-2xl shadow-sm py-4 px-6 items-center justify-between">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              Password
            </h3>
            {editingField === "password" ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 max-w-md space-y-3">
                    <div className="relative">
                      <Input
                        {...registerPassword("current_password", {
                          required: "Current password is required"
                        })}
                        type={showPasswords.current ? "text" : "password"}
                        placeholder="Current Password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordErrors.current_password && (
                      <p className="text-sm text-red-500">{passwordErrors.current_password.message}</p>
                    )}
                    
                    <div className="relative">
                      <Input
                        {...registerPassword("new_password", {
                          required: "New password is required",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters"
                          },
                          pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                            message: "Password must include uppercase, lowercase, number, and special character"
                          }
                        })}
                        type={showPasswords.new ? "text" : "password"}
                        placeholder="New Password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordErrors.new_password && (
                      <p className="text-sm text-red-500">{passwordErrors.new_password.message}</p>
                    )}
                    {!passwordErrors.new_password && editingField === "password" && (
                      <p className="text-xs text-gray-500">
                        Must contain uppercase, lowercase, number, and special character (@$!%*?&)
                      </p>
                    )}
                    
                    <div className="relative">
                      <Input
                        {...registerPassword("new_password_confirmation", {
                          required: "Please confirm your new password",
                          validate: (value, formValues) => 
                            value === formValues.new_password || "Passwords do not match"
                        })}
                        type={showPasswords.confirm ? "text" : "password"}
                        placeholder="Confirm New Password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordErrors.new_password_confirmation && (
                      <p className="text-sm text-red-500">{passwordErrors.new_password_confirmation.message}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={changePasswordMutation.isPending}
                  >
                    {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">••••••••••••</p>
            )}
          </div>
          {editingField !== "password" && (
            <button
              type="button"
              onClick={() => handleEditClick("password")}
              className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
