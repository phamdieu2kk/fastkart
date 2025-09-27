import React, { useState, useContext } from "react";
import { FaGoogle, FaApple, FaFacebookF, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast, Slide } from "react-toastify";
import SummaryApi from "../common";
import Context from "../context";
const SignUp = () => {
  const navigate = useNavigate();
  const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePic: "",
  });

  // Convert image to base64
  const imageTobase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadPic = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imagePic = await imageTobase64(file);
    setData((prev) => ({ ...prev, profilePic: imagePic }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.password !== data.confirmPassword) {
      return toast.error("Password and confirm password do not match", { transition: Slide });
    }

    setLoading(true);
    try {
      const res = await fetch(SummaryApi.signUP.url, {
        method: SummaryApi.signUP.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          profilePic: data.profilePic,
        }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success(result.message || "Sign up successful!", { transition: Slide });

        // Nếu muốn tự login luôn sau signup:
        const loginRes = await fetch(SummaryApi.signIn.url, {
          method: SummaryApi.signIn.method,
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email, password: data.password }),
        });

        const loginData = await loginRes.json();
        if (loginData.success) {
          const user = await fetchUserDetails(true);
          fetchUserAddToCart?.();
          if (user?.role === "ADMIN") navigate("/admin-panel/all-products");
          else navigate("/");
        } else {
          navigate("/login");
        }

      } else {
        toast.error(result.message || "Sign up failed", { transition: Slide });
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!", { transition: Slide });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 py-6 bg-gray-50">
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
          <div className="w-16 h-16 border-4 border-[#ff3c00] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <section className="flex flex-col w-full max-w-5xl gap-8 md:flex-row">
        <div className="justify-center hidden w-1/2 md:flex">
          <img
            src="https://themes.pixelstrap.com/fastkart/assets/images/inner-page/log-in.png"
            alt="signup illustration"
            className="w-[28rem] h-auto object-contain"
          />
        </div>

        <div className="relative z-10 w-full p-8 bg-white shadow-xl md:w-1/2 rounded-2xl">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div
              className="w-full h-full rounded-full border-4 border-[#ff3c00] overflow-hidden shadow-lg relative"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <img
                src={
                  data.profilePic ||
                  "https://static.vecteezy.com/system/resources/previews/006/487/917/non_2x/man-avatar-icon-free-vector.jpg"
                }
                alt="profile"
                className="object-cover w-full h-full"
              />
              <label className="absolute bottom-0 left-0 flex items-center justify-center w-full cursor-pointer">
                <span
                  className={`py-1 px-4 text-sm text-white rounded-b-full shadow-md transition-all duration-300 ${
                    data.profilePic
                      ? hover
                        ? "bg-gradient-to-r from-[#ff7a00] to-[#ff3c00]"
                        : "bg-gray-400 text-gray-200"
                      : "bg-gradient-to-r from-[#ff7a00] to-[#ff3c00]"
                  }`}
                >
                  Upload File
                </span>
                <input type="file" className="hidden" onChange={handleUploadPic} accept="image/*" />
              </label>
            </div>
          </div>

          <h2 className="text-center text-3xl font-semibold text-[#ff3c00] mb-6">Sign Up</h2>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleOnChange}
              placeholder="Full Name"
              required
              className="w-full h-12 px-4 border border-gray-300 rounded-xl outline-none placeholder-gray-400 focus:ring-2 focus:ring-[#ff3c00]"
            />
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleOnChange}
              placeholder="Enter email"
              required
              className="w-full h-12 px-4 border border-gray-300 rounded-xl outline-none placeholder-gray-400 focus:ring-2 focus:ring-[#ff3c00]"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={handleOnChange}
                placeholder="Enter password"
                required
                className="w-full h-12 px-4 border border-gray-300 rounded-xl outline-none placeholder-gray-400 focus:ring-2 focus:ring-[#ff3c00] pr-12"
              />
              <span
                className="absolute text-gray-400 -translate-y-1/2 cursor-pointer top-1/2 right-4 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleOnChange}
                placeholder="Confirm password"
                required
                className="w-full h-12 px-4 border border-gray-300 rounded-xl outline-none placeholder-gray-400 focus:ring-2 focus:ring-[#ff3c00] pr-12"
              />
              <span
                className="absolute text-gray-400 -translate-y-1/2 cursor-pointer top-1/2 right-4 hover:text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#ff3c00] text-white font-medium rounded-full hover:bg-[#e63500] hover:scale-105 transition-all duration-300"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-[#ff3c00] hover:text-[#e63500] hover:underline">
              Sign In
            </Link>
          </p>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="px-3 text-sm text-gray-400">or continue with</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <div className="flex justify-center gap-4">
            <button className="p-3 transition border border-gray-300 rounded-full hover:bg-gray-100">
              <FaGoogle className="text-red-500" />
            </button>
            <button className="p-3 transition border border-gray-300 rounded-full hover:bg-gray-100">
              <FaApple />
            </button>
            <button className="p-3 transition border border-gray-300 rounded-full hover:bg-gray-100">
              <FaFacebookF className="text-blue-600" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignUp;
