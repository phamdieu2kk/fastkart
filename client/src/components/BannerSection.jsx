import React from 'react';
import bannerImg from "../assets/banner/2banner_1.webp";
import bannerImg1 from "../assets/banner/2banner_2.webp";

import { Link } from "react-router-dom";

const BannerSection = () => {
    // Dữ liệu cho 2 banner
    const banners = [
        {
            title: "Bánh nướng & Sữa",
            subtitle: "Vị béo",
            imageUrl: bannerImg,
            
        },
        {
            title: "Bánh & Trà",
            subtitle: "Hương vị tươi",
            imageUrl: bannerImg1,
            
        },
    ];

    return (
        <section className="py-12 section_2_banner">
            <div className="container px-4 mx-auto">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {banners.map((banner, index) => (
                        <div key={index} className="col-md-6">
                            <Link
                                to={banner.link}
                                className="relative overflow-hidden rounded-xl group"
                            >
                                {/* Thumb Image */}
                                <div className="thumb-image">
                                    <img
                                        className="object-cover w-full h-auto transition-transform duration-[2000ms] ease-in-out rounded-xl aspect-[810/525]"
                                        src={banner.imageUrl}
                                        alt={banner.title}
                                    />
                                </div>

                                {/* Overlay nền mờ */}
                                <div className="absolute inset-0 transition-opacity duration-700 bg-gray-200 opacity-0 group-hover:opacity-40"></div>

                                {/* Thumb Content - căn giữa */}
                                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center md:p-10">
                                   <h3 className="font-serif text-xl font-semibold text-black md:text-4xl drop-shadow-sm">
  {banner.title}
</h3>

<p className="mt-3 text-lg font-normal text-black md:text-2xl drop-shadow-sm">
  {banner.subtitle}
</p>

<div className="mt-6 transition-all duration-500 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
  <Link
    to="/all-products"
    className="relative text-lg font-normal text-black after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-500 hover:after:w-full"
  >
    Khám phá tất cả
  </Link>
</div>



                                </div>

                                {/* Overlay border animation */}
                                <div className="absolute inset-0 z-20 pointer-events-none">
                                    <span className="border-line top"></span>
                                    <span className="border-line right"></span>
                                    <span className="border-line bottom"></span>
                                    <span className="border-line left"></span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
<style>
{`
    .border-line {
        position: absolute;
        background-color: black;
        opacity: 0;
    }
    .border-line.top, .border-line.bottom { height: 1px; }
    .border-line.left, .border-line.right { width: 1px; }

    /* chỉnh viền cách đều 16px */
    .border-line.top { top: 16px; left: 50%; right: 50%; }
    .border-line.right { top: 50%; bottom: 50%; right: 16px; }
    .border-line.bottom { bottom: 16px; left: 50%; right: 50%; }
    .border-line.left { top: 50%; bottom: 50%; left: 16px; }

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
        100% { left: 16px; right: 16px; }
    }
    @keyframes draw-vertical-from-center {
        0% { top: 50%; bottom: 50%; }
        100% { top: 16px; bottom: 16px; }
    }
`}
</style>



        </section>
    );
};

export default BannerSection;
