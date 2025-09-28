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
                            <svg width="22" height="22" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="hover:opacity-70 mx-2"><path d="M13.25 2H10.5V1.5C10.5 0.672906 9.82709 0 9 0H7C6.17291 0 5.5 0.672906 5.5 1.5V2H2.75C2.06075 2 1.5 2.56075 1.5 3.25V5C1.5 5.27612 1.72387 5.5 2 5.5H2.27325L2.70522 14.5713C2.74338 15.3725 3.4015 16 4.2035 16H11.7965C12.5985 16 13.2567 15.3725 13.2948 14.5713L13.7268 5.5H14C14.2761 5.5 14.5 5.27612 14.5 5V3.25C14.5 2.56075 13.9392 2 13.25 2ZM6.5 1.5C6.5 1.22431 6.72431 1 7 1H9C9.27569 1 9.5 1.22431 9.5 1.5V2H6.5V1.5ZM2.5 3.25C2.5 3.11216 2.61216 3 2.75 3H13.25C13.3878 3 13.5 3.11216 13.5 3.25V4.5C13.3459 4.5 3.13853 4.5 2.5 4.5V3.25ZM12.2959 14.5238C12.2832 14.7908 12.0638 15 11.7965 15H4.2035C3.93616 15 3.71678 14.7908 3.70409 14.5238L3.27437 5.5H12.7256L12.2959 14.5238Z" fill="#333333"></path><path d="M8 14C8.27613 14 8.5 13.7761 8.5 13.5V7C8.5 6.72387 8.27613 6.5 8 6.5C7.72387 6.5 7.5 6.72387 7.5 7V13.5C7.5 13.7761 7.72384 14 8 14Z" fill="#333333"></path><path d="M10.5 14C10.7761 14 11 13.7761 11 13.5V7C11 6.72387 10.7761 6.5 10.5 6.5C10.2239 6.5 10 6.72387 10 7V13.5C10 13.7761 10.2238 14 10.5 14Z" fill="#333333"></path><path d="M5.5 14C5.77613 14 6 13.7761 6 13.5V7C6 6.72387 5.77613 6.5 5.5 6.5C5.22387 6.5 5 6.72387 5 7V13.5C5 13.7761 5.22384 14 5.5 14Z" fill="#333333"></path></svg>
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
