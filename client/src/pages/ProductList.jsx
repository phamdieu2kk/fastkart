import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import SummaryApi from "../common";
import displayVNDCurrency from "../helpers/displayCurrency";
import addToCart from "../helpers/addToCart";
import Context from "../context";
import productCategory from "../helpers/productCategory";
import { BsCart4 } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";
import { AiFillHeart } from "react-icons/ai";
import { FiFilter, FiX } from "react-icons/fi";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchUserAddToCart } = useContext(Context);

  // Filter + sort
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [selectCategory, setSelectCategory] = useState({});
  const [filterCategoryList, setFilterCategoryList] = useState([]);
  const [sortBy, setSortBy] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 8;

  const fetchData = async () => {
    setLoading(true);
    try {
      let response;
      if (filterCategoryList.length > 0) {
        response = await fetch(SummaryApi.filterProduct.url, {
          method: SummaryApi.filterProduct.method,
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ category: filterCategoryList }),
        });
      } else {
        response = await fetch(SummaryApi.allProduct.url, {
          method: SummaryApi.allProduct.method,
          credentials: "include",
        });
      }
      const data = await response.json();
      setProducts(data?.data || []);
    } catch (err) {
      console.error("Error fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterCategoryList]);

  const handleAddToCart = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const handleSelectCategory = (e) => {
    const { value, checked } = e.target;
    setSelectCategory((prev) => ({ ...prev, [value]: checked }));
  };

  useEffect(() => {
    const selected = Object.keys(selectCategory).filter((key) => selectCategory[key]);
    setFilterCategoryList(selected);
    setCurrentPage(1); // reset page khi filter
  }, [selectCategory]);

  const handleOnChangeSortBy = (e) => {
    const { value } = e.target;
    setSortBy(value);
    setProducts((prev) => {
      const sorted = [...prev];
      if (value === "asc") sorted.sort((a, b) => a.sellingPrice - b.sellingPrice);
      if (value === "dsc") sorted.sort((a, b) => b.sellingPrice - a.sellingPrice);
      return sorted;
    });
  };

  // Pagination logic
  const totalPages = Math.ceil(products.length / cardsPerPage);
  const startIdx = (currentPage - 1) * cardsPerPage;
  const endIdx = startIdx + cardsPerPage;
  const currentData = products.slice(startIdx, endIdx);
  const loadingList = new Array(cardsPerPage).fill(null);

  return (
    <div className="container p-4 mx-auto">
      <div className="flex flex-col gap-4 md:flex-row">
        {/* Filter sidebar */}
        <aside
          className={`bg-white p-4 rounded shadow overflow-y-auto max-h-[calc(100vh-120px)]
           fixed top-0 right-0 z-50 w-64 transform transition-transform duration-300 md:relative md:translate-x-0
           ${showMobileFilter ? "translate-x-0" : "translate-x-full"} md:translate-x-0`}
        >
          {/* Close button mobile */}
          <div className="flex justify-end mb-4 md:hidden">
            <button onClick={() => setShowMobileFilter(false)}>
              <FiX size={24} />
            </button>
          </div>

          {/* Sort */}
          <div>
            <h3 className="pb-2 font-medium uppercase border-b text-slate-500 border-slate-300">
              Sort by
            </h3>
            <form className="flex flex-col gap-2 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="sortBy"
                  value="asc"
                  checked={sortBy === "asc"}
                  onChange={handleOnChangeSortBy}
                />
                Price - Low to High
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="sortBy"
                  value="dsc"
                  checked={sortBy === "dsc"}
                  onChange={handleOnChangeSortBy}
                />
                Price - High to Low
              </label>
            </form>
          </div>

          {/* Category */}
          <div className="mt-6">
            <h3 className="pb-2 font-medium uppercase border-b text-slate-500 border-slate-300">
              Category
            </h3>
            <form className="flex flex-col gap-2 mt-2">
              {productCategory.map((cat) => (
                <label
                  key={cat.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={cat.value}
                    checked={!!selectCategory[cat.value]}
                    onChange={handleSelectCategory}
                  />
                  {cat.label}
                </label>
              ))}
            </form>
          </div>
        </aside>

        {/* Product list */}
        <div className="flex-1 md:ml-0">
          {/* Mobile filter button */}
          <div className="flex justify-end mb-4 md:hidden">
            <button
              onClick={() => setShowMobileFilter(true)}
              className="flex items-center gap-2 px-4 py-2 text-white bg-yellow-500 rounded"
            >
              <FiFilter size={20} />
              Lọc
            </button>
          </div>

          <h2 className="mb-4 text-xl font-bold">
            Tất cả sản phẩm ({products.length})
          </h2>

          {/* Grid cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {loading
              ? loadingList.map((_, idx) => (
                  <div
                    key={"skeleton-" + idx}
                    className="p-2 bg-white rounded-lg shadow animate-pulse min-h-[360px]"
                  >
                    <div className="w-full h-40 rounded bg-slate-200"></div>
                    <div className="p-3 space-y-2">
                      <div className="w-3/4 h-4 rounded bg-slate-200"></div>
                      <div className="w-1/2 h-4 rounded bg-slate-200"></div>
                      <div className="w-1/3 h-4 rounded bg-slate-200"></div>
                    </div>
                  </div>
                ))
              : currentData.map((product) => (
                  <div
                    key={product._id}
                    className="relative flex flex-col overflow-hidden bg-white rounded-lg shadow hover:shadow-lg group"
                  >
                    <Link to={`/product/${product._id}`} className="relative block">
                      <img
                        src={product.productImage?.[0]}
                        alt={product.productName}
                        className="object-cover w-full h-40 transition-transform duration-1000 ease-linear group-hover:scale-110"
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
                    <div className="p-3 text-center">
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
                ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center w-full gap-2 mt-6 font-medium text-gray-500">
              {/* Prev */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                type="button"
                className={`p-1 rounded-full bg-slate-200/50 ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-slate-300"
                }`}
                disabled={currentPage === 1}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 6l-6 6 6 6"
                    stroke="#475569"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1.5 text-sm font-medium">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    className={`h-8 w-8 flex items-center justify-center aspect-square rounded-md text-sm ${
                      currentPage === idx + 1
                        ? "bg-yellow-500 text-white border border-yellow-300"
                        : "bg-white text-gray-700 hover:bg-yellow-100"
                    }`}
                    onClick={() => setCurrentPage(idx + 1)}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              {/* Next */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                type="button"
                className={`p-1 rounded-full bg-slate-200/50 ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-slate-300"
                }`}
                disabled={currentPage === totalPages}
              >
                <svg
                  className="rotate-180"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M15 6l-6 6 6 6"
                    stroke="#475569"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
