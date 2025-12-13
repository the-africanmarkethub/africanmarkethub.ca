// Example of using the error handler in your API hooks

import { useMutation } from "@tanstack/react-query";
import { handleApiError, showApiError } from "@/utils/errorHandler";
import toast from "react-hot-toast";

// Example 1: In a mutation hook
export const useCreateService = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      return response.json();
    },
    onError: (error: any) => {
      // This will automatically parse and show the validation errors
      handleApiError(error);
      
      // Or with a custom message fallback
      // handleApiError(error, {
      //   customMessage: "Failed to create service"
      // });
    },
    onSuccess: () => {
      toast.success("Service created successfully!");
    },
  });
};

// Example 2: In a try-catch block
export const updateAvailability = async (data: any) => {
  try {
    const response = await fetch("/api/availability", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  } catch (error) {
    // This handles the exact error format you showed
    // It will display each validation error in the toast
    showApiError(error);
    throw error;
  }
};

// Example 3: Custom error handling with specific field errors
export const handleFormSubmit = async (formData: any) => {
  try {
    // Your API call here
  } catch (error: any) {
    const errorData = error?.response?.data || error?.data || error;
    
    if (errorData?.errors) {
      // Handle specific field errors
      if (errorData.errors.available_from) {
        // You could set form field errors here
        console.log("Available from error:", errorData.errors.available_from);
      }
      
      if (errorData.errors.available_to) {
        // You could set form field errors here
        console.log("Available to error:", errorData.errors.available_to);
      }
    }
    
    // Still show the general toast
    handleApiError(error);
  }
};