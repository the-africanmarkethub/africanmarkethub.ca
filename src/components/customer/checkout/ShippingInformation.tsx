"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAddresses } from "@/hooks/customer/useAddresses";
import { useCreateAddress } from "@/hooks/customer/useCreateAddress";
import AddressForm from "@/components/customer/account/AddressForm";
import { CreateAddressPayload } from "@/services/addressService";

interface ShippingInformationProps {
  onAddressSelect: (addressId: number) => void;
}

export default function ShippingInformation({
  onAddressSelect,
}: ShippingInformationProps) {
  const { data: addressesData, isLoading } = useAddresses();
  const createAddressMutation = useCreateAddress();
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState(false);

  const addresses = addressesData?.data || [];

  const handleAddressChange = (addressId: string) => {
    setSelectedAddressId(addressId);
    onAddressSelect(parseInt(addressId));
  };

  const handleAddAddress = async (data: CreateAddressPayload) => {
    try {
      const response = await createAddressMutation.mutateAsync(data);
      setShowAddForm(false);
      // Select the newly created address
      if (response?.data?.id) {
        setSelectedAddressId(response.data.id.toString());
        onAddressSelect(response.data.id);
      }
    } catch (error) {
      console.error("Failed to add address:", error);
    }
  };


  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-[28px] font-semibold mb-[34px]">
          Shipping Information
        </h2>
        <p>Loading addresses...</p>
      </div>
    );
  }

  if (addresses.length === 0 && !showAddForm) {
    return (
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-[28px] font-semibold mb-[34px]">
          Shipping Information
        </h2>
        <p className="text-gray-600 mb-4">
          No addresses found. Please add an address to continue.
        </p>
        <Button variant="outline" onClick={() => setShowAddForm(true)}>Add New Address</Button>
      </div>
    );
  }

  if (addresses.length === 0 && showAddForm) {
    return (
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-[28px] font-semibold mb-[34px]">
          Shipping Information
        </h2>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Address</h3>
          <AddressForm
            onSubmit={handleAddAddress}
            onCancel={() => setShowAddForm(false)}
            isLoading={createAddressMutation.isPending}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg">
      <h2 className="text-[28px] font-semibold mb-[34px]">
        Shipping Information
      </h2>
      
      {showAddForm && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Address</h3>
          <AddressForm
            onSubmit={handleAddAddress}
            onCancel={() => setShowAddForm(false)}
            isLoading={createAddressMutation.isPending}
          />
        </div>
      )}

      {!showAddForm && (
        <>
          <div className="mb-6">
            <Label className="text-base font-medium mb-4 block">
              Select Shipping Address
            </Label>
            
            <RadioGroup
              value={selectedAddressId}
              onValueChange={handleAddressChange}
              className="space-y-4"
            >
              {addresses.map((address) => (
                <div key={address.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                  <RadioGroupItem 
                    value={address.id.toString()} 
                    id={address.id.toString()} 
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor={address.id.toString()}
                      className="block cursor-pointer"
                    >
                      <div className="font-medium text-sm mb-1">
                        {address.address_label}
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>{address.street_address}</p>
                        <p>
                          {address.city}, {address.state} {address.zip_code}
                        </p>
                        <p>{address.country}</p>
                        {address.phone && <p>Phone: {address.phone}</p>}
                      </div>
                    </Label>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setShowAddForm(true)}>Add New Address</Button>
          </div>
        </>
      )}
    </div>
  );
}
