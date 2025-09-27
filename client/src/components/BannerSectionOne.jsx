import React from "react";
import bannerImg from "../assets/banner/banner.webp";
import { Link } from "react-router-dom";

const BannerSectionOne = () => {
  return (
    <section className="relative w-full py-8 overflow-hidden">
      <div className="container px-4 mx-auto">
        <Link
          to="#"
          title="Banner"
          className="relative block overflow-hidden rounded-lg group"
        >
          {/* Banner Image */}
          <img
            src={bannerImg}
            alt="Banner"
            className="object-cover w-full h-auto transition-transform duration-[2000ms] ease-in-out group-hover:scale-105"
          />

          {/* Overlay borders */}
          <div className="absolute inset-0 pointer-events-none">
            <span className="border-line top"></span>
            <span className="border-line right"></span>
            <span className="border-line bottom"></span>
            <span className="border-line left"></span>
          </div>
        </Link>
      </div>

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
            100% { left: 8px; right: 8px; }
          }
          @keyframes draw-vertical-from-center {
            0% { top: 50%; bottom: 50%; }
            100% { top: 8px; bottom: 8px; }
          }
        `}
      </style>
    </section>
  );
};

export default BannerSectionOne;
