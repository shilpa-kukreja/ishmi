import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Newcollection = () => {
  const { products, addToCart } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});

  // Get the last 6 products and reverse them
  useEffect(() => {
    setLatestProducts(products.slice(-6).reverse());
  }, [products]);

  // Handle Size Change
  const handleSizeChange = (productId, sizeObj) => {
    setSelectedSizes((prevSizes) => ({
      ...prevSizes,
      [productId]: sizeObj,
    }));
  };

  // Handle Add to Cart Function
  const handleAddToCart = (product) => {
    const selectedSize = selectedSizes[product._id] || product.sizes[0]; // Default size is the first size
    addToCart(product, selectedSize);
  };

  return (
    <div className=" bg-[#FEF0E1] sm:px-16 px-6 mx-auto p-6">
      {/* Section Heading */}
      <div className="space-y-3 text-center  max-w-7xl mx-auto">
        <h2 className="sm:text-3xl text-2xl  font-semibold text-gray-800 mb-4">
          Explore fresh formulations designed to nourish your skin, hair, and health.
        </h2>
        <p className="text-gray-600 sm:text-lg text-base">
          Embrace Holistic Wellness
          Nurture Your Skin, Hair & Health with Ishmi Beauty Food
        </p>
      </div>

      {/* Swiper Section */}
      <div className="relative max-w-7xl mt-8 mx-auto">
        <Swiper
          modules={[Navigation]}
          slidesPerView={2}
          spaceBetween={10}
          navigation={true}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="pb-10"
        >
          {latestProducts.map((product) => (
            <SwiperSlide key={product._id}>
              <div className="relative bg-white  rounded-lg ">
                {/* Product Image */}
                <div className="relative overflow-hidden shadow-sm hover:shadow-lg">
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}${product.image[0]?.url}`}
                      alt={product.name}
                      className="w-full rounded-lg  cursor-pointer relative  object-cover shadow-md   !overflow-hidden hover:scale-105 transition-all duration-300"
                    />
                    {/* Offer Badge */}
                    {product.sizes[0].offer && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white sm:text-sm text-[8px] font-bold px-3 py-1 rounded-full">
                        {product.sizes[0].offer}% OFF
                      </span>
                    )}
                  </Link>
                </div>

                {/* Star Ratings */}
                {/* <div className="flex flex-row space-y-1 items-center pt-3 justify-center gap-1.5">
                  {Array(4)
                    .fill("")
                    .map((_, i) => (
                      <img
                        key={i}
                        className="w-5 "
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

                {/* Product Details */}
                <div className="p-3 pt-2 flex flex-col items-center justify-center">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {product.shortDescription}
                  </p>

                  {/* Size Selector */}
                  <div className="flex items-center justify-center gap-2 mt-2">
                    {product.sizes.map((size, index) => (
                      <button
                        key={index}
                        className={`px-2 py-1 border cursor-pointer rounded text-sm ${selectedSizes[product._id]?.size === size.size
                            ? "bg-black text-white"
                            : "bg-white text-black"
                          }`}
                        onClick={() => handleSizeChange(product._id, size)}
                      >
                        {size.size}
                      </button>
                    ))}
                  </div>

                  {/* Pricing */}
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

                      const selectedSize = product.sizes[0];
                      // console.log("Selected Size:", product.sizes[0]);
                      // toast.success(`${product.name} added to cart!`);
                      addToCart(product, selectedSize);



                    }}
                    className="mt-2 w-full cursor-pointer bg-[#8f6943] hover:bg-[#a78767] text-white py-2 rounded-md font-medium transition"
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
          <button className="px-12 py-2 font-semibold cursor-pointer bg-[#8f6943] hover:bg-[#a78767] text-white rounded-xl">
            SHOP ALL
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Newcollection;
