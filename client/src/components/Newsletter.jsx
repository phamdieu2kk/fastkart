import React from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import sideImg from "../assets/banner/image_mailchimp.webp";

const Newsletter = () => {
  return (
    <section className="relative w-full py-4">
      {/* Container giới hạn chiều rộng + background */}
      <div className="container relative mx-auto overflow-hidden shadow-lg rounded-xl">
        <div className="flex flex-col md:flex-row">
          {/* Cột ảnh: ảnh bên trái */}
          <div className="w-full md:w-1/2">
            <img
              src={sideImg}
              alt="Newsletter"
              className="object-cover w-full h-full md:rounded-l-xl"
            />
          </div>

          {/* Cột chữ: text + form */}
          <div className="flex flex-col items-center w-full py-6 text-gray-900 bg-amber-100 rounded-r-xl md:w-1/2 md:py-8">
            <div className="flex items-center justify-center p-3 bg-red-100 rounded-full">
              <MdOutlineMailOutline className="text-3xl text-red-500" />
            </div>

            <h2 className="mt-3 text-lg font-medium text-slate-900">Đăng ký nhận tin</h2>
            <p className="mt-1 text-sm text-center text-slate-900/60 md:w-80 w-72">
              Đăng ký ngay và được giảm giá 15% cho lần mua hàng đầu tiên và nhiều chương trình hấp dẫn dành cho bạn!
            </p>

           <div className="flex items-center w-full px-4 mt-6 md:px-8">
  <input
    type="email"
    placeholder="Enter Your Email"
    className="w-full h-12 pl-4 text-base border border-r-0 rounded-l-lg outline-none border-gray-500/50"
  />
  <button
    type="button"
    className="h-12 text-base font-medium text-white transition-all bg-yellow-500 rounded-r-lg w-44 hover:bg-yellow-600"
  >
    Đăng ký
  </button>
</div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
