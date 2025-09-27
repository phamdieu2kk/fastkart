// VerticalCardProduct.jsx (update layout giống Dola Bakery)
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import addToCart from "../helpers/addToCart";
import fetchCategoryWiseProduct from "../helpers/fetchCategoryWiseProduct";
import displayVNDCurrency from "../helpers/displayCurrency";
import Context from "../context";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { BsCart4 } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";
import { AiFillHeart } from "react-icons/ai";
import { ImLeaf } from "react-icons/im";
import { IoLeafOutline } from "react-icons/io5";

import { IoLeafSharp } from "react-icons/io5";

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const NextArrow = ({ onClick }) => (
  <button
    className="absolute z-10 p-1 -translate-y-1/2 bg-white rounded-full shadow-md top-1/2 right-2 hover:bg-gray-100"
    onClick={onClick}
  >
    <MdKeyboardArrowRight size={24} />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    className="absolute z-10 p-1 -translate-y-1/2 bg-white rounded-full shadow-md top-1/2 left-2 hover:bg-gray-100"
    onClick={onClick}
  >
     <MdKeyboardArrowLeft size={24} />
  </button>
);

const VerticalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(6).fill(null);

  const { fetchUserAddToCart } = useContext(Context);

  const handleAddToCart = async (e, id) => {
    e.preventDefault();
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const fetchData = async () => {
    setLoading(true);
    const categoryProduct = await fetchCategoryWiseProduct(category);
    setData(categoryProduct?.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1400, settings: { slidesToShow: 4 } },
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 760, settings: { slidesToShow: 2 } },
      { breakpoint: 460, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="container px-4 mx-auto my-6">
     <div className="flex flex-col items-center">
  <h2 className="py-4 text-3xl font-semibold text-center text-yellow-500">{heading}</h2>

  <div className="flex items-center justify-center w-full max-w-[200px]">
    <span className="flex-1 h-[1px] bg-yellow-400"></span>
       <IoLeafSharp className="w-4 h-4 text-yellow-500" />
               <ImLeaf  className="w-4 h-4 text-yellow-500" />
    <span className="flex-1 h-[1px] bg-yellow-400"></span>
  </div>
</div>


      <Slider {...settings}>
        {loading
          ? loadingList.map((_, idx) => (
              <div key={idx} className="p-2">
                <div className="bg-white rounded-lg shadow animate-pulse h-[360px] flex flex-col">
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
          : data.map((product) => (
              <div key={product._id} className="p-2">
                <div className="relative overflow-hidden bg-white rounded-lg shadow hover:shadow-lg group">
                  <Link to={`/product/${product._id}`} className="relative block">
                   <img
  src={product.productImage[0]}
  alt={product.productName}
  className="object-cover w-full transition-transform duration-[1000ms] ease-linear h-60 group-hover:scale-110"
/>



                    {/* Badges */}
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
                    {/* Hover icons */}
                   <div className="absolute flex gap-2 transition-opacity transform -translate-x-1/2 opacity-0 bottom-2 left-1/2 group-hover:opacity-100">
  <button
    className="flex items-center justify-center w-8 h-8 text-white bg-yellow-500 rounded-full hover:bg-yellow-600"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      handleAddToCart(e, product._id);
    }}
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
      </Slider>
    </div>
  );
};

export default VerticalCardProduct;
