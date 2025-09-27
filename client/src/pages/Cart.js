import React, { useContext, useEffect, useState } from 'react';
import SummaryApi from '../common';
import Context from '../context';
import { MdDelete } from "react-icons/md";
import { FaPlus, FaMinus } from "react-icons/fa";
import { displayVNDCurrency } from '../helpers/displayCurrency';

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; 
  const context = useContext(Context);
  const loadingCart = new Array(itemsPerPage).fill(null);

  // fetch cart
  const fetchData = async () => {
    const response = await fetch(SummaryApi.addToCartProductView.url, {
      method: SummaryApi.addToCartProductView.method,
      credentials: 'include',
      headers: { "content-type": 'application/json' },
    });
    const responseData = await response.json();
    if (responseData.success) setData(responseData.data);
  };

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, []);

  const increaseQty = async (id, qty) => {
    await fetch(SummaryApi.updateCartProduct.url, {
      method: SummaryApi.updateCartProduct.method,
      credentials: 'include',
      headers: { "content-type": 'application/json' },
      body: JSON.stringify({ _id: id, quantity: qty + 1 })
    });
    fetchData();
  };

  const decreaseQty = async (id, qty) => {
    if (qty > 1) {
      await fetch(SummaryApi.updateCartProduct.url, {
        method: SummaryApi.updateCartProduct.method,
        credentials: 'include',
        headers: { "content-type": 'application/json' },
        body: JSON.stringify({ _id: id, quantity: qty - 1 })
      });
      fetchData();
    }
  };

  const deleteCartProduct = async (id) => {
    await fetch(SummaryApi.deleteCartProduct.url, {
      method: SummaryApi.deleteCartProduct.method,
      credentials: 'include',
      headers: { "content-type": 'application/json' },
      body: JSON.stringify({ _id: id })
    });
    fetchData();
    context.fetchUserAddToCart();
  };

  // Pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIdx, startIdx + itemsPerPage);

  const totalQty = data.reduce((prev, curr) => prev + curr.quantity, 0);
  const totalPrice = data.reduce((prev, curr) => prev + (curr.quantity * curr?.productId?.sellingPrice), 0);

  const handlePrev = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));

  // VNPay payment: tự động redirect
  const handleVNPayPayment = async () => {
    try {
      const cartItems = data.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity
      }));

      const res = await fetch("http://localhost:5000/api/checkout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems, shippingFee: 0, bankCode: "NCB" }),
      });

      const result = await res.json();

      if (!result.success) {
        alert("VNPay Checkout Error: " + result.message);
        return;
      }

      // 🔴 Redirect sang VNPay ngay lập tức
      window.location.href = result.paymentUrl;

    } catch (err) {
      console.error(err);
      alert("Lỗi khi tạo thanh toán VNPay");
    }
  };

  return (
    <div className='container px-4 py-6 mx-auto'>
      {data.length === 0 && !loading && (
        <p className='py-10 text-center bg-white rounded shadow'>Không có sản phẩm nào trong giỏ</p>
      )}

      <div className='flex flex-col gap-6 lg:flex-row'>
        {/* Danh sách sản phẩm */}
        <div className='p-4 overflow-x-auto bg-white border border-gray-200 rounded lg:w-9/12'>
          <div className="min-w-[768px]">
            <table className='w-full table-auto'>
              <thead className='border-b border-gray-200 bg-gray-50'>
                <tr className='text-sm text-gray-600'>
                  <th className='w-2/5 py-3 text-left'>Sản phẩm</th>
                  <th className='py-3 text-center w-[15%]'>Giá</th>
                  <th className='py-3 text-center w-[15%]'>Số lượng</th>
                  <th className='py-3 text-center w-[20%]'>Tổng</th>
                  <th className='py-3 text-center w-[10%]'>Xóa</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? loadingCart.map((_, idx) => (
                      <tr key={idx} className='bg-gray-100 h-28 animate-pulse'>
                        <td className='py-3'></td>
                        <td className='py-3'></td>
                        <td className='py-3'></td>
                        <td className='py-3'></td>
                        <td className='py-3'></td>
                      </tr>
                    ))
                  : currentData.map((product) => (
                      <tr key={product._id} className='border-b border-gray-200 hover:bg-gray-50'>
                        <td className='w-2/5 py-3'>
                          <div className='flex items-center gap-4'>
                            <img src={product?.productId?.productImage[0]} className='flex-shrink-0 object-contain w-20 h-20 rounded'/>
                            <div className='flex flex-col w-full min-w-0'>
                              <span className='text-sm font-semibold leading-tight break-words line-clamp-2'>
                                {product?.productId?.productName}
                              </span>
                              <span className='text-xs text-gray-500 truncate'>
                                {product?.productId?.category}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className='py-3 text-center w-[15%]'>
                          <div className='flex flex-col items-center'>
                            <span className='text-xs text-gray-400 line-through'>
                              {displayVNDCurrency(product?.productId?.originalPrice || product?.productId?.sellingPrice)}
                            </span>
                            <span className='font-medium text-red-600'>
                              {displayVNDCurrency(product?.productId?.sellingPrice)}
                            </span>
                          </div>
                        </td>
                        <td className='py-3 text-center w-[15%]'>
                          <div className='flex items-center justify-center gap-2'>
                            <button onClick={() => decreaseQty(product._id, product.quantity)} className='flex items-center justify-center w-8 h-8 border border-gray-300 rounded hover:bg-gray-200'>
                              <FaMinus size={12} />
                            </button>
                            <span className='w-6 text-center'>{product.quantity}</span>
                            <button onClick={() => increaseQty(product._id, product.quantity)} className='flex items-center justify-center w-8 h-8 border border-gray-300 rounded hover:bg-gray-200'>
                              <FaPlus size={12} />
                            </button>
                          </div>
                        </td>
                        <td className='py-3 font-semibold text-center w-[20%]'>
                          {displayVNDCurrency(product?.productId?.sellingPrice * product.quantity)}
                        </td>
                        <td className='py-3 text-center w-[10%]'>
                          <button onClick={() => deleteCartProduct(product._id)} className='p-2 text-red-600 rounded hover:text-yellow-500'>
                            <MdDelete size={20}/>
                          </button>
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center w-full gap-4 mt-4 font-medium text-gray-500">
                <button onClick={handlePrev} className={`p-1 rounded-full bg-slate-200/50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-300'}`} disabled={currentPage === 1}>
                  &larr;
                </button>
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button key={idx} className={`h-8 w-8 flex items-center justify-center aspect-square rounded-md text-sm ${currentPage === idx + 1 ? 'bg-yellow-500 text-white border border-yellow-300' : 'bg-white text-gray-700 hover:bg-yellow-100'}`} onClick={() => setCurrentPage(idx + 1)}>
                      {idx + 1}
                    </button>
                  ))}
                </div>
                <button onClick={handleNext} className={`p-1 rounded-full bg-slate-200/50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-300'}`} disabled={currentPage === totalPages}>
                  &rarr;
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tổng giỏ hàng */}
        <div className='lg:w-3/12 overflow-auto max-h-[500px]'>
          {loading ? (
            <div className='h-48 bg-gray-200 rounded animate-pulse'></div>
          ) : (
            <div className='p-4 bg-white border border-gray-200 rounded'>
              <h2 className='pb-2 mb-3 text-lg font-semibold border-b'>Tổng giỏ hàng</h2>
              <div className='flex justify-between py-1 text-gray-600'>
                <span>Số lượng</span>
                <span>{totalQty}</span>
              </div>
              <div className='flex justify-between py-1 text-gray-600'>
                <span>Tạm tính</span>
                <span>{displayVNDCurrency(totalPrice)}</span>
              </div>
              <div className='flex justify-between py-2 mt-2 text-lg font-semibold text-green-600 border-t'>
                <span>Tổng cộng</span>
                <span>{displayVNDCurrency(totalPrice)}</span>
              </div>
              <button onClick={handleVNPayPayment} className='w-full py-2 mt-3 text-white bg-red-600 rounded hover:bg-red-700'>
                Thanh toán VNPay
              </button>
              <button className='flex items-center justify-center w-full gap-2 py-2 mt-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300'>
                &larr; Tiếp tục mua sắm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
