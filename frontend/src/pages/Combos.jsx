import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Combos = () => {
  const { combos, addToCart } = useContext(ShopContext);

  const handleAddToCart = (combo) => {
      try {
        addToCart(combo, "combo");
        // toast.success(`${combo.name} added to cart!`);
      } catch (error) {
        toast.error("Failed to add combo to cart");
        console.error(error);
      }
    };

  return (
    <div className="w-full mx-auto bg-[#FEF0E1]">
      <img
        className="w-full h-full object-cover shadow-lg"
        src={assets.TOPBANNER5}
        alt="Banner"
      />

      <div className="grid grid-cols-2 pt-10 sm:grid-cols-2 pb-10 px-5 sm:px-10 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {combos.length > 0 ? (
          combos.map((combo) => (
            <div
              key={combo._id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <Link
                to={`/combos/${combo._id}`}
                className="relative overflow-hidden shadow-sm hover:shadow-lg"
              >
                <img
                  src={
                    combo.thumbImg
                      ? `https://ishmiherbal.com/uploads/thumbImg/${combo.thumbImg}`
                      : "/placeholder.jpg"
                  }
                  alt={combo.name}
                  className="w-full rounded-lg cursor-pointer object-cover shadow-md hover:scale-105 transition-all duration-300"
                />
              </Link>

              <div className="p-3 flex flex-col items-center justify-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {combo.name}
                </h3>
                <div className="mt-1 flex items-center space-x-2">
                  <span className="text-lg font-bold text-red-600">
                    ₹{combo.discountedprice}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{combo.actualprice}
                  </span>
                </div>
                <button
                  onClick={() => handleAddToCart(combo)}
                  className="mt-2 w-full bg-[#8f6943] hover:bg-[#a78767] text-white py-2 cursor-pointer rounded-md font-medium transition"
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

export default Combos;
