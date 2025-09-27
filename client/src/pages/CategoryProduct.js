import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiFilter, FiX } from "react-icons/fi";
import productCategory from "../helpers/productCategory";
import VerticalCard from "../components/VerticalCard";
import SummaryApi from "../common";

const CategoryProduct = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy category từ URL
  const urlSearch = new URLSearchParams(location.search);
  const urlCategoryListinArray = urlSearch.getAll("category");
  const urlCategoryListObject = {};
  urlCategoryListinArray.forEach((el) => {
    urlCategoryListObject[el] = true;
  });

  const [selectCategory, setSelectCategory] = useState(urlCategoryListObject);
  const [filterCategoryList, setFilterCategoryList] = useState([]);
  const [sortBy, setSortBy] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.filterProduct.url, {
        method: SummaryApi.filterProduct.method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ category: filterCategoryList }),
      });
      const dataResponse = await response.json();
      setData(dataResponse?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = (e) => {
    const { value, checked } = e.target;
    setSelectCategory((prev) => ({ ...prev, [value]: checked }));
  };

  useEffect(() => {
    const selected = Object.keys(selectCategory).filter((key) => selectCategory[key]);
    setFilterCategoryList(selected);
    navigate(
      "/product-category?" + selected.map((el) => `category=${el}`).join("&")
    );
  }, [selectCategory]);

  useEffect(() => {
    fetchData();
  }, [filterCategoryList]);

  const handleOnChangeSortBy = (e) => {
    const { value } = e.target;
    setSortBy(value);
    setData((prev) => {
      const sorted = [...prev];
      if (value === "asc") sorted.sort((a, b) => a.sellingPrice - b.sellingPrice);
      if (value === "dsc") sorted.sort((a, b) => b.sellingPrice - a.sellingPrice);
      return sorted;
    });
  };

  return (
    <div className="container p-4 mx-auto">
      {/* Mobile filter button */}
      <div className="flex justify-end mb-4 md:hidden">
        <button
          onClick={() => setShowMobileFilter(true)}
          className="flex items-center gap-2 px-4 py-2 text-white bg-yellow-500 rounded"
        >
          <FiFilter size={20} />
        </button>
      </div>

      {/* Mobile overlay */}
      {showMobileFilter && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-40 md:hidden"
          onClick={() => setShowMobileFilter(false)}
        />
      )}

      <div className="flex flex-col gap-4 md:flex-row">
        {/* Filter column */}
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

        {/* Product column */}
        <div className="flex-1 md:ml-0">
          <main>
            <p className="mb-4 text-lg font-medium text-slate-800">
              Search Results: {data.length}
            </p>

            <VerticalCard data={data} loading={loading} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryProduct;
