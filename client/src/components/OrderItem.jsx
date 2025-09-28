import React from 'react';
import moment from 'moment';
import displayVNDCurrency from '../helpers/displayCurrency';

const OrderItem = ({ order, showUserEmail = false }) => {
  return (
    <div className="p-2 mb-6 border rounded">
      <p className="mb-2 text-lg font-medium">{moment(order.createdAt).format('LL')}</p>
      {showUserEmail && (
        <p className="mb-2 text-sm text-gray-500">User: {order.email}</p>
      )}

      {/* Products */}
      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="grid flex-1 gap-1">
          {order.productDetails.map((product, idx) => (
            <div
              key={product.productId + idx}
              className="flex gap-3 p-2 rounded bg-slate-100"
            >
              <img
                src={product.image[0]}
                alt={product.name}
                className="object-scale-down w-28 h-28 bg-slate-200"
              />
              <div className="flex flex-col justify-between">
                <div className="text-lg font-medium line-clamp-1">{product.name}</div>
                <div className="flex items-center gap-5 mt-1">
                  <div className="text-lg text-red-500">
                    {displayVNDCurrency(product.price)}
                  </div>
                  <p>Quantity: {product.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment & Shipping */}
        <div className="flex flex-col gap-4 p-2 min-w-[250px]">
          <div>
            <div className="text-lg font-medium">Payment Details:</div>
            <p className="ml-1">
              Method: {order.vnpayDetails?.vnpay_method_type || 'N/A'}
            </p>
            <p className="ml-1">
              Status: {order.vnpayDetails?.vnpay_status === 'success' ? 'Thanh toán thành công' : 'Chưa thanh toán'}
            </p>
            <p className="ml-1">
              Transaction ID: {order.vnpayDetails?.vnp_TxnRef || '---'}
            </p>
          </div>
          <div>
            <div className="text-lg font-medium">Shipping Details:</div>
            <p className="ml-1">Shipping Amount: {displayVNDCurrency(order.shippingFee || 0)}</p>
          </div>
        </div>
      </div>

      {/* Total Amount */}
      <div className="mt-2 ml-auto text-lg font-semibold">
        Total Amount: {displayVNDCurrency(order.totalAmount)}
      </div>
    </div>
  );
};

export default OrderItem;
