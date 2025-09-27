import React, { useState, useEffect, useContext, useRef } from "react";
import Logo from "./Logo";
import { GrSearch } from "react-icons/gr";
import { FiUser, FiShoppingCart, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import SummaryApi from "../common";
import { setUserDetails } from "../store/userSlice";
import ROLE from "../common/role";
import Context from "../context";
import productCategory from "../helpers/productCategory";
import { Popover, Dialog, Disclosure } from "@headlessui/react";

const Header = () => {
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const context = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  const [menuDisplay, setMenuDisplay] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopCatOpen, setDesktopCatOpen] = useState(false);
  const dropdownRef = useRef(null);

  const searchQuery = new URLSearchParams(location?.search).get("q") || "";
  const [search, setSearch] = useState(searchQuery);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) dispatch(setUserDetails(JSON.parse(savedUser)));
    else dispatch(setUserDetails(null));
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuDisplay(false);
        setDesktopCatOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch(SummaryApi.logout_user.url, {
        method: SummaryApi.logout_user.method,
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Logout successful!");
        dispatch(setUserDetails(null));
        localStorage.removeItem("user");
        navigate("/login");
      } else toast.error(data.message || "Logout failed!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    navigate(value ? `/search?q=${value}` : "/search");
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="relative flex items-center justify-between p-4 mx-auto lg:px-8 max-w-7xl">
        {/* Logo trái */}
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <Logo w={157} h={40} />
          </Link>
        </div>

        {/* Menu Desktop giữa */}
        <div className="items-center hidden lg:flex lg:gap-x-8 lg:flex-1 lg:justify-center">
          <Link
            to="/"
            className="text-sm font-semibold text-gray-900 hover:text-[#0DA487] transition"
          >
            Trang chủ
          </Link>
          <Link
            to="/about"
            className="text-sm font-semibold text-gray-900 hover:text-[#0DA487] transition"
          >
            Giới thiệu
          </Link>

          {/* Sản phẩm Dropdown */}
          <Popover className="relative">
            <Popover.Button
              className="flex items-center text-sm font-semibold text-gray-900 gap-x-1"
              onMouseEnter={() => setDesktopCatOpen(true)}
              onMouseLeave={() => setDesktopCatOpen(false)}
            >
              Sản phẩm
              <svg
                className={`w-3 h-3 ml-1 transition-transform ${desktopCatOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Popover.Button>

            <Popover.Panel className="absolute z-10 w-48 mt-2 -translate-x-1/2 bg-white border rounded shadow-lg left-1/2">
              {productCategory.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/product-category?category=${encodeURIComponent(cat.value)}`}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  {cat.label}
                </Link>
              ))}
            </Popover.Panel>
          </Popover>

          <Link
            to="/contact"
            className="text-sm font-semibold text-gray-900 hover:text-[#0DA487] transition"
          >
            Liên hệ
          </Link>
        </div>

        {/* Search + Cart + User phải */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center border rounded-full px-3 py-1.5 gap-2">
            <input
              type="text"
              placeholder="Search products"
              className="placeholder-gray-500 bg-transparent outline-none"
              value={search}
              onChange={handleSearch}
            />
            <GrSearch className="text-gray-500" />
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative text-2xl">
            <FiShoppingCart />
            <div
              className={`absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-[#FF4C3B] rounded-full -top-2 -right-3 transform transition-all duration-200 ease-out ${
                context?.cartProductCount > 0
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-75 pointer-events-none"
              }`}
            >
              {context?.cartProductCount}
            </div>
          </Link>

          {/* User */}
          {user?._id ? (
            <div ref={dropdownRef} className="relative">
              <div
                className="flex items-center gap-2 text-gray-800 cursor-pointer"
                onClick={() => setMenuDisplay((prev) => !prev)}
              >
                {user?.profilePic ? (
                  <img src={user.profilePic} alt={user.name} className="w-10 h-10 rounded-full" />
                ) : (
                  <FiUser className="text-2xl" />
                )}
                <span className="hidden font-medium sm:inline">{user.name}</span>
              </div>

              <div
                className={`absolute right-0 w-44 mt-2 bg-white border rounded shadow-lg transition-all duration-200 ease-out ${
                  menuDisplay
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              >
                {user?.role === ROLE.ADMIN && (
                  <Link
                    to="/admin-panel/all-products"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setMenuDisplay(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMenuDisplay(false);
                    handleLogout();
                  }}
                  className="flex items-center w-full gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  <FiLogOut /> Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2 text-white bg-[#0DA487] rounded-full hover:bg-[#0b8c73] transition-colors"
            >
              Đăng nhập
            </Link>
          )}

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <FiMenu className="text-2xl" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {/* Mobile Menu */}
<Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
  <div className="fixed inset-0 z-50 bg-black/30" />
  <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full p-6 overflow-y-auto bg-white sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
    <div className="flex items-center justify-between">
      <Link to="/" className="-m-1.5 p-1.5">
        <Logo w={157} h={40} />
      </Link>
      <button
        type="button"
        onClick={() => setMobileMenuOpen(false)}
        className="-m-2.5 rounded-md p-2.5 text-gray-700"
      >
        <FiX className="text-2xl" />
      </button>
    </div>

    <div className="mt-4">
      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-2 border rounded-full">
        <input
          type="text"
          placeholder="Search..."
          className="w-full text-sm bg-transparent outline-none"
          value={search}
          onChange={handleSearch}
        />
        <GrSearch className="text-gray-500" />
      </div>
    </div>

    {/* Menu items */}
    <div className="flow-root mt-6">
      <div className="-my-6 divide-y divide-gray-500/10">
        <div className="py-6 space-y-2">
          <Link
            to="/"
            className="block px-3 py-2 rounded hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            Trang chủ
          </Link>
          <Link
            to="/about"
            className="block px-3 py-2 rounded hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            Giới thiệu
          </Link>
          {/* Sản phẩm Dropdown */}
          <Disclosure>
            <Disclosure.Button className="flex justify-between w-full px-3 py-2 text-base font-semibold text-left text-gray-900 rounded-lg hover:bg-gray-50">
              Sản phẩm
              <svg className="w-3 h-3 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Disclosure.Button>
            <Disclosure.Panel className="pl-4 mt-2 space-y-2">
              {productCategory.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/product-category?category=${encodeURIComponent(cat.value)}`}
                  className="block px-2 py-1 rounded hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat.label}
                </Link>
              ))}
            </Disclosure.Panel>
          </Disclosure>
          <Link
            to="/contact"
            className="block px-3 py-2 rounded hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            Liên hệ
          </Link>
        </div>

        <div className="py-6">
          {user?._id ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="block w-full px-3 py-2 text-left text-red-600 rounded hover:bg-red-50"
            >
              Đăng xuất
            </button>
          ) : (
            <Link
              to="/login"
              className="block px-3 py-2 rounded hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </div>
  </Dialog.Panel>
</Dialog>

    </header>
  );
};

export default Header;
