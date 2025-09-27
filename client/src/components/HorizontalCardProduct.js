// HorizontalCardProduct.jsx
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
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GiCupcake } from "react-icons/gi";
import { ImLeaf } from "react-icons/im";
import { IoLeafSharp } from "react-icons/io5";

import { HiSquare3Stack3D } from "react-icons/hi2";

const NextArrow = ({ onClick }) => (
  <button
    className="absolute z-10 p-1 -translate-y-1/2 bg-white rounded-full shadow-md right-2 top-1/2 hover:bg-gray-100"
    onClick={onClick}
  >
    <MdKeyboardArrowRight size={22} />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    className="absolute z-10 p-1 -translate-y-1/2 bg-white rounded-full shadow-md left-2 top-1/2 hover:bg-gray-100"
    onClick={onClick}
  >
    <MdKeyboardArrowLeft size={22} />
  </button>
);

const HorizontalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
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
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 500, settings: { slidesToShow: 1 } },
    ],
  };

  const loadingList = new Array(6).fill(null);

  return (
    <div className="container px-2 mx-auto my-6 md:px-4">
      {/* Heading */}
      

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
                <div className="flex bg-white rounded-lg shadow overflow-hidden animate-pulse min-h-[160px]">
                  <div className="w-28 md:w-32 aspect-square bg-slate-200"></div>
                  <div className="flex flex-col flex-1 gap-2 p-3">
                    <div className="h-4 rounded bg-slate-200"></div>
                    <div className="h-3 rounded bg-slate-200"></div>
                    <div className="flex gap-2">
                      <div className="flex-1 h-4 rounded bg-slate-200"></div>
                      <div className="flex-1 h-4 rounded bg-slate-200"></div>
                    </div>
                    <div className="w-20 h-8 mt-1 rounded-full bg-slate-200"></div>
                  </div>
                </div>
              </div>
            ))
          : data.map((product) => (
              <div key={product._id} className="p-2">
                <div className="flex overflow-hidden transition-shadow bg-white rounded-lg shadow hover:shadow-lg group">
                  {/* Image */}
                  <Link
                    to={`/product/${product._id}`}
                    className="flex-shrink-0 overflow-hidden w-28 md:w-32 aspect-square"
                  >
                    <img
                      src={product.productImage[0]}
                      alt={product.productName}
                      className="object-cover w-full h-full rounded-l-lg transform transition-transform duration-[1000ms] ease-in-out group-hover:scale-110"
                    />
                  </Link>

                  {/* Content */}
                  <div className="flex flex-col justify-between flex-1 p-3">
                    <Link to={`/product/${product._id}`} className="block">
                      <p className="text-sm font-medium text-slate-900 md:text-base line-clamp-1">
                        {product.productName}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 md:text-sm truncate">
                        {product.category}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm font-semibold text-red-600">
                          {displayVNDCurrency(product.sellingPrice)}
                        </p>
                        {product.price > product.sellingPrice && (
                          <p className="text-xs line-through text-slate-400">
                            {displayVNDCurrency(product.price)}
                          </p>
                        )}
                      </div>
                    </Link>

                    {/* Action buttons */}
                   
<div className="flex flex-wrap items-center gap-2 mt-3">
  {[
    {
      icon: <BsCart4 className="w-4 h-4" />,
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleAddToCart(e, product._id);
      },
    },
    {
      icon: <IoIosSearch className="w-4 h-4" />,
      link: `/product/${product._id}`,
    },
    {
      icon: <AiFillHeart className="w-4 h-4" />,
      onClick: (e) => e.preventDefault(),
    },
  ].map((btn, idx) =>
    btn.link ? (
      <Link
        key={idx}
        to={btn.link}
        className="flex items-center justify-center w-8 h-8 text-white bg-yellow-500 rounded-full hover:bg-yellow-600 shrink-0"
      >
        {btn.icon}
      </Link>
    ) : (
      <button
        key={idx}
        onClick={btn.onClick}
        className="flex items-center justify-center w-8 h-8 text-white bg-yellow-500 rounded-full hover:bg-yellow-600 shrink-0"
      >
        {btn.icon}
      </button>
    )
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

export default HorizontalCardProduct;
