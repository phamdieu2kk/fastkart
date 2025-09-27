import React, { useState, useContext } from "react";
import { FaGoogle, FaApple, FaFacebookF, FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast, Slide } from "react-toastify";
import SummaryApi from "../common";
import Context from "../context";
const SignIn = () => {
  const navigate = useNavigate();
  const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(SummaryApi.signIn.url, {
        method: SummaryApi.signIn.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Network error");

      const result = await res.json();

      if (result.success) {
        toast.success(result.message || "Login successful!", { transition: Slide, autoClose: 3000 });

        // fetch user details & cart
        const user = await fetchUserDetails(true);
        fetchUserAddToCart?.();

        // Redirect theo role
        if (user?.role === "ADMIN") navigate("/admin-panel/all-products");
        else navigate("/");
      } else {
        toast.error(result.message || "Login failed", { transition: Slide, autoClose: 3000 });
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!", { transition: Slide, autoClose: 3000 });
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
            alt="login illustration"
            className="w-[28rem] h-auto object-contain"
          />
        </div>

        <div className="relative z-10 w-full p-8 bg-white shadow-xl md:w-1/2 rounded-2xl">
          <h2 className="text-center text-3xl font-semibold text-[#ff3c00] mb-6">Sign In</h2>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="relative">
              <FaEnvelope className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleOnChange}
                placeholder="Enter email"
                required
                className="w-full h-12 px-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff3c00] outline-none"
              />
            </div>

            <div className="relative">
              <FaLock className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={handleOnChange}
                placeholder="Enter password"
                required
                className="w-full h-12 px-10 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff3c00] outline-none"
              />
              <span
                className="absolute text-gray-400 -translate-y-1/2 cursor-pointer right-3 top-1/2 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="text-sm text-right">
              <Link to="/forgot-password" className="text-green-600 hover:text-green-700 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#ff3c00] text-white font-medium rounded-full hover:bg-[#e63500] hover:scale-105 transition-all duration-300"
            >
              {loading ? "Logging in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-500">
            Don't have an account?{" "}
            <Link to="/sign-up" className="text-[#ff3c00] hover:text-[#e63500] hover:underline">
              Sign Up
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

export default SignIn;
