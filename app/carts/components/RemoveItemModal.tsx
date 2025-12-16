"use client";

import WishlistButton from "@/app/(customer)/account/wishlists/components/WishlistButton";
import Modal from "@/app/components/common/Modal";
import { CartItem } from "@/context/CartContext";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: CartItem | null;
};

export default function RemoveItemModal({
  isOpen,
  onClose,
  onConfirm,
  item,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Remove Item"
      description="Do you want to remove this item from your cart or save it for later?"
    >
      {item && (
        <div className="mb-4 text-sm text-gray-700">
          <strong>{item.title}</strong> will be removed from your cart.
        </div>
      )}

      <div className="flex justify-end gap-2 mt-6">
        {/* Cancel */}
        <button
          onClick={onClose}
          className="btn btn-gray"
        >
          Cancel
        </button>

        {/* Move to Wishlist */}
        {item && (
          <WishlistButton product={item} /> 
        )}

        {/* Remove */}
        <button
          onClick={onConfirm}
          className="btn btn-primary"
        >
          Remove
        </button>
      </div>
    </Modal>
  );
}
