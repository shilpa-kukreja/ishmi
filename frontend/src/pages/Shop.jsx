import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Shop = () => {
  const { products, addToCart } = useContext(ShopContext);
  const [category, setCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");





  const filteredProducts =
    category === "all"
      ? products
      : products.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );

  const sortedProducts = [...filteredProducts].sort((a, b) => {

    if (sortOrder === "lowToHigh") return a.discountedprice - b.discountedprice;
    if (sortOrder === "highToLow") return b.discountedprice - a.discountedprice;
    return 0;
  });

  console.log(sortedProducts);

  return (
    <div className="w-full mx-auto bg-[#FEF0E1] ">
      <img
        className="w-full h-full object-cover  shadow-lg"
        src={assets.TOPBANNER5}
        alt=""
      />


      <div className="grid grid-cols-2 pt-10 sm:grid-cols-2 pb-10 px-5 sm:px-10 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-md rounded-lg overflow-hidden "
            >
              <Link to={`/product/${product._id}`} className="relative overflow-hidden shadow-sm hover:shadow-lg">
                <img
                  src={
                    
                    product.image[0]?.url
                      ? `https://ishmiherbal.com${product.image[0].url}`
                      : '/placeholder.jpg' // fallback image
                  }
                  alt={product.image[0]?.originalname || 'Product Image'}
                  className="w-full rounded-lg  cursor-pointer relative  object-cover shadow-md   !overflow-hidden hover:scale-105 transition-all duration-300"
                />
                {product.offer && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {product.offer}% OFF
                  </span>
                )}
              </Link>

              <div className="p-3 flex flex-col items-center justify-center">
                <div className="flex flex-row space-y-1 items-center gap-1.5">
                  {/* {Array(4)
                    .fill("")
                    .map((_, i) => (
                      <img
                        key={i}
                        className="w-5 "
                        src="https://img.icons8.com/?size=100&id=8ggStxqyboK5&format=png&color=000000"
                        alt=""
                      />
                    ))} */}
                  {/* <img
                    className="w-5"
                    src="https://img.icons8.com/?size=100&id=tKTHzO8F7kZi&format=png&color=000000"
                    alt=""
                  /> */}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {product.name}
                </h3>
                <div className="mt-1 flex items-center space-x-2">
                  <span className="text-lg font-bold text-red-600">
                    ₹{product.sizes[0].discountedprice}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.sizes[0].actualprice}
                  </span>
                </div>
                <button
                  onClick={() => {
                    const selectedSize = product.sizes[0];
                    addToCart(product, selectedSize);
                    // toast.success(`${product.name} added to cart!`);

                  }}
                  className="mt-2 w-full   bg-[#8f6943] hover:bg-[#a78767] text-white py-2 cursor-pointer rounded-md font-medium transition"
                >
                  Add to Cart
                </button>




              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No products found
          </p>
        )}
      </div>
    </div>
  );
};

export default Shop;