import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const BestSeller = () => {
  const { products, addToCart } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([])

  useEffect(() => {
    const bestSellers = products.filter((product) => product.bestseller)
    setBestSeller(bestSellers.slice(0, 5))
  }, [products])


  const [selectedSizes, setSelectedSizes] = useState({});


  const handleSizeChange = (productId, sizeObj) => {
    setSelectedSizes((prevSizes) => ({
      ...prevSizes,
      [productId]: sizeObj,
    }));
  };


  const handleAddToCart = (product) => {
    const selectedSize = selectedSizes[product._id] || product.sizes[0];
    addToCart(product, selectedSize);
  };

  return (

    <div className="w-full bg-[#FEF0E1] mx-auto sm:px-16 px-6">
      <img src="" alt="" />
      <div className="space-y-3  max-w-7xl mx-auto">
        <h2 className="sm:text-5xl text-3xl font-bold text-gray-800 text-center mb-6">
          Best Sellers
        </h2>
        <div className="text-center">
          <p className="text-gray-800 text-sm">Our Most-Loved Essentials—Tried, Tested, and Trusted!</p>
          <p className="text-gray-800 text-sm">that our customers can't live without.</p>
        </div>
      </div>

      {/* Swiper for Best Sellers */}
      <div className="relative max-w-7xl mt-8 mx-auto">
        <Swiper
          modules={[Navigation]}
          slidesPerView={2}
          spaceBetween={10}
          navigation={true}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 4 },
          }}
          className="pb-10"
        >
          {bestSeller.map((product) => (
            <SwiperSlide key={product._id}>
              <div className="relative bg-white  rounded-lg ">

                {/* Product Image */}
                <div className="relative overflow-hidden shadow-sm hover:shadow-lg ">
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}${product.image[0]?.url}`}
                      alt={product.name}
                      className="w-full rounded-lg  cursor-pointer relative  object-cover shadow-md   !overflow-hidden hover:scale-105 transition-all duration-300"
                    />
                    {/* Display Offer for the Selected Size */}
                    {selectedSizes[product._id]?.offer ||
                      product.sizes[0].offer ? (
                      <span className="absolute top-2 left-2 bg-red-500 text-white sm:text-sm text-[8px] font-bold px-3 py-1 rounded-full">
                        {selectedSizes[product._id]?.offer ||
                          product.sizes[0].offer}
                        % OFF
                      </span>
                    ) : null}
                  </Link>
                </div>

                {/* Product Details */}
                <div className="p-3 flex flex-col items-center justify-center">
                  {/* Star Ratings */}
                  {/* <div className="flex flex-row space-y-1 items-center gap-1.5">
                    {Array(4)
                      .fill("")
                      .map((_, i) => (
                        <img
                          key={i}
                          className="w-5"
                          src="https://img.icons8.com/?size=100&id=8ggStxqyboK5&format=png&color=000000"
                          alt=""
                        />
                      ))}
                    <img
                      className="w-5"
                      src="https://img.icons8.com/?size=100&id=tKTHzO8F7kZi&format=png&color=000000"
                      alt=""
                    />
                  </div> */}

                  {/* Product Name */}
                  <h3 className="text-xl font-semibold text-gray-900 text-center truncate max-w-full">
                    {product.name}
                  </h3>

                  {/* Short Description */}
                  <p className="text-gray-600 text-sm">{product.shortDescription}</p>

                  {/* Size Selection */}
                  <div className="flex items-center justify-center gap-2 mt-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size.size}
                        className={`border cursor-pointer rounded-md px-3 py-1 text-sm ${selectedSizes[product._id]?.size === size.size
                          ? "bg-black text-white"
                          : "bg-white text-black"
                          }`}
                        onClick={() => handleSizeChange(product._id, size)}
                      >
                        {size.size}
                      </button>
                    ))}
                  </div>

                  {/* Prices for Selected Size */}
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="text-lg font-bold text-red-600">
                      ₹
                      {selectedSizes[product._id]?.discountedprice ||
                        product.sizes[0].discountedprice}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ₹
                      {selectedSizes[product._id]?.actualprice ||
                        product.sizes[0].actualprice}
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <button

                    onClick={() => {
                      // const selectedSize = product.sizes[0];
                      const selectedSize = product.sizes[0];
                      if (!selectedSize) {
                        toast.error("Please select a size before adding to cart.");
                        return;
                      }
                      handleAddToCart(product, selectedSize)
                      // toast.success(`${product.name} added to cart!`);

                    }}
                    className="mt-2 w-full   bg-[#8f6943] hover:bg-[#a78767] text-white py-2 cursor-pointer rounded-md font-medium transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Shop All Button */}
      <div className="flex items-center justify-center pt-5">
        <Link to="/shop">
          <button className="px-12 py-2 font-semibold text-white cursor-pointer bg-[#8f6943] hover:bg-[#a78767] rounded-xl">
            SHOP ALL
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BestSeller;
