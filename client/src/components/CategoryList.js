import React, { useEffect, useState, useRef } from 'react';
import SummaryApi from '../common';
import { Link } from 'react-router-dom';
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const carouselRef = useRef(null);
  const placeholderCount = 10;

  // Fetch category products
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(SummaryApi.categoryProduct.url);
      const data = await res.json();
      setCategories(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Scroll buttons for mobile carousel
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };
  const scrollRight = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const scrollAmount = 200;
    const halfScrollWidth = carousel.scrollWidth / 2;

    if (carousel.scrollLeft + scrollAmount >= halfScrollWidth) {
      carousel.scrollLeft = 0;
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    } else {
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Drag-to-scroll for mobile
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let isDown = false, startX, scrollLeftPos;

    const handleMouseDown = e => {
      isDown = true;
      startX = e.pageX - carousel.offsetLeft;
      scrollLeftPos = carousel.scrollLeft;
      carousel.classList.add('cursor-grabbing');
    };
    const handleMouseUpLeave = () => {
      isDown = false;
      carousel.classList.remove('cursor-grabbing');
    };
    const handleMouseMove = e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      carousel.scrollLeft = scrollLeftPos - (x - startX);
    };

    carousel.addEventListener('mousedown', handleMouseDown);
    carousel.addEventListener('mouseup', handleMouseUpLeave);
    carousel.addEventListener('mouseleave', handleMouseUpLeave);
    carousel.addEventListener('mousemove', handleMouseMove);

    return () => {
      carousel.removeEventListener('mousedown', handleMouseDown);
      carousel.removeEventListener('mouseup', handleMouseUpLeave);
      carousel.removeEventListener('mouseleave', handleMouseUpLeave);
      carousel.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Skeleton placeholder
  const placeholders = Array.from({ length: placeholderCount });

  return (
    <div className="container p-4 pt-20 mx-auto"> 
      {/* Desktop */}
      <div className="flex-wrap justify-center hidden gap-4 px-2 py-3 lg:flex">
        {loading
          ? placeholders.map((_, idx) => (
              <div key={idx} className="w-24 h-24 bg-gray-200 rounded-full md:w-20 md:h-20 lg:w-24 lg:h-24 animate-pulse"></div>
            ))
          : categories.map(cat => (
              <Link 
  key={cat.category} 
  to={`/product-category?category=${cat.category}`} 
  className="flex flex-col items-center transition-transform hover:scale-105 group"
>
  <div className="flex items-center justify-center w-24 h-24 overflow-hidden bg-gray-100 rounded-full shadow-md md:w-20 md:h-20 lg:w-24 lg:h-24">
    <img 
      src={cat.productImage[0]} 
      alt={cat.category} 
      className="object-cover w-full h-full rounded-full transform transition-transform duration-[1200ms] ease-linear group-hover:scale-110" 
    />
  </div>
  <p className="mt-2 text-sm text-center capitalize md:text-base">{cat.category}</p>
</Link>

            ))}
      </div>

      {/* Mobile Carousel */}
      <div className="relative flex items-center lg:hidden">
        <button onClick={scrollLeft} className="absolute z-10 p-2 -translate-y-1/2 rounded-full shadow-md top-1/2 left-2 bg-white/70 hover:bg-white">
          <FaAngleLeft className="w-5 h-5 text-gray-500"/>
        </button>

        <div ref={carouselRef} className="flex gap-6 px-8 py-4 overflow-x-auto whitespace-nowrap scroll-smooth cursor-grab [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {(loading ? placeholders : [...categories, ...categories]).map((cat, idx) => 
            loading ? (
              <div key={idx} className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-full animate-pulse"></div>
            ) : (
              <Link 
  key={idx} 
  to={`/product-category?category=${cat.category}`} 
  className="flex flex-col items-center flex-shrink-0 group"
>
  <div className="flex items-center justify-center w-20 h-20 overflow-hidden bg-gray-100 rounded-full shadow-md">
    <img 
      src={cat.productImage[0]} 
      alt={cat.category} 
      className="object-cover w-full h-full rounded-full transform transition-transform duration-[1200ms] ease-linear group-hover:scale-110" 
    />
  </div>
  <p className="mt-2 text-sm text-center">{cat.category}</p>
</Link>

            )
          )}
        </div>

        <button onClick={scrollRight} className="absolute z-10 p-2 -translate-y-1/2 rounded-full shadow-md top-1/2 right-2 bg-white/70 hover:bg-white">
          <FaAngleRight className="w-5 h-5 text-gray-500"/>
        </button>
      </div>
    </div>
  );
};

export default CategoryList;


















