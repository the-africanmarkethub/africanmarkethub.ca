"use client";
import { useState } from "react";
import { MapPin, Trash2, Edit2 } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { useAddresses } from "@/hooks/useAddresses";
import { useCreateAddress } from "@/hooks/useCreateAddress";
import { useUpdateAddress } from "@/hooks/useUpdateAddress";
import { useDeleteAddress } from "@/hooks/useDeleteAddress";
import { Button } from "@/components/ui/button";
import AddressForm from "@/components/account/AddressForm";
import { CreateAddressPayload } from "@/services/addressService";

export default function AddressPage() {
  const { data: addresses, isLoading } = useAddresses();
  const createAddressMutation = useCreateAddress();
  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);

  const addressList = addresses?.data || [];

  const handleDeleteAddress = (id: number) => {
    setAddressToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDeleteAddress = async () => {
    if (addressToDelete) {
      try {
        await deleteAddressMutation.mutateAsync(addressToDelete);
        setDeleteModalOpen(false);
        setAddressToDelete(null);
      } catch (error) {
        console.error("Failed to delete address:", error);
      }
    }
  };

  const cancelDeleteAddress = () => {
    setDeleteModalOpen(false);
    setAddressToDelete(null);
  };

  const handleEditAddress = (id: number) => {
    setEditingAddressId(id);
    setShowAddForm(false);
  };

  const handleAddAddress = async (data: CreateAddressPayload) => {
    try {
      await createAddressMutation.mutateAsync(data);
      setShowAddForm(false);
    } catch (error) {
      console.error("Failed to add address:", error);
    }
  };

  const handleUpdateAddress = async (data: CreateAddressPayload) => {
    if (!editingAddressId) return;
    try {
      await updateAddressMutation.mutateAsync({ id: editingAddressId, data });
      setEditingAddressId(null);
    } catch (error) {
      console.error("Failed to update address:", error);
    }
  };

  const getEditingAddress = () => {
    return addressList.find((addr: any) => addr.id === editingAddressId);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold mb-6">Address</h1>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
              <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-64 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-48 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (addressList.length === 0 && !showAddForm) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold mb-6">Address</h1>
        <div className="bg-white rounded-lg min-h-[500px] flex items-center justify-center">
          <EmptyState
            icon={MapPin}
            title="You don't have any address yet!"
            description="Explore and place your first order now!"
            actionLabel="Add New Address"
            onAction={() => setShowAddForm(true)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Address</h1>

      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Address</h3>
          <AddressForm
            onSubmit={handleAddAddress}
            onCancel={() => setShowAddForm(false)}
            isLoading={createAddressMutation.isPending}
          />
        </div>
      )}

      {editingAddressId && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Edit Address</h3>
          <AddressForm
            onSubmit={handleUpdateAddress}
            onCancel={() => setEditingAddressId(null)}
            initialData={getEditingAddress()}
            isLoading={updateAddressMutation.isPending}
          />
        </div>
      )}

      <div className="space-y-4">
        {addressList.map((address: any, index: number) => (
          <div
            key={address.id}
            className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="radio"
                  name="selectedAddress"
                  checked={
                    selectedAddress === address.id ||
                    (index === 0 && !selectedAddress)
                  }
                  onChange={() => setSelectedAddress(address.id)}
                  className="w-5 h-5 text-[#F28C0D] border-gray-300 focus:ring-[#F28C0D]"
                />
                {(selectedAddress === address.id ||
                  (index === 0 && !selectedAddress)) && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#F28C0D] rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {address.address_label
                      ? address.address_label.charAt(0).toUpperCase()
                      : "A"}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {address.address_label || "Home"}
                </h3>
                <p className="text-gray-500">
                  {address.street_address}
                  {address.city && `, ${address.city}`}
                  {address.state && `, ${address.state}`}
                  {address.zip_code && ` ${address.zip_code}`}
                  {address.country && `, ${address.country}`}
                </p>
                {address.phone && (
                  <p className="text-gray-400 text-sm mt-1">
                    Phone: {address.phone}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEditAddress(address.id)}
                className="text-[#F28C0D] hover:text-[#E67C00] font-medium flex items-center gap-1"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDeleteAddress(address.id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={() => setShowAddForm(true)}
          className="text-[#F28C0D] hover:text-[#E67C00] font-medium flex items-center gap-2 mt-4"
        >
          <span className="text-xl">+</span>
          Add New Address
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={cancelDeleteAddress}
        onConfirm={confirmDeleteAddress}
        title="Delete Address"
        message="Are you sure you want to delete this address? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteAddressMutation.isPending}
        type="danger"
      />
    </div>
  );
}
