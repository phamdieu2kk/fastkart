import React, { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaRegCircleUser, FaUsers } from "react-icons/fa6";
import { BsCart4 } from "react-icons/bs";
import { LuLogOut } from "react-icons/lu";
import { setUserDetails } from "../store/userSlice";
import ROLE from "../common/role";

const AdminPanel = () => {
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Sidebar links
  const sidebarLinks = [
    {
      name: "All Users",
      path: "/admin-panel/all-users",
      icon: <FaUsers className="w-6 h-6" />,
      type: "link",
    },
    {
      name: "All Products",
      path: "/admin-panel/all-products",
      icon: <BsCart4 className="w-6 h-6" />,
      type: "link",
    },
    {
      name: "Logout",
      icon: <LuLogOut className="w-6 h-6" />,
      type: "logout",
    },
  ];

  // Logout handler
  const handleLogout = () => {
    dispatch(setUserDetails(null));
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    if (user?.role !== ROLE.ADMIN) {
      navigate("/")
    }
  }, [user])

  return (
    <div className="flex flex-col min-h-screen pt-16">
      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="flex flex-col flex-shrink-0 w-64 transition-all duration-300 bg-white shadow-lg md:w-56 lg:w-64">
          {/* User Info */}
          <div className="flex flex-col items-center justify-center py-6 border-b">
            <div className="relative mb-3">
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user?.name}
                  className="object-cover w-24 h-24 border-4 border-yellow-500 rounded-full md:w-28 md:h-28"
                />
              ) : (
                <FaRegCircleUser className="w-24 h-24 text-gray-400 md:w-28 md:h-28" />
              )}
            </div>
            <p className="text-base font-semibold capitalize md:text-lg">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.role}</p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col flex-1 gap-2 p-3 md:p-4">
            {sidebarLinks.map((item, index) => {
              if (item.type === "link") {
                const isActive =
                  location.pathname === item.path ||
                  location.pathname.endsWith(item.path);
                return (
                  <Link
                    key={index}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition text-sm md:text-base
                      ${
                        isActive
                          ? "bg-yellow-100 text-yellow-600 border-r-4 border-yellow-500 font-medium"
                          : "text-gray-700 hover:bg-yellow-50"
                      }`}
                    title={item.name}
                  >
                    {item.icon}
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              }

              // Logout button
              if (item.type === "logout") {
                return (
                  <button
                    key={index}
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2 mt-auto text-sm font-medium text-red-600 rounded-lg hover:bg-red-50"
                  >
                    {item.icon}
                    <span className="truncate">{item.name}</span>
                  </button>
                );
              }

              return null;
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-h-screen p-4 overflow-auto bg-gray-50 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
