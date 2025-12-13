"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  AddressResponse, 
  CreateAddressPayload, 
  CreateAddressResponse,
  UpdateAddressPayload,
  DeleteAddressResponse
} from "@/types/address";
import { QueryKeys } from "@/lib/query-keys";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetch all addresses
const fetchAddresses = async (): Promise<AddressResponse> => {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE_URL}/customer/addresses`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  return response.json();
};

// Create new address
const createAddress = async (payload: CreateAddressPayload): Promise<CreateAddressResponse> => {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE_URL}/customer/address/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  return response.json();
};

// Update address
const updateAddress = async (id: number, payload: UpdateAddressPayload): Promise<CreateAddressResponse> => {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE_URL}/customer/address/update/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  return response.json();
};

// Delete address
const deleteAddress = async (id: number): Promise<DeleteAddressResponse> => {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE_URL}/customer/address/delete/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  return response.json();
};

// Hooks
export const useAddresses = () => {
  return useQuery({
    queryKey: QueryKeys.ADDRESSES,
    queryFn: fetchAddresses,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.ADDRESSES });
    },
    onError: (error) => {
      console.error('Failed to create address:', error);
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAddressPayload }) => updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.ADDRESSES });
    },
    onError: (error) => {
      console.error('Failed to update address:', error);
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.ADDRESSES });
    },
    onError: (error) => {
      console.error('Failed to delete address:', error);
    },
  });
};