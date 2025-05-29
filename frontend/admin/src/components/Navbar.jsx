import React from "react";
import { assets } from "../assets/assets";

const Navbar = ({ setToken }) => {
  return (
    <nav className="flex items-center justify-between px-6 sm:px-10 py-2 bg-white shadow-md border-b border-gray-100">
      {/* Logo Section */}
      <a href="/" className="flex items-center gap-2 group">
        <img
          className="w-8 sm:w-10 h-auto transition-transform duration-300 group-hover:scale-105"
          src={assets.S}
          alt="Logo"
        />
       
      </a>

      {/* Logout Button */}
      <button
        onClick={() => setToken("")}
        className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:from-blue-700 hover:to-blue-600"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
