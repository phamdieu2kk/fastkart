import React, { useState } from "react";
import { FaGoogle, FaApple, FaFacebookF } from "react-icons/fa";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Forgot password email:", email);
  };

  return (
    <div className="flex items-center justify-center h-full px-4 py-6 md:py-12">
      {/* Nội dung login */}
      <section className="flex flex-col items-center w-full max-w-4xl gap-6 md:flex-row md:gap-12">
        {/* Left illustration */}
        <div className="justify-center hidden w-1/2 md:flex">
          <img
            src="https://themes.pixelstrap.com/fastkart/assets/images/inner-page/forgot.png"
            alt="forgot password illustration"
            className="w-[28rem] h-auto object-contain"
          />
        </div>

        {/* Right form */}
        <div className="w-full max-w-md p-6 bg-white shadow-xl md:w-1/2 md:p-10 rounded-2xl">
          <h2 className="text-center text-2xl md:text-3xl font-semibold text-[#ff3c00] mb-6">
            Forgot Password
          </h2>
          <p className="mb-4 text-sm text-center text-gray-600">
            Enter your email to recover your password.
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full h-12 px-4 border border-gray-300 rounded-lg outline-none placeholder-gray-400 focus:ring-2 focus:ring-[#ff3c00]"
              required
            />

            <button
              type="submit"
              className="w-full h-12 bg-[#ff3c00] text-white font-medium rounded-full hover:bg-[#e63500] hover:scale-105 transition-all duration-300"
            >
              Reset Password
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-500">
            <Link
              to="/login"
              className="text-[#ff3c00] hover:text-[#e63500] hover:underline"
            >
              Back to Sign In
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

export default ForgotPassword;
