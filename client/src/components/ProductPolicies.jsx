import React from 'react';

const policies = [
  {
    img: "//bizweb.dktcdn.net/100/492/035/themes/919334/assets/chinhsach_1.png?1758009839719",
    title: "Miễn phí vận chuyển",
    desc: "Áp dụng free ship cho tất cả đơn hàng từ 300 nghìn"
  },
  {
    img: "//bizweb.dktcdn.net/100/492/035/themes/919334/assets/chinhsach_2.png?1758009839719",
    title: "Đổi trả dễ dàng",
    desc: "Đổi ngay trong ngày nếu như bánh không đúng yêu cầu"
  },
  {
    img: "//bizweb.dktcdn.net/100/492/035/themes/919334/assets/chinhsach_3.png?1758009839719",
    title: "Hỗ trợ nhanh chóng",
    desc: "Gọi Hotline: 19006750 để được hỗ trợ ngay"
  },
  {
    img: "//bizweb.dktcdn.net/100/492/035/themes/919334/assets/chinhsach_4.png?1758009839719",
    title: "Thanh toán đa dạng",
    desc: "Thanh toán khi nhận hàng, Napas, Visa, Chuyển Khoản"
  }
];

const ProductPolicies = ({ layout = "home" }) => {
  const gridClasses =
    layout === "home"
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : "grid-cols-1 sm:grid-cols-2";

  // Nếu layout === home thì bg-transparent, nếu detail thì bg-white
  const cardBgClass = layout === "home"
    ? "bg-transparent shadow-none hover:shadow-none"
    : "bg-white shadow-sm hover:shadow-md";

  return (
    <div className='container p-4 mx-auto'>
      <div className={`grid ${gridClasses} gap-4`}>
        {policies.map((policy, idx) => (
          <div
            key={idx}
            className={`flex flex-row items-center gap-4 p-4 transition rounded ${cardBgClass}`}
          >
            {/* Ảnh căn giữa theo chiều dọc */}
            <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 md:w-10 md:h-10">
              <img src={policy.img} alt={policy.title} className="object-contain w-full h-full"/>
            </div>
            {/* Text */}
            <div className="flex-1 text-left">
              <span className="block text-sm font-semibold text-gray-800">{policy.title}</span>
              <span className="block text-xs text-gray-600">{policy.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPolicies;
