"use client";

interface OrderDetailsModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  if (!isOpen || !order) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const formatPrice = (price: number | string) => {
    return parseFloat(price.toString()).toFixed(2);
  };

  // Calculate order summary
  const subtotal = order.order_items?.reduce((sum: number, item: any) => {
    const price = item.product?.regular_price || item.product?.sales_price || item.price || 0;
    return sum + (parseFloat(price) * item.quantity);
  }, 0) || 0;
  const shipping = 40.00;
  const tax = subtotal * 0.1515; // 15.15% tax
  const discount = 20.00; // Example discount
  const total = subtotal + shipping + tax - discount;

  const getPaymentStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "paid" || statusLower === "completed") return "bg-green-100 text-green-700";
    if (statusLower === "pending") return "bg-yellow-50 text-yellow-700";
    if (statusLower === "processing") return "bg-purple-50 text-purple-700";
    if (statusLower === "refunded") return "bg-gray-100 text-gray-700";
    if (statusLower === "cancelled") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const getShippingStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "delivered") return "bg-green-100 text-green-700";
    if (statusLower === "shipped" || statusLower === "shipping") return "bg-blue-100 text-blue-700";
    if (statusLower === "pending") return "bg-yellow-50 text-yellow-700";
    if (statusLower === "processing") return "bg-purple-50 text-purple-700";
    if (statusLower === "returned") return "bg-gray-100 text-gray-700";
    if (statusLower === "cancelled") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Order Details - {order.id || "7128164870615338"}
          </h2>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel Order
            </button>
            <button className="px-4 py-2 bg-[#F28C0D] text-white rounded-lg hover:bg-orange-600 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Order Status Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Order Status:</span>
                <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-lg ${getShippingStatusBadge(order.shipping_status || "Pending")}`}>
                  {order.shipping_status || "Pending"}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Order ID: #{order.id || "7128164870615338"}
              </div>
            </div>
          </div>

          {/* Customer Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Customer Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-2xl text-gray-600">
                    {order.customer?.name?.[0] || "M"}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {order.customer?.name || "Miles"}, {order.customer?.last_name || "Esther"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {order.customer?.email || "milesesthers@gmail.com"}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Contact Number:</span>
                  <span className="ml-2 text-gray-900">{order.customer?.phone || "(201) 555-0124"}</span>
                </div>
                <div>
                  <span className="text-gray-500">Member Since:</span>
                  <span className="ml-2 text-gray-900">3 March, 2023</span>
                </div>
                <div className="pt-2">
                  <p className="text-gray-900">{formatDate(order.created_at)} at {formatTime(order.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Shipping Address</h4>
              <p className="text-sm text-gray-900">
                {order.address?.street_address || "3517 W. Gray St. Utica, Pennsylvania 57867"}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {order.address?.city || "Utica"}, {order.address?.state || "PA"} {order.address?.postal_code || "57867"}
              </p>
            </div>

            {/* Order History */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Order History</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">150</p>
                  <p className="text-xs text-gray-500">Total Order</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">140</p>
                  <p className="text-xs text-gray-500">Completed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">10</p>
                  <p className="text-xs text-gray-500">Cancelled</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S/N</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.order_items?.map((item: any, index: number) => {
                      // Access product data correctly based on the structure
                      const product = item.product || {};
                      const itemPrice = parseFloat(product.sales_price || product.regular_price || item.price || 105.12);
                      const itemDiscount = 20.00;
                      const itemTotal = (itemPrice * item.quantity) - itemDiscount;
                      // Get first image from product.images array
                      const imageUrl = product.images?.[0] || null;
                      const itemTitle = product.title || "Beigi Coffe (Navy)";
                      
                      return (
                        <tr key={item.id || index}>
                          <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt={itemTitle}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <span className="text-sm text-gray-900">
                                {itemTitle}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{item.quantity}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{formatPrice(itemPrice)}CAD</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{formatPrice(itemDiscount)}CAD</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{formatPrice(itemTotal)}CAD</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 px-6 py-4">
                <div className="max-w-xs ml-auto space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">{formatPrice(subtotal)}CAD</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">{formatPrice(shipping)}CAD</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">{formatPrice(tax)}CAD</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Grand Total</span>
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-gray-900">{formatPrice(total)}CAD</span>
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-lg ${getPaymentStatusBadge(order.payment_status || "Pending")}`}>
                          {order.payment_status?.toLowerCase() === "paid" && "✓ "}
                          {order.payment_status || "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Notes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Notes</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                {order.notes || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}