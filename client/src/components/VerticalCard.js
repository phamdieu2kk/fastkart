import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import displayVNDCurrency from '../helpers/displayCurrency';
import Context from '../context';
import addToCart from '../helpers/addToCart';
import { BsCart4 } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";
import { AiFillHeart } from "react-icons/ai";

const VerticalCard = ({ loading, data = [] }) => {
  const loadingList = new Array(8).fill(null);
  const { fetchUserAddToCart } = useContext(Context);

  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 8;

  const handleAddToCart = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const totalPages = Math.ceil(data.length / cardsPerPage);
  const startIdx = (currentPage - 1) * cardsPerPage;
  const endIdx = startIdx + cardsPerPage;
  const currentData = data.slice(startIdx, endIdx);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
   
      <div>
  {/* Grid cards responsive */}
  <div className="grid grid-cols-1 gap-4 xs:grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {loading
      ? loadingList.map((_, idx) => (
          <div key={'skeleton-' + idx} className="p-2">
            <div className="bg-white rounded-lg shadow animate-pulse min-h-[360px] flex flex-col">
              <div className="w-full h-60 bg-slate-200"></div>
              <div className="flex flex-col justify-between flex-1 p-4">
                <div>
                  <p className="h-4 mb-2 rounded bg-slate-200"></p>
                  <p className="h-5 mb-1 rounded bg-slate-200"></p>
                  <p className="w-3/4 h-4 rounded bg-slate-200"></p>
                </div>
                <div className="flex gap-2 mt-2">
                  <div className="flex-1 h-8 rounded bg-slate-200"></div>
                  <div className="flex-1 h-8 rounded bg-slate-200"></div>
                </div>
              </div>
            </div>
          </div>
        ))
      : currentData.map((product) => (
          <div key={product._id} className="p-2">
            <div className="relative flex flex-col overflow-hidden bg-white rounded-lg shadow hover:shadow-lg group">
              <Link to={`/product/${product._id}`} className="relative block">
                <img
                  src={product.productImage[0]}
                  alt={product.productName}
                  className="object-cover w-full transition-transform duration-1000 ease-linear h-60 group-hover:scale-110"
                />
                {product.isNew && (
                  <span className="absolute px-2 py-1 text-xs font-bold text-white bg-green-600 rounded top-2 left-2">
                    New
                  </span>
                )}
                {product.salePercent && (
                  <span className="absolute px-2 py-1 ml-16 text-xs font-bold text-white bg-red-600 rounded top-2 left-2">
                    -{product.salePercent}%
                  </span>
                )}

                {/* Action buttons */}
                <div className="absolute flex gap-2 transition-opacity transform -translate-x-1/2 opacity-0 bottom-2 left-1/2 group-hover:opacity-100">
                  <button
                    className="flex items-center justify-center w-8 h-8 text-white bg-yellow-500 rounded-full hover:bg-yellow-600"
                    onClick={(e) => handleAddToCart(e, product._id)}
                  >
                    <BsCart4 />
                  </button>
                  <Link
                    to={`/product/${product._id}`}
                    className="flex items-center justify-center w-8 h-8 text-white bg-yellow-500 rounded-full hover:bg-yellow-600"
                  >
                    <IoIosSearch />
                  </Link>
                  <button className="flex items-center justify-center w-8 h-8 text-white bg-yellow-500 rounded-full hover:bg-yellow-600">
                    <AiFillHeart />
                  </button>
                </div>
              </Link>

              {/* Info */}
              <div className="p-4 text-center">
                <p className="text-sm font-medium text-slate-900 md:text-base line-clamp-1">
                  {product.productName}
                </p>
                <p className="text-xs capitalize text-slate-500 line-clamp-1">
                  {product.category}
                </p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="font-medium text-red-600">
                    {displayVNDCurrency(product.sellingPrice)}
                  </span>
                  {product.price && product.price > product.sellingPrice && (
                    <span className="text-xs line-through text-slate-500">
                      {displayVNDCurrency(product.price)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
  </div>


     {/* Pagination */}
{totalPages > 1 && (
  <div className="flex items-center justify-center w-full gap-2 mt-4 font-medium text-gray-500">
    {/* Prev button */}
    <button
      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
      type="button"
      aria-label="prev"
      className={`p-1 rounded-full bg-slate-200/50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-300'}`}
      disabled={currentPage === 1}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M15 6l-6 6 6 6" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>

    {/* Page numbers */}
    <div className="flex items-center gap-1.5 text-sm font-medium">
      {Array.from({ length: totalPages }).map((_, idx) => (
        <button
          key={idx}
          className={`h-8 w-8 flex items-center justify-center aspect-square rounded-md text-sm ${
            currentPage === idx + 1
              ? 'bg-yellow-500 text-white border border-yellow-300'
              : 'bg-white text-gray-700 hover:bg-yellow-100'
          }`}
          onClick={() => setCurrentPage(idx + 1)}
        >
          {idx + 1}
        </button>
      ))}
    </div>

    {/* Next button */}
    <button
      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
      type="button"
      aria-label="next"
      className={`p-1 rounded-full bg-slate-200/50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-300'}`}
      disabled={currentPage === totalPages}
    >
      <svg className="rotate-180" width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M15 6l-6 6 6 6" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  </div>
)}

    </div>
  
  );
};

export default VerticalCard;
