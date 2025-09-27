import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import moment from 'moment';
import displayVNDCurrency from '../helpers/displayCurrency';

const AllOrder = () => {
  const [data, setData] = useState([]);

  const fetchOrderDetails = async () => {
    const response = await fetch(SummaryApi.allOrder.url, {
      method: SummaryApi.allOrder.method,
      credentials: 'include',
    });

    const responseData = await response.json();
    setData(responseData.data || []);
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  return (
    <div className="h-[calc(100vh-190px)] overflow-y-scroll p-4">
      {!data.length && <p className="py-10 text-center text-gray-500">No Order available</p>}

      {data.map((item, index) => (
        <div key={item._id || index} className="mb-6">
          <p className="mb-2 text-lg font-medium">{moment(item.createdAt).format('LL')}</p>
          <div className="p-2 border rounded">
            {/* Products */}
            <div className="flex flex-col gap-2 lg:flex-row">
              <div className="grid flex-1 gap-1">
                {item.productDetails.map((product, idx) => (
                  <div key={product.productId + idx} className="flex gap-3 p-2 rounded bg-slate-100">
                    <img
                      src={product.image[0]}
                      alt={product.name}
                      className="object-scale-down w-28 h-28 bg-slate-200"
                    />
                    <div className="flex flex-col justify-between">
                      <div className="text-lg font-medium line-clamp-1">{product.name}</div>
                      <div className="flex items-center gap-5 mt-1">
                        <div className="text-lg text-red-500">{displayVNDCurrency(product.price)}</div>
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
                    Method: {item.vnpayDetails?.vnpay_method_type || 'N/A'}
                  </p>
                  <p className="ml-1">
                    Status: {item.vnpayDetails?.vnpay_status === 'success' ? 'Thanh toán thành công' : 'Chưa thanh toán'}
                  </p>
                  <p className="ml-1">
                    Transaction ID: {item.vnpayDetails?.vnp_TransactionNo || '---'}
                  </p>
                </div>
                <div>
                  <div className="text-lg font-medium">Shipping Details:</div>
                  <p className="ml-1">Shipping Amount: {displayVNDCurrency(0)}</p>
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className="mt-2 ml-auto text-lg font-semibold">
              Total Amount: {displayVNDCurrency(item.totalAmount)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllOrder;
