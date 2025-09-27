import SummaryApi from "../common";
import { toast } from "react-toastify";

const addToCart = async (e, id) => {
  // Ngăn event nếu có
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }

  try {
    const response = await fetch(SummaryApi.addToCartProduct.url, {
      method: SummaryApi.addToCartProduct.method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId: id }),
    });

    if (!response.ok) {
      // Nếu server trả về lỗi HTTP
      throw new Error("Lỗi mạng: " + response.status);
    }

    const responseData = await response.json();

    if (responseData.success) {
      toast.success(responseData.message);
    } else if (responseData.error) {
      toast.error(responseData.message);
    }

    return responseData;
  } catch (err) {
    // Bắt lỗi mạng hoặc JSON
    console.error(err);
    toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng!");
    return { success: false, error: true, message: err.message };
  }
};

export default addToCart;
