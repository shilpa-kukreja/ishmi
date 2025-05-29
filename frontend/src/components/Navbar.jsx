import React, { useContext, useState, useEffect, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { products, getCartCount, getWishlistCount, token, setToken, setLoginnavigate} =
    useContext(ShopContext);
  const [groupedCategories, setGroupedCategories] = useState({});
  const [showDropdownlogin, setShowDropdownlogin] = useState(false);
  
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const location = useLocation();
  const isHome = location.pathname === "/";
  
   const handleCategoryClick = (category, subcategory = null) => {
    const path = subcategory
      ? `/category/${category}?subcategory=${subcategory}`
      : `/category/${category}`;
    navigate(path);
    setShowDropdown(false);
  };

 

   useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdownlogin(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  


//  useEffect(() => {
//   const handleClickOutside = (event) => {
//     // Delay the check to allow onClick handlers to run first
//     setTimeout(() => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target)
//       ) {
//         setShowDropdown(false);
//       }
//     }, 100);
//   };

//   document.addEventListener("mousedown", handleClickOutside);
//   return () => {
//     document.removeEventListener("mousedown", handleClickOutside);
//   };
// }, []);


  


  useEffect(() => {
    const groupedData = products.reduce((acc, product) => {
      const mainCategory = product.category.mainCategory;
      const subCategory = product.category.subCategory;

      if (!acc[mainCategory]) {
        acc[mainCategory] = [];
      }

      if (!acc[mainCategory].includes(subCategory)) {
        acc[mainCategory].push(subCategory);
      }

      return acc;
    }, {});

    setGroupedCategories(groupedData);
  }, [products]);

  const logout = () => {
    setLoginnavigate("/");
    navigate("/loginsignup");
    localStorage.removeItem("token");
    setToken("");
  };

  return (
    <nav className={`w-full bg-[#fff8ee] shadow-md  z-50 ${isHome ? "absolute top-0 bg-transparent shadow-none" : ""}`}>
      <div className="flex items-center justify-between px-6 md:px-12 sm:py-1 py-2 ">
        {/* Logo */}
        <NavLink to="/">
          <img src={assets.S2} alt="Logo" className="sm:h-15 h-12 w-full" />
        </NavLink>

        <div className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
          <NavLink to="/shop" className="hover:text-black transition">
            Shop All
          </NavLink>
          <NavLink to="/bestseller" className="hover:text-black transition">
            Best Sellers
          </NavLink>

         <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-1 hover:text-black transition"
            >
              <span>Shop By</span>
              <img
                src="https://img.icons8.com/?size=100&id=85327&format=png&color=000000"
                alt="Dropdown Icon"
                className="h-4 w-4"
              />
            </button>

            {showDropdown && (
              <div className="absolute  top-10 left-0 w-48 bg-white shadow-lg rounded-md p-2 z-50 border border-gray-300">
                {Object.entries(groupedCategories).length > 0 ? (
                  Object.entries(groupedCategories).map(
                    ([mainCategory, subCategories]) => (
                      <div key={mainCategory}>
                        <p
                          className="px-4 py-2 font-semibold cursor-pointer hover:bg-gray-100"
                          onClick={() => handleCategoryClick(mainCategory)}
                        >
                          {mainCategory}
                        </p>
                        {subCategories.map((subCategory, index) => (
                          <p
                            key={index}
                            className="pl-6 py-1 text-sm text-gray-500 cursor-pointer hover:bg-gray-100"
                            onClick={() =>
                              handleCategoryClick(mainCategory, subCategory)
                            }
                          >
                            {subCategory}
                          </p>
                        ))}
                      </div>
                    )
                  )
                ) : (
                  <p className="px-4 py-2 text-gray-500">No Categories</p>
                )}
              </div>
            )}
          </div>
          <NavLink to="/gift" className="hover:text-black transition">
            Gift & Combo
          </NavLink>

          <NavLink to="/blogs" className="hover:text-black transition">
            Blogs
          </NavLink>
          <NavLink to="/contact-us" className="hover:text-black transition">
            Contact Us
          </NavLink>

        </div>




        {/* Right Section */}
        <div className="flex items-center space-x-4">

          <div className="relative pt-2" ref={dropdownRef}>
      <button onClick={() => setShowDropdownlogin(!showDropdownlogin)}>
        <img
          src={
            token
              ? "https://img.icons8.com/ios-filled/50/user-male-circle.png"
              : "https://img.icons8.com/?size=100&id=23374&format=png&color=000000"
          }
          alt="User"
          className="h-6 w-6 hover:opacity-80"
        />
      </button>

      {showDropdownlogin && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <ul className="py-2">
            {token ? (
              <>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    navigate("/orders");
                    setShowDropdownlogin(false);
                  }}
                >
                  Your Orders
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                  onClick={() => {
                    logout();
                    setShowDropdownlogin(false);
                  }}
                >
                  Logout
                </li>
              </>
            ) : (
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  navigate("/loginsignup");
                  setShowDropdownlogin(false);
                }}
              >
                Login / Signup
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
          <Link to="/cart" className="relative">
            <img
              src="https://img.icons8.com/?size=100&id=16501&format=png&color=000000"
              className="w-6 hover:opacity-80"
              alt="Cart"
            />
            <span className="absolute -right-2 -bottom-2 w-4 h-4 bg-black text-white text-xs flex items-center justify-center rounded-full">
              {getCartCount()}
            </span>
          </Link>
          <Link to="/whichlist" className="relative">
            <img
              src="https://img.icons8.com/?size=100&id=16076&format=png&color=000000"
              alt="Wishlist"
              className="h-6 w-6 hover:opacity-75"
            />
            {getWishlistCount() > 0 && (
              <span className="absolute -right-2 -bottom-2 w-5 h-5 bg-red-600 text-white text-xs flex items-center justify-center rounded-full">
                {getWishlistCount()}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <img
              src="https://img.icons8.com/?size=100&id=Mw0fxlGLXJlb&format=png&color=000000"
              alt="Menu"
              className="h-6 w-6"
            />
          </button>
        </div>
      </div>



      {/* Overlay (optional) */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0  bg-opacity-40 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sliding Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#FEF0E1] z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex justify-end p-4 border-b-1 border-gray-600 ">
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <img
              src="https://img.icons8.com/?size=100&id=95867&format=png&color=000000"
              alt="Close"
              className="h-6 w-6"
            />
          </button>
        </div>

        <div className="flex flex-col px-6 space-y-4 pt-5">
          <NavLink to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-black border-b-2 border-gray-200 pb-2">
            Shop All
          </NavLink>
          <NavLink to="/bestseller" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-black border-b-2 border-gray-200 pb-2">
            Best Sellers
          </NavLink>
          <NavLink to="/gift" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-black  border-b-2 border-gray-200 pb-2 ">
            Gift & Combo
          </NavLink>
          <NavLink to="/blogs" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-black  border-b-2 border-gray-200 pb-2">
            Blogs
          </NavLink>
          <NavLink to="/contact-us" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-black  border-b-2 border-gray-200 pb-2">
            Contact Us
          </NavLink>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="block w-full text-left hover:text-black  border-b-2 border-gray-200 pb-2 transition"
            >
              Shop By
            </button>

            {showDropdown && (
              <div className="mt-2 space-y-2">
                {Object.entries(groupedCategories).map(
                  ([mainCategory, subCategories]) => (
                    <div key={mainCategory}>
                      <p
                        className="pl-2 py-1 font-semibold cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          handleCategoryClick(mainCategory);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        {mainCategory}
                      </p>
                      {subCategories.map((subCategory, index) => (
                        <p
                          key={index}
                          className="pl-6 py-1 text-sm text-gray-500 cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            handleCategoryClick(mainCategory, subCategory);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          {subCategory}
                        </p>
                      ))}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;