  import React from "react";
  import { Carousel } from "react-responsive-carousel";
  import "react-responsive-carousel/lib/styles/carousel.min.css";

  // Desktop images
  import mainBannerDesktop from "../assets/banner/slider_1 (1).webp";
  import mainBannerDesktop1 from "../assets/banner/slider_2.webp";
  import mainBannerDesktop2 from "../assets/banner/Home-slide.webp";
  import sideBannerDesktop from "../assets/banner/danhmuc_2.webp";

  // Mobile images
  import mainBannerMobile from "../assets/banner/slider_1 (1).webp";
  import mainBannerMobile1 from "../assets/banner/slider_2.webp";
  import mainBannerMobile2 from "../assets/banner/Home-slide.webp";

  // Dữ liệu slide đã được chỉnh màu

const desktopSlides = [
  {
    img: mainBannerDesktop,
    title: "HƯƠNG VỊ NGỌT NGÀO",
    highlight: "BÁNH KEM TƯƠI",
    offer: "30% Off",
    offerText: "Ưu đãi đặc biệt",
    titleColor: "text-white",
    highlightColor: "text-green-400",
    offerBgColor: "bg-red-500",
  },
  {
    img: mainBannerDesktop1,
    title: "BÁNH MÌ NƯỚNG MỖI NGÀY",
    highlight: "GIÒN RỤM - MỀM MỊN",
    offer: "20% Off",
    offerText: "Hot Deal",
    titleColor: "text-white",
    highlightColor: "text-yellow-300",
    offerBgColor: "bg-orange-500",
  },
  {
    img: mainBannerDesktop2,
    title: "KHÁM PHÁ THẾ GIỚI",
    highlight: "BÁNH NGỌT THƯỢNG HẠNG",
    offer: "20% Off",
    offerText: "Duy nhất hôm nay",
    titleColor: "text-white",
    highlightColor: "text-blue-400",
    offerBgColor: "bg-green-600",
  },
];

const mobileSlides = [
  {
    img: mainBannerMobile,
    title: "HƯƠNG VỊ NGỌT NGÀO",
    highlight: "BÁNH KEM TƯƠI",
    offer: "30% Off",
    titleColor: "text-white",
    highlightColor: "text-green-400",
    offerBgColor: "bg-red-500",
  },
  {
    img: mainBannerMobile1,
    title: "BÁNH MÌ NƯỚNG MỖI NGÀY",
    highlight: "GIÒN RỤM - MỀM MỊN",
    offer: "20% Off",
    titleColor: "text-white",
    highlightColor: "text-yellow-300",
    offerBgColor: "bg-orange-500",
  },
  {
    img: mainBannerMobile2,
    title: "KHÁM PHÁ THẾ GIỚI",
    highlight: "BÁNH NGỌT THƯỢNG HẠNG",
    offer: "20% Off",
    titleColor: "text-white",
    highlightColor: "text-blue-400",
    offerBgColor: "bg-green-600",
  },
];



  const BannerProduct = () => {
    const renderCarousel = (slides) => (
      <Carousel
        showArrows={true}
        showStatus={false}
        showThumbs={false}
        showIndicators={false}
        infiniteLoop
        autoPlay
        interval={5000}
        className="w-full h-full"
      >
        {slides.map((slide, idx) => (
          <div key={idx} className="relative">
            <img
              src={slide.img}
              alt={`banner-${idx}`}
              className="w-full h-[400px] md:h-[400px] lg:h-[400px] object-cover rounded-lg"
            />

            {/* Text overlay */}
           
{/* Text overlay */}
<div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center rounded-lg bg-black/40">
  <p className="mb-3 text-lg font-semibold text-red-600">
   Khuyến mãi đặc biệt{" "}
    <span
      className={`px-2 py-[2px] text-white ${slide.offerBgColor} rounded-full text-sm`}
    >
      {slide.offer}
    </span>
  </p>

  <h2 className={`mb-6 text-2xl md:text-4xl font-bold ${slide.titleColor}`}>
    {slide.title.replace(slide.highlight, "")}
    <span className={`block ${slide.highlightColor}`}>
      {slide.highlight}
    </span>
  </h2>

 <button className="px-4 py-2 text-sm font-semibold text-green-500 transition bg-white border-2 rounded-lg border-gradient-to-r from-green-400 to-blue-500 hover:text-white hover:bg-gradient-to-r hover:from-green-400 hover:to-blue-500">
               Xem Ngay →
              </button>
</div>


          </div>
        ))}
      </Carousel>
    );

    return (
      <div className="container px-4 mx-auto">
        {/* Desktop / Laptop */}
        <div className="hidden gap-4 lg:flex">
          <div className="relative w-3/4 max-h-[400px] overflow-hidden rounded-lg shadow-md">
            {renderCarousel(desktopSlides)}
          </div>

<div className="relative w-1/4 max-h-[400px] overflow-hidden rounded-lg shadow-md group">
  <img
    src={sideBannerDesktop}
    alt="Bánh Ngọt Tươi Mới"
    className="object-cover w-full h-full rounded-lg transform transition-transform duration-[1200ms] ease-linear group-hover:scale-110"
  />

  <div className="absolute top-0 left-0 flex flex-col items-start justify-start px-4 py-4 text-gray-800">
    <p className="mb-2 text-lg font-bold text-red-500">Thơm Lừng</p>
    <p className="px-5 py-2 mb-3 text-xl font-extrabold text-white bg-yellow-500 rounded-lg shadow-md">
      Bánh Ngọt Tươi Mới
    </p>
    <button className="px-4 py-2 text-sm font-semibold text-green-500 transition bg-white border-2 rounded-lg border-gradient-to-r from-green-400 to-blue-500 hover:text-white hover:bg-gradient-to-r hover:from-green-400 hover:to-blue-500">
      Thử Ngay →
    </button>
  </div>
</div>

        </div>

        {/* Tablet (md) */}
        <div className="hidden gap-4 md:flex lg:hidden">
          <div className="relative w-2/3 max-h-[400px] overflow-hidden rounded-lg shadow-md">
            {renderCarousel(desktopSlides)}
          </div>

          <div className="relative w-1/3 max-h-[400px] overflow-hidden rounded-lg shadow-md">
            <img
              src={sideBannerDesktop}
              alt="Exclusive Furniture"
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
        </div>

        {/* Mobile */}
        <div className="relative flex w-full mt-4 max-h-[400px] overflow-hidden rounded-lg shadow-md md:hidden">
          {renderCarousel(mobileSlides)}
        </div>
      </div>
    );
  };

  export default BannerProduct;