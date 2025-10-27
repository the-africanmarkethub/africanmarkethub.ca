import { ApiResponse } from '@/types/api';
import { Address } from '@/types/auth.types';
import apiCall from '@/utils/api-call';

export interface AddressRequest {
  type: 'home' | 'work' | 'other';
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone?: string;
  isDefault?: boolean;
}

export const addressService = {
  // Get all addresses for the current user
  getAddresses: async (): Promise<ApiResponse<Address[]>> => {
    const result = await apiCall<ApiResponse<Address[]>>('/customer/addresses', 'GET');
    return result || { success: false, data: [], message: 'No response' };
  },

  // Get a specific address by ID
  getAddress: async (id: string): Promise<ApiResponse<Address>> => {
    const result = await apiCall<ApiResponse<Address>>(`/customer/addresses/${id}`, 'GET');
    return result || { success: false, data: {} as Address, message: 'No response' };
  },

  // Create a new address
  createAddress: async (address: AddressRequest): Promise<ApiResponse<Address>> => {
    const result = await apiCall<ApiResponse<Address>>('/customer/addresses', 'POST', address);
    return result || { success: false, data: {} as Address, message: 'No response' };
  },

  // Update an existing address
  updateAddress: async (id: string, address: Partial<AddressRequest>): Promise<ApiResponse<Address>> => {
    const result = await apiCall<ApiResponse<Address>>(`/customer/addresses/${id}`, 'PUT', address);
    return result || { success: false, data: {} as Address, message: 'No response' };
  },

  // Delete an address
  deleteAddress: async (id: string): Promise<ApiResponse<void>> => {
    const result = await apiCall<ApiResponse<void>>(`/customer/addresses/${id}`, 'DELETE');
    return result || { success: false, message: 'No response' };
  },

  // Set an address as default
  setDefaultAddress: async (id: string): Promise<ApiResponse<Address>> => {
    const result = await apiCall<ApiResponse<Address>>(`/customer/addresses/${id}/set-default`, 'POST');
    return result || { success: false, data: {} as Address, message: 'No response' };
  },
};