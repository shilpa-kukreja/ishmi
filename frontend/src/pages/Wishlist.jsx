import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { HeartOff, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const Wishlist = () => {
  const { 
    currency, 
    wishlist = [], 
    removeFromWishlist, 
    addToCart,
    products,
    combos
  } = useContext(ShopContext);
  
  const [selectedSizes, setSelectedSizes] = useState({});

  const handleSizeSelection = (productId, sizeObj) => {
    setSelectedSizes((prevSizes) => ({
      ...prevSizes,
      [productId]: sizeObj,
    }));
  };

  const handleAddToCart = (item) => {
    if (item.type === "combo") {
      // Handle combos (no size selection needed)
      addToCart(item, "combo");
      removeFromWishlist(item._id);
      // toast.success("Combo added to cart successfully");
    } else {
      // Handle products with sizes
     const selectedSize = item.sizes[0];
      if (!selectedSize) {
        toast.error("Please select a size before adding to cart.");
        return;
      }
      addToCart(item, selectedSize);
      removeFromWishlist(item._id);
      // toast.success("Product added to cart successfully");
    }
  };


const wishlistItems = wishlist;

  return (
    <div className="min-h-screen bg-gray-50 py-5 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10 text-center">
          Your Wishlist ❤️
        </h1>

        {wishlistItems.length === 0 ? (
          <div className="text-center mt-20">
            <HeartOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium mb-6">
              Your wishlist is currently empty. Start adding your favorite items!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition"
            >
              <ShoppingCart className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Header - hidden on mobile */}
            <div className="hidden sm:grid grid-cols-6 bg-gray-100 text-gray-700 font-semibold py-3 px-6 border-b text-sm">
              <span className="col-span-2">Item</span>
              <span>Price</span>
              <span>Size</span>
              <span>Action</span>
              <span>Remove</span>
            </div>

            <div className="divide-y divide-gray-200">
              {wishlistItems.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:grid sm:grid-cols-6 items-start sm:items-center gap-4 sm:gap-0 py-4 px-4 sm:px-6 hover:bg-gray-50 transition"
                >
                  {/* Item Image & Name */}
                  <div className="flex items-center gap-4 col-span-2 w-full sm:w-auto">
                    <Link to={`/${item.type === "combo" ? "combos" : "product"}/${item._id}`}>
                      <img
                        src={
                          item.type === "combo" 
                            ? `${import.meta.env.VITE_BACKEND_URL}/uploads/thumbImg/${item.thumbImg}`
                            : `${import.meta.env.VITE_BACKEND_URL}${item.image?.[0]?.url || "/placeholder.jpg"}`
                        }
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg shadow-sm"
                        onError={(e) => {
                          e.target.src = "/placeholder.jpg";
                        }}
                      />
                    </Link>
                    <div>
                      <span className="text-gray-800 font-medium text-sm sm:text-base">
                        {item.name}
                      </span>
                      {item.type === "combo" && (
                        <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                          COMBO
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-gray-700 font-medium text-sm sm:text-base">
                    {currency}{" "}
                    {item.type === "combo"
                      ? item.discountedprice
                      : selectedSizes[item._id]?.discountedprice || item.sizes?.[0]?.discountedprice}
                  </div>

                  {/* Size Dropdown (only for products) */}
                  <div className="w-full sm:w-auto">
                    {item.type === "product" ? (
                      <select
                        className="border border-gray-300 rounded-md p-2 text-gray-700 w-full sm:w-auto"
                        value={selectedSizes[item._id]?.size || ""}
                        onChange={(e) =>
                          handleSizeSelection(
                            item._id,
                            item.sizes.find(
                              (size) => size.size === e.target.value
                            )
                          )
                        }
                      >
                        <option value="">Select Size</option>
                        {item.sizes?.map((size) => (
                          <option key={size.size} value={size.size}>
                            {size.size}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-black text-white py-[6px] px-4 rounded-md font-medium transition hover:bg-gray-900 w-full sm:w-auto"
                  >
                    Add to Cart
                  </button>

                  {/* Remove from Wishlist */}
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition flex items-center justify-center w-full sm:w-auto"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;