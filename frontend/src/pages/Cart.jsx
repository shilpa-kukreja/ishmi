import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal ";

const Cart = () => {
  const { products, combos, cartItems, currency, updateQuantity, navigate, token, setLoginnavigate } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    // console.log("Cart items changed:", cartItems);

    const tempData = [];

    // Process products
    for (const productId in cartItems) {
      const item = cartItems[productId];

      // Check if it's a product with sizes
      if (item.sizes) {
        for (const sizeKey in item.sizes) {
          const sizeDetails = item.sizes[sizeKey];
          if (sizeDetails?.quantity > 0) {
            const productData = products.find(p => p._id === productId);
            if (productData) {
              tempData.push({
                _id: productId,
                type: "product",
                size: sizeKey,
                quantity: sizeDetails.quantity,
                discountedprice: sizeDetails.discountedprice,
                actualprice: sizeDetails.actualprice,
                name: productData.name,
                image: productData.image[0]?.url,
                productData
              });
            }
          }
        }
      }
      // Check if it's a combo
      else if (item.type === "combo" && item.quantity > 0) {
        const comboData = combos.find(c => c._id === productId);
        if (comboData) {
          tempData.push({
            _id: productId,
            type: "combo",
            quantity: item.quantity,
            discountedprice: item.discountedprice,
            actualprice: item.actualprice,
            name: comboData.name,
            image: comboData.thumbImg,
            comboData
          });
        }
      }
    }

    setCartData(tempData);
  }, [cartItems, products, combos]);

  return (
    <div className="border-t border-gray-200 pt-12 py-8 px-6 sm:px-12 lg:px-20 max-w-6xl mx-auto">
      {/* Title Section */}
      <h2 className="sm:text-4xl text-3xl font-bold text-gray-900 text-center mb-12">
        Your Shopping Cart
      </h2>

      {/* Cart Items Section */}
      {cartData.length > 0 ? (
        <div className="space-y-8">
          {cartData.map((item, index) => (
            <div
              key={index}
              className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-center justify-between bg-white"
            >
              {/* Product/Combo Image and Details */}
              <div className="flex items-center gap-6 flex-1">
                <img
                  className="w-24 h-24 object-cover rounded-lg border"
                  src={`${import.meta.env.VITE_BACKEND_URL}${item.type === "product" ? item.image : `/uploads/thumbImg/${item.image}`
                    }`}
                  alt={item.name}
                />

                <div>
                  <p className="text-xl font-semibold text-gray-900">
                    {item.name}
                    {item.type === "combo" && (
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        COMBO
                      </span>
                    )}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-gray-700">
                    <p className="text-xl font-bold text-red-500">
                      {currency}
                      {item.discountedprice}
                    </p>
                    <p className="text-sm text-gray-500 line-through">
                      {currency}
                      {item.actualprice}
                    </p>
                    {item.type === "product" && item.size && (
                      <p className="px-3 py-1 border bg-gray-100 text-sm rounded-lg">
                        Size: {item.size}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity & Remove */}
              <div className="flex items-center gap-4 mt-4 sm:mt-0">
                <input
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 1) {
                      if (item.type === "product") {
                        updateQuantity(item._id, item.size, value);
                      } else {
                        // For combos
                        updateQuantity(item._id, null, value, "combo");
                      }
                    }
                  }}
                  className="border w-20 px-3 py-2 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-black"
                  type="number"
                  min={1}
                  defaultValue={item.quantity}
                />

                <button
                  onClick={() => {
                    if (item.type === "product") {
                      updateQuantity(item._id, item.size, 0);
                    } else {
                      // For combos
                      updateQuantity(item._id, null, 0, "combo");
                    }
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <img
                    className="w-6 h-6 cursor-pointer hover:opacity-75 transition-opacity"
                    src={assets.p10}
                    alt="Delete"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg py-20">
          Your cart is empty. <br />
          <a href="/shop" className="text-blue-600 hover:underline">
            Continue Shopping
          </a>
        </div>
      )}

      {cartData.length > 0 && (
        <div className="flex justify-end mt-10 sm:mt-16">
          <div className="w-full sm:w-[450px] bg-gray-50 p-8 rounded-lg shadow-md">
            <CartTotal />


            <button
              onClick={() => {


                if (!token) {
                  setLoginnavigate('/place-order');
                  navigate('/loginsignup', {
                    state: {
                      from: 'cart',
                      intendedPath: '/place-order'
                    },
                    replace: true
                  });
                } else {
                  navigate('/place-order');
                }
              }}
              className="w-full bg-black text-white sm:text-lg text-base font-medium px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors mt-6"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;