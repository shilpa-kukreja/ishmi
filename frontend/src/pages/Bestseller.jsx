import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";

const Bestseller = () => {
  const { products, addToCart } = useContext(ShopContext);
  const [bestSeller,setBestSeller]=useState([])
   
   useEffect(()=>{
    if (products.length > 0) {
   const bestSellers = products.filter((product) => product.bestseller)
   setBestSeller(bestSellers.slice(0,10)) 
    }
 },[products])

  return (
    <div className="w-full  mx-auto bg-[#FEF0E1] ">
      <img className="w-full h-full" src={assets.TOPBANNER7} alt="" />
      {/* Title Section */}
      <div className="text-center pt-10 mb-10">
        <h2 className="text-4xl font-extrabold text-gray-800">Best Sellers</h2>
        <p className="text-gray-600 mt-2 text-lg">
          Explore our Bestsellers - Tried and loved by our customers!
        </p>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-2 p-10 pt-3   px-5 sm:px-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 space-y-4 gap-4">
        {bestSeller.map((product) => (
          <div
            key={product._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden "
          >
            {/* Image Section */}
            <div className=" relative overflow-hidden shadow-sm hover:shadow-lg">
              <Link to={`/product/${product._id}`}>
                <img
                   src={
                    
                    product.image[0]?.url
                      ? `${import.meta.env.VITE_BACKEND_URL}${product.image[0].url}`
                      : '/placeholder.jpg' // fallback image
                  }
                  alt={product.image[0]?.originalname || 'Product Image'}
                  className="w-full rounded-lg  cursor-pointer relative  object-cover shadow-md   !overflow-hidden hover:scale-105 transition-all duration-300"
                />
                {product.offer && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {product.offer}% OFF
                  </span>
                )}
              </Link>
            </div>

            {/* Content Section */}
            <div className="p-3 flex flex-col items-center">
              {/* Ratings */}
              {/* <div className="flex gap-1 mb-2">
                {Array(4)
                  .fill("")
                  .map((_, i) => (
                    <img
                      key={i}
                      className="w-5"
                      src="https://img.icons8.com/?size=100&id=8ggStxqyboK5&format=png&color=000000"
                      alt="star"
                    />
                  ))}
                <img
                  className="w-5"
                  src="https://img.icons8.com/?size=100&id=tKTHzO8F7kZi&format=png&color=000000"
                  alt="half-star"
                />
              </div> */}

              {/* Product Name & Description */}
              <h3 className="text-xl font-semibold text-gray-900 text-center">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm text-center ">
                {product.shortDescription}
              </p>

              {/* Pricing */}
              <div className="mt-1 flex items-center space-x-2">
                <span className="text-lg font-bold text-red-600">
                  ₹{product.sizes[0].discountedprice}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.sizes[0].actualprice}
                </span>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => {
                  const selectedSize = product.sizes[0];
                  // console.log("Selected Size:", product.sizes[0]);
  //  toast.success(`${product.name} added to cart!`);
                  addToCart(product, selectedSize);




                }}
                className="mt-2 w-full   bg-[#8f6943] hover:bg-[#a78767] text-white py-2 cursor-pointer rounded-md font-medium transition"
                  >
                    Add to Cart
                  </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bestseller;
