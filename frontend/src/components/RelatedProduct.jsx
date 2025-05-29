import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const RelatedProducts = ({ category }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const filteredProducts = products
        .filter((item) => item.category === category)
        .slice(0, 5);
      setRelated(filteredProducts);
    }
  }, [products, category]);

  return (
    <div className="my-16">

      <div className="text-center">
        <h2 className="sm:text-4xl text-3xl sigmar-regular font-bold text-gray-800">Related Products</h2>
        <p className="text-gray-500 mt-1 text-base">Explore similar products you might like.</p>
      </div>


      <motion.div
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3  gap-4 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {related.length > 0 ? (
          related.map((item) => (
            <motion.div
              key={item._id}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 150 }}
              className="relative bg-white shadow-lg rounded-xl overflow-hidden transition duration-300 "
            >
              <Link to={`/product/${item._id}`} className="block">
                <div className="relative w-full overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${item.image[0]?.url}`}
                    alt={item.name}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="w-full rounded-lg  cursor-pointer relative  object-cover shadow-md   !overflow-hidden hover:scale-105 transition-all duration-300"
                  />

                  {item.sizes[0].offer && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {item.sizes[0].offer}% OFF
                    </span>
                  )}
                </div>
                <div className="p-3 flex flex-col items-center justify-center space-y-2">
                  {/* <div className="flex flex-row space-y-1 items-center gap-1.5">
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
                  <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="text-lg font-bold text-red-600">₹{item.sizes[0].discountedprice}</span>
                    <span className="text-sm text-gray-400 line-through">₹{item.sizes[0].actualprice}</span>
                  </div>
                  <button className="mt-2 w-full   bg-[#8f6943] hover:bg-[#a78767] text-white py-2 cursor-pointer rounded-md font-medium transition">
                    Add to Cart 
                  </button>
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 mt-6">No related products found.</p>
        )}
      </motion.div>
    </div>
  );
};

export default RelatedProducts;
