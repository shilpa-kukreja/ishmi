import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import {
  FaChevronDown,
  FaBlogger,
  FaTags,
  FaUsers,
  FaBoxOpen,
  FaShoppingBag,
  FaHeadset,
} from "react-icons/fa";

const Sidebar = () => {
  const [isBlogOpen, setIsBlogOpen] = useState(false);
  const [isItemOpen, setIsItemOpen] = useState(false);
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  

  const menuItemClasses = ({ isActive }) =>
    `flex items-center gap-3 px-6 py-3 rounded-r-full transition-all duration-300 font-medium text-[15px] ${
      isActive
        ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-md"
        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
    }`;

  const dropdownItemClasses =
    "text-sm text-gray-600 hover:text-blue-600 transition-colors duration-300 pl-3 py-1 border-l border-blue-200";

  return (
    <div className="w-[18%] min-h-screen bg-white border-r shadow-xl flex flex-col justify-between">
      <nav className="flex flex-col mt-6 space-y-1">

        {/* Dashboard */}
        <NavLink to="/" className={menuItemClasses}>
          <img className="w-6 h-6" src={assets.dashboard} alt="Dashboard" />
          <span className="hidden md:block">Dashboard</span>
        </NavLink>

        {/* Items */}
        <div
          onClick={() => setIsItemOpen(!isItemOpen)}
          className="flex items-center gap-3 px-6 py-3 cursor-pointer text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all font-medium text-[15px]"
        >
          <FaBoxOpen className="text-lg" />
          <span className="hidden md:block">Items</span>
          <FaChevronDown className={`ml-auto transition-transform ${isItemOpen ? "rotate-180" : ""}`} />
        </div>
        <div className={`ml-12 flex flex-col gap-1 overflow-hidden transition-all duration-300 ${
          isItemOpen ? "max-h-40" : "max-h-0"
        }`}>
          <NavLink to="/add" className={dropdownItemClasses}>Add Items</NavLink>
          <NavLink to="/list" className={dropdownItemClasses}>List Items</NavLink>
          <NavLink to="/addcombos" className={dropdownItemClasses}>Add Combos</NavLink>
          <NavLink to="/listcombos" className={dropdownItemClasses}>List Combos</NavLink>
        </div>

        {/* Blogs */}
        <div
          onClick={() => setIsBlogOpen(!isBlogOpen)}
          className="flex items-center gap-3 px-6 py-3 cursor-pointer text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all font-medium text-[15px]"
        >
          <FaBlogger className="text-lg" />
          <span className="hidden md:block">Blogs</span>
          <FaChevronDown className={`ml-auto transition-transform ${isBlogOpen ? "rotate-180" : ""}`} />
        </div>
        <div className={`ml-12 flex flex-col gap-1 overflow-hidden transition-all duration-300 ${
          isBlogOpen ? "max-h-40" : "max-h-0"
        }`}>
          <NavLink to="/addblog" className={dropdownItemClasses}>Add Blog</NavLink>
          <NavLink to="/listblog" className={dropdownItemClasses}>List Blogs</NavLink>
        </div>

        {/* Coupons */}
        <div
          onClick={() => setIsCouponOpen(!isCouponOpen)}
          className="flex items-center gap-3 px-6 py-3 cursor-pointer text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all font-medium text-[15px]"
        >
          <FaTags className="text-lg" />
          <span className="hidden md:block">Coupons</span>
          <FaChevronDown className={`ml-auto transition-transform ${isCouponOpen ? "rotate-180" : ""}`} />
        </div>
        <div className={`ml-12 flex flex-col gap-1 overflow-hidden transition-all duration-300 ${
          isCouponOpen ? "max-h-40" : "max-h-0"
        }`}>
          <NavLink to="/addcoupan" className={dropdownItemClasses}>Add Coupon</NavLink>
          <NavLink to="/listcoupan" className={dropdownItemClasses}>List Coupons</NavLink>
        </div>

        {/* Orders */}
        <NavLink to="/orders" className={menuItemClasses}>
          <FaShoppingBag className="text-lg" />
          <span className="hidden md:block">Order Items</span>
        </NavLink>

        {/* Users */}
        <NavLink to="/users" className={menuItemClasses}>
          <FaUsers className="text-lg" />
          <span className="hidden md:block">Manage Users</span>
        </NavLink>

        {/* Contacts */}
        <NavLink to="/contacts" className={menuItemClasses}>
          <FaHeadset className="text-lg" />
          <span className="hidden md:block">Contacts</span>
        </NavLink>

        {/* Subscriptions */}
        <NavLink to="/subscriptions" className={menuItemClasses}>
          <img className="w-6 h-6" src={assets.subsription} alt="Subscriptions" />
          <span className="hidden md:block">Subscriptions</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
