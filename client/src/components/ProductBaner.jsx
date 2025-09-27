import React from 'react';
import { Link } from 'react-router-dom';

import bannerImg from "../assets/banner/about_1.webp";
import bannerImg1 from "../assets/banner/about_2.webp";

const ProductBaner = () => {
  const banners = [
    {
      id: 1,
      title: "Bánh Mousse Sữa Chua",
      content:
        "Những chiếc bánh mousse sữa chua béo thơm, mềm ngọt là món tráng miệng được nhiều người yêu thích trong những ngày oi bức.",
      imageUrl: bannerImg,
      link: "/all-products",
    },
    {
      id: 2,
      title: "Bánh Dark Chocolate",
      content:
        "Nếu bạn là tín đồ của chocolate thì không thể bỏ qua loại bánh Dark Chocolate. Bánh đem lại vị đắng đặc trưng nguyên thủy của socola mà chỉ cần thử một lần là sẽ mê đắm.",
      imageUrl: bannerImg1,
      link: "/all-products",
    },
  ];

  const ContentBlock = ({ title, content, link, wide = false }) => (
    <div
      className={`flex flex-col justify-center py-8 md:py-12 ${
        wide ? "md:col-span-2" : ""
      }`}
    >
      <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
        <h3
          className={`font-serif font-semibold text-gray-800 ${
            wide
              ? "text-2xl md:text-3xl leading-snug"
              : "text-2xl md:text-4xl leading-snug"
          }`}
        >
          {title}
        </h3>
        <p
          className={`${
            wide
              ? "max-w-4xl text-sm md:text-base leading-relaxed md:leading-loose text-gray-700"
              : "w-full text-sm md:text-base leading-relaxed text-gray-700"
          }`}
        >
          {content}
        </p>

        <Link
          to={link}
          className="px-6 py-2 mt-2 text-sm font-medium text-gray-700 transition border border-gray-400 rounded hover:bg-gray-100"
        >
          Xem ngay
        </Link>
      </div>
    </div>
  );

  const ImageBlock = ({ imageUrl, title, link, aspect = "aspect-[5/3]" }) => (
    <div
      className={`relative overflow-hidden rounded-xl shadow-lg group ${aspect}`}
    >
      <Link to={link} title={title} className="relative block">
        <img
          alt={title}
          className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
          src={imageUrl}
        />

        {/* Overlay borders */}
        <div className="absolute inset-0 pointer-events-none">
          <span className="border-line top"></span>
          <span className="border-line right"></span>
          <span className="border-line bottom"></span>
          <span className="border-line left"></span>
        </div>
      </Link>

      <style>
        {`
          .border-line {
            position: absolute;
            background-color: white;
            opacity: 0;
          }

          .border-line.top,
          .border-line.bottom { height: 1px; }
          .border-line.left,
          .border-line.right { width: 1px; }

          .border-line.top {
            top: 8px; left: 50%; right: 50%; transform-origin: center;
          }
          .border-line.right {
            top: 50%; bottom: 50%; right: 8px; transform-origin: center;
          }
          .border-line.bottom {
            bottom: 8px; left: 50%; right: 50%; transform-origin: center;
          }
          .border-line.left {
            top: 50%; bottom: 50%; left: 8px; transform-origin: center;
          }

          .group:hover .border-line {
            opacity: 1;
            animation-fill-mode: forwards;
          }

          .group:hover .border-line.top {
            animation: draw-horizontal-from-center 0.7s forwards;
          }
          .group:hover .border-line.right {
            animation: draw-vertical-from-center 0.7s forwards;
          }
          .group:hover .border-line.bottom {
            animation: draw-horizontal-from-center 0.7s forwards;
          }
          .group:hover .border-line.left {
            animation: draw-vertical-from-center 0.7s forwards;
          }

          @keyframes draw-horizontal-from-center {
            0% { left: 50%; right: 50%; }
            100% { left: 6px; right: 6px; }
          }
          @keyframes draw-vertical-from-center {
            0% { top: 50%; bottom: 50%; }
            100% { top: 8px; bottom: 8px; }
          }
        `}
      </style>
    </div>
  );

  return (
   
      <div className="container px-4 mx-auto">
        <div className="grid items-center grid-cols-1 gap-12 md:gap-20 md:grid-cols-2">
          <div className="order-1 md:order-1">
            <ContentBlock {...banners[0]} />
          </div>
          <div className="order-2 md:order-2">
            <ImageBlock {...banners[0]} aspect="aspect-[5/3]" />
          </div>

          <div className="order-3 md:order-4">
            <ContentBlock {...banners[1]} />
          </div>
          <div className="order-4 md:order-3">
            <ImageBlock {...banners[1]} aspect="aspect-[16/9]" />
          </div>
        </div>
      </div>
    
  );
};

export default ProductBaner;
