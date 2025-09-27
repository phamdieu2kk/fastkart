import React, { useState } from "react";

import imgabout1 from "../assets/banner/Concept7vertical.webp";
import imgabout2 from "../assets/banner/Concept-3-vertical.webp";
import imgabout3 from "../assets/banner/Concept-25.webp";
import imgabout4 from "../assets/banner/danhmuc_1.webp";

const About = () => {
  const [showFull, setShowFull] = useState(false);

  const shortText = `Fastkart là một tiệm bánh nằm ẩn mình giữa phố xá nhộn nhịp của thành phố. Với bề dày hơn 10 năm kinh nghiệm trong lĩnh vực làm bánh, Fastkart đã nhanh chóng trở thành điểm đến lý tưởng cho những ai đam mê bánh ngọt và muốn thưởng thức những món đặc sản tại địa phương.`;

  const fullText = `
 Tiệm bánh nổi tiếng này tự hào sở hữu một đội ngũ nhân viên tận tâm và giàu kinh nghiệm. Họ không chỉ đảm bảo mang đến cho khách hàng những món bánh được làm tinh tế với sự tỉ mỉ và tình yêu, mà còn luôn sẵn lòng lắng nghe và đáp ứng mọi nhu cầu đặc biệt của khách hàng.

 Sự phong phú và đa dạng của thực đơn tại Fastkart là một điểm nhấn đáng chú ý. Khách hàng có thể chọn từ một loạt các loại bánh tươi ngon như bánh mousse, bánh su kem, bánh tart, bánh gạo, bánh tiramisu, bánh phô mai, bánh cookie và nhiều loại bánh khác nữa. Mỗi món bánh đều được chế biến từ những nguyên liệu tươi ngon nhất và được trang trí tỉ mỉ, mang lại một trải nghiệm thưởng thức thật tuyệt vời.

 Không chỉ chăm chút vào hương vị, Fastkart cũng đặc biệt quan tâm đến việc thể hiện sự sáng tạo và độc đáo trong từng chi tiết trên các món bánh của mình. Bạn có thể tìm thấy những chiếc bánh được trang trí tinh tế với hình dáng, màu sắc và hoa văn độc đáo. Những điểm nhấn này không chỉ làm cho bánh thêm đẹp mắt mà còn tạo nên một phong cách riêng biệt cho Fastkart.

 Khách hàng đã trở thành fan hâm mộ của Fastkart không chỉ vì những món bánh ngon mà còn vì không gian ấm cúng và thoải mái tại tiệm. Với thiết kế sang trọng nhưng cổ điển, Fastkart tạo ra một môi trường lý tưởng để thư giãn và thưởng thức bánh ngọt. Bạn có thể ngồi thoải mái, thưởng thức một ly cà phê nóng và thúc đẩy hương vị bánh ngọt bằng những cuộn giấy nhiệt động mời mọc.

 Fastkart không chỉ đáng để tham quan mà còn là điểm dừng chân lí tưởng để tìm mua những món bánh ngon nhất. Cho dù bạn muốn tổ chức một bữa tiệc, mua một chiếc bánh sinh nhật đặc biệt hay đơn giản là muốn thưởng thức một chiếc bánh nhỏ đầy mê hoặc, Fastkart sẽ luôn là sự lựa chọn hàng đầu của bạn.

 Hãy đến với Fastkart và hãy để những món bánh tuyệt vời của chúng tôi làm cho cuộc sống bạn thêm ngọt ngào.
`;

  const initialImages = [imgabout1, imgabout2];
  const moreImages = [imgabout3, imgabout4];
  const displayedImages = showFull ? [...initialImages, ...moreImages] : initialImages;

  return (
    <section className="relative py-12 md:py-24">
      <div className="px-4 mx-auto max-w-7xl md:px-5 lg:px-5">
        <div className="grid items-start gap-8 lg:grid-cols-2">

          {/* Left Column: Images */}
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
            {displayedImages.map((img, idx) => {
              // Luôn áp dụng 2 cột: ảnh chẵn trái, ảnh lẻ phải
              const isLeft = idx % 2 === 0;
              return (
                <div
                  key={idx}
                  className={`flex ${isLeft ? "pt-12 sm:pt-24 sm:justify-end justify-start items-start" : "sm:ml-0 ml-auto"}`}
                >
                  <img
                    src={img}
                    alt={`Fastkart ${idx + 1}`}
                    className="rounded-xl object-cover w-full h-[250px] sm:h-[300px] lg:h-[350px] transition-all duration-500"
                  />
                </div>
              );
            })}
          </div>

          {/* Right Column: Text */}
          <div className="flex flex-col items-start justify-center w-full gap-6">
            <div className="flex flex-col items-start w-full gap-6">
              <h2 className="text-4xl font-bold text-left text-gray-900">
                Giới thiệu Fastkart
              </h2>
              <p className="text-base leading-relaxed text-left text-gray-500">
                {shortText}
              </p>
              {showFull && (
                <p className="text-base leading-relaxed text-left text-gray-600 whitespace-pre-line">
                  {fullText}
                </p>
              )}
            </div>
            <button
              onClick={() => setShowFull(!showFull)}
              className="flex items-center justify-center w-full px-4 py-2 text-white transition-all duration-500 bg-indigo-600 rounded-lg sm:w-fit hover:bg-indigo-800"
            >
              {showFull ? "Thu gọn" : "Đọc thêm"}
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
