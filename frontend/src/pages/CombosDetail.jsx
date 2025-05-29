
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { motion } from "framer-motion";
import RelatedProducts from "../components/RelatedProduct";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal ";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";


const CombosDetail = () => {
    const { combosId } = useParams();
    const [menuOpen, setMenuOpen] = useState(false);

    const [combosData, setCombosData] = useState(null);
    const {
        combos,
        addToCart,
        currency,
        addToWishlist,
        updateQuantity,
        cartItems,
        navigate,
        products,
    } = useContext(ShopContext);
    const [image, setImage] = useState("");
    const [fixedimage, setFixedImage] = useState("");
    const [size, setSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("description");

    const handleSizeSelection = (size) => {
        const foundSize = combosData.sizes.find((item) => item.size === size);
        setSize(foundSize);
    };

    const handleUpdateQuantity = (action) => {
        let newQuantity = action === "increase" ? quantity + 1 : quantity - 1;
        if (newQuantity < 1) return; // Prevent going below 1

        setQuantity(newQuantity);
        updateQuantity(combosData._id, size.size, newQuantity);
    };

    const [cartData, setCartData] = useState([]);

    useEffect(() => {
        const cartItemData = cartItems[combosData?._id]?.sizes?.[size?.size];
        if (cartItemData) {
            setQuantity(cartItemData.quantity);
        }
    }, [cartItems, combosData, size]);

   useEffect(() => {
  console.log("Cart items changed:", cartItems);
  
  const tempData = [];

  for (const itemId in cartItems) {
    const item = cartItems[itemId];
    
    // Handle products with sizes
    if (item.sizes) {
      for (const sizeKey in item.sizes) {
        const sizeDetails = item.sizes[sizeKey];
        
        if (sizeDetails?.quantity > 0) {
          tempData.push({
            _id: itemId,
            type: "product",
            size: sizeKey,
            quantity: sizeDetails.quantity,
            discountedprice: sizeDetails.discountedprice,
            actualprice: sizeDetails.actualprice,
            name: item.name,
            image: item.image
          });
        }
      }
    }
    // Handle combos (no sizes)
    else if (item.type === "combo" && item.quantity > 0) {
      tempData.push({
        _id: itemId,
        type: "combo",
        quantity: item.quantity,
        discountedprice: item.discountedprice,
        actualprice: item.actualprice,
        name: item.name,
        image: item.image
      });
    }
  }

  setCartData(tempData);
}, [cartItems]);

    useEffect(() => {
        if (combos.length > 0) {
            const foundProduct = combos.find(
                (combo) => combo._id === combosId
            );
            setCombosData(foundProduct);
            console.log(combos);
            console.log("Found Product: ", foundProduct);
        }
    }, [combosId, combos]);

    useEffect(() => {
        const combo = combos.find((item) => item._id === combosId);
        if (combo) {
            setCombosData(combo);
            console.log("Combo Data: ", combo);
            setImage(`${import.meta.env.VITE_BACKEND_URL}/uploads/thumbImg/${combo.thumbImg}`);
            setFixedImage(`${import.meta.env.VITE_BACKEND_URL}/uploads/thumbImg/${combo.thumbImg}`);
        }
    }, [combosId, combos]);

    if (!combosData) {
        return (
            <div className="flex justify-center items-center h-screen text-xl">
                Loading...
            </div>
        );
    }



    return (
        <div className="sm:pt-20 pt-5  max-w-6xl mx-auto px-4 md:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-start">
                <motion.div
                    className="flex flex-col gap-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="w-full overflow-hidden sm:rounded-lg rounded-none shadow-lg bg-gray-100">
                        <Zoom>
                            <img
                                src={`${image}`} // Ensure full path is used
                                alt={combosData.name}
                                className="sm:w-[550px] sm:h-[550px] w-[450px] h-[450px] object-cover rounded-none sm:rounded-lg"
                            />
                        </Zoom>
                    </div>

                    <div className="flex gap-2  justify-center">

                        <img

                            src={`${fixedimage}`} // use item.url

                            className={`w-16 h-16 object-cover rounded-lg cursor-pointer border ${image === fixedimage
                                ? "border-black opacity-100"
                                : "border-gray-300 opacity-50 hover:opacity-80"
                                }`}
                            onClick={() => setImage(`${fixedimage}`)}
                        />

                        {combosData.galleryImg.map((item, index) => (

                            <img
                                key={index}
                                src={`${import.meta.env.VITE_BACKEND_URL}/uploads/galleryImg/${item}`} // use item.url
                                alt={item.name || `Image ${index + 1}`}
                                className={`w-16 h-16 object-cover rounded-lg cursor-pointer border ${image === item.galleryImg
                                    ? "border-black opacity-100"
                                    : "border-gray-300 opacity-50 hover:opacity-80"
                                    }`}
                                onClick={() => setImage(`${import.meta.env.VITE_BACKEND_URL}/uploads/galleryImg/${item}`)}
                            />
                        ))}
                    </div>
                </motion.div>

                <div className="pt-10 px-4">
                    <h1 className="text-4xl philosopher-bold  font-bold text-gray-900 mb-3">
                        {combosData.name}
                    </h1>
                    <div className="flex items-center gap-1 text-yellow-500 text-lg">
                        {[...Array(5)].map((_, index) => (
                            <span key={index}>★</span>
                        ))}
                        <p className="text-gray-500 ml-2">(5 reviews)</p>
                    </div>

                    {/* <div className="flex items-center gap-4 my-4">
            <p className="text-3xl font-semibold text-gray-900">
              {currency}
              {size ? size.actualprice : combosData.sizes[0].discountedprice}
            </p>
            <p className="text-xl text-gray-500 line-through">
              {currency}
              {size
                ? size.discountedprice
                : combosData.sizes[0].actualprice}
            </p>
            <p className="top-2 left-2 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
              {size ? size.offer : combosData.sizes[0].offer}% OFF
            </p>
          </div> */}

                    <div className="text-gray-600 text-lg"   dangerouslySetInnerHTML={{
                    __html:combosData.shortDescription}}>
                    
                    </div>

                    <div className="text-gray-600 w-[350px]  text-lg">
                        {combosData.products && combosData.products.length > 0 ? (
                            <div className="space-y-2">
                                <h3 className="font-medium">Products in this combo:</h3>
                                <div className="grid grid-cols-2   gap-4">
                                    {combosData.products.map((productId) => {
                                        const product = products.find(p => p._id === productId);
                                        if (!product) return null;

                                        return (
                                            <div key={productId} className="flex shadow-md  items-center gap-3 p-1 border rounded-lg">
                                                <Link to={`/product/${product._id}`} className="flex items-center gap-2">
                                                    <img
                                                        src={`${import.meta.env.VITE_BACKEND_URL}${product.image?.[0]?.url || '/placeholder.jpg'}`}
                                                        alt={product.name}
                                                        className="w-10 h-10 border border-black object-cover rounded-md"
                                                        onError={(e) => {
                                                            e.target.src = '/placeholder.jpg';
                                                        }}
                                                    />
                                                    <span className="text-sm text-gray-800">{product.name}</span>
                                                </Link>

                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <p>No products included in this combo</p>
                        )}
                    </div>
                    {/* 
          <div className="mt-6">
            <p className="text-lg font-medium">Select Size</p>
            <div className="flex gap-2 mt-2">
              {combosData.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSizeSelection(item.size)}
                  className={`border py-2 px-5 rounded-md transition-all ${size?.size === item.size
                    ? "bg-black text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                    }`}
                >
                  {item.size}
                </button>
              ))}
            </div>
          </div> */}

                    <div className="mt-6 ">
                        <p className="text-lg font-medium">Quantity</p>
                        <div className="flex items-center gap-2 mt-2">

                            <button
                                onClick={() => handleUpdateQuantity("decrease")}
                                className="border py-2 px-4 rounded-md bg-gray-100 hover:bg-gray-200"
                            >
                                -
                            </button>
                            <span className="text-lg">{quantity}</span>
                            <button
                                onClick={() => handleUpdateQuantity("increase")}
                                className="border py-2 px-4 rounded-md bg-gray-100 hover:bg-gray-200"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 w-[300px] flex gap-4">
                        <motion.button
                            onClick={() => {
                                addToCart(combosData, "combo");
                                setMenuOpen(true); // Add this line to open the cart menu
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full bg-black text-white py-2 text-lg font-medium rounded-lg hover:bg-gray-800 transition-all"
                        >
                            Add to Cart
                        </motion.button>

                        <div
                            className={`fixed top-0 right-0 h-full bg-white shadow-2xl transition-transform duration-300 transform ${menuOpen ? "translate-x-0" : "translate-x-full"
                                } w-full sm:w-[450px] md:w-[500px] lg:w-[550px] xl:w-[600px] z-50 border-l`}
                        >
                            <div className="flex flex-col h-full p-4 sm:p-6 text-gray-800">
                                {/* Header */}
                                <div className="flex justify-between items-center pb-4 border-b">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                        Shopping Cart
                                    </h2>
                                    <button
                                        onClick={() => setMenuOpen(false)}
                                        className="text-gray-500 hover:text-black transition-colors text-xl"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Items */}
                                <div className="flex-1 overflow-y-auto py-4 sm:py-6 space-y-6 sm:space-y-8">
                                    {cartData.length > 0 ? (
                                        cartData.map((item, index) => {
                                            // Find product or combo data
                                            const itemData = item.type === "combo"
                                                ? combos.find(c => c._id === item._id)
                                                : products.find(p => p._id === item._id);

                                            if (!itemData) return null;

                                            return (
                                                <div
                                                    key={`${item._id}-${item.size || index}`}
                                                    className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 border rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition-all"
                                                >
                                                    <img
                                                        className="w-24 h-24 object-cover rounded-md border"
                                                        src={
                                                            item.type === "combo"
                                                                ? `${import.meta.env.VITE_BACKEND_URL}/uploads/thumbImg/${itemData.thumbImg}`
                                                                : `${import.meta.env.VITE_BACKEND_URL}${itemData.image[0].url}`
                                                        }
                                                        alt={itemData.name}
                                                        onError={(e) => {
                                                            e.target.src = `${import.meta.env.VITE_BACKEND_URL}/placeholder.jpg`;
                                                        }}
                                                    />

                                                    <div className="flex flex-col gap-2 flex-1">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <p className="text-base sm:text-lg font-semibold text-gray-900">
                                                                {itemData.name}
                                                                {item.type === "combo" && (
                                                                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                                                                        COMBO
                                                                    </span>
                                                                )}
                                                            </p>
                                                            <button
                                                                onClick={() => updateQuantity(
                                                                    item._id,
                                                                    item.size,
                                                                    0,
                                                                    item.type
                                                                )}
                                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>

                                                        <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600">
                                                            <p className="text-base font-semibold text-red-500">
                                                                {currency}
                                                                {item.discountedprice}
                                                            </p>
                                                            {item.actualprice > item.discountedprice && (
                                                                <p className="text-sm line-through text-gray-400">
                                                                    {currency}
                                                                    {item.actualprice}
                                                                </p>
                                                            )}
                                                            {item.size && (
                                                                <span className="px-2 py-1 border rounded bg-gray-100 text-sm">
                                                                    Size: {item.size}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center gap-2 mt-2">
                                                            <span className="text-sm font-medium">Qty:</span>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => updateQuantity(
                                                                        item._id,
                                                                        item.size,
                                                                        item.quantity - 1,
                                                                        item.type
                                                                    )}
                                                                    className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                                                                    disabled={item.quantity <= 1}
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="w-8 text-center">{item.quantity}</span>
                                                                <button
                                                                    onClick={() => updateQuantity(
                                                                        item._id,
                                                                        item.size,
                                                                        item.quantity + 1,
                                                                        item.type
                                                                    )}
                                                                    className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center text-gray-500 text-base sm:text-lg py-16 sm:py-20">
                                            Your cart is empty. <br />
                                            <Link
                                                to="/"
                                                className="text-blue-600 hover:underline"
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                Continue Shopping
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* Checkout Section */}
                                {cartData.length > 0 && (
                                    <div className="p-4 sm:p-6 border-t bg-white shadow-md rounded-lg">
                                        <CartTotal />

                                        <button
                                            onClick={() => {
                                                navigate("/place-order");
                                                setMenuOpen(false);
                                            }}
                                            className="w-full bg-black text-white text-sm sm:text-lg font-semibold py-3 rounded-lg hover:bg-gray-900 transition-all mt-3"
                                        >
                                            Proceed to Checkout
                                        </button>

                                        <button
                                            onClick={() => {
                                                navigate("/cart");
                                                setMenuOpen(false);
                                            }}
                                            className="w-full bg-blue-600 text-white text-sm sm:text-lg font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all mt-3"
                                        >
                                            View Full Cart
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full bg-blue-600 text-white py-3 text-lg font-medium rounded-lg hover:bg-blue-700 transition-all"
                            onClick={() => {
                                // console.log("Selected Size:", size);
                                addToCart(combosData, "combo");

                                // console.log("Updated cartItems:", cartItems);
                                if (size == "") {
                                    setMenuOpen(true);
                                }
                            }

                            }
                        >
                            Buy Now
                        </motion.button>
                    </div>

                    <div className="mt-6 flex gap-4">
                        <button
                            onClick={() => {
                                if (combosData) {
                                    addToWishlist(combosData, "combo");
                                    console.log("Added to wishlist:", combosData);
                                } else {
                                    console.log("Product data is not available yet.");
                                }
                            }}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                        >
                            <span>❤️</span> Add to Wishlist
                        </button>
                        <button
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                            onClick={() => {
                                if (navigator.share) {
                                    navigator
                                        .share({
                                            title: "Check out this product!",
                                            text: "I found this amazing product, take a look:",
                                            url: window.location.href,
                                        })
                                        .then(() => console.log("Product shared successfully"))
                                        .catch((error) => console.log("Sharing failed:", error));
                                } else {
                                    // Fallback for unsupported browsers
                                    navigator.clipboard.writeText(window.location.href);
                                    alert("Link copied to clipboard!");
                                }
                            }}
                        >
                            <span>👍</span> Share this product
                        </button>

                    </div>

                    <ul className="mt-6 text-gray-600 text-sm space-y-2">
                        <li>✔ 100% Original Product</li>
                        <li>✔ Cash on delivery available</li>
                        <li>✔ 7-day easy return & exchange policy</li>
                    </ul>
                </div>
            </div>

            <div className="mt-16">
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab("description")}
                        className={`px-6 py-3 sm:text-lg text-base font-medium transition ${activeTab === "description"
                            ? "border-b-2 border-black text-black"
                            : "text-gray-500"
                            }`}
                    >
                        Description
                    </button>
                    <button
                        onClick={() => setActiveTab("additonalinfo")}
                        className={`px-6 py-3 sm:text-lg text-base font-medium transition ${activeTab === "additonalinfo"
                            ? "border-b-2 border-black text-black"
                            : "text-gray-500"
                            }`}
                    >
                        Additional Info
                    </button>

                    <button
                        onClick={() => setActiveTab("reviews")}
                        className={`px-6 py-3 sm:text-lg text-base font-medium transition ${activeTab === "reviews"
                            ? "border-b-2 border-black text-black"
                            : "text-gray-500"
                            }`}
                    >
                        Reviews (5)
                    </button>
                </div>

                <div className="p-6 text-gray-700 text-lg border border-gray-200 rounded-lg mt-4">
                    {activeTab === "description" ? (
                        <div>
                            <h2 className="text-xl font-semibold text-black mb-3">
                                Product Details
                            </h2>
                            <div className="description">
                                <div dangerouslySetInnerHTML={{ __html: combosData.description }} />
                            </div>


                            <ul className="list-disc pl-6 mt-3 space-y-2">
                                <li>High-quality material for durability</li>
                                <li>Designed for comfort and style</li>
                                <li>Available in multiple sizes</li>
                            </ul>
                        </div>
                    ) : activeTab === "additonalinfo" ? (
                        <div>
                            <h2 className="text-xl font-semibold text-black mb-3">
                                Product Details
                            </h2>
                            <div className="description">
                                <div dangerouslySetInnerHTML={{ __html: combosData.Shortdescription }} />
                            </div>
                            <ul className="list-disc pl-6 mt-3 space-y-2">
                                <li>High-quality material for durability</li>
                                <li>Designed for comfort and style</li>
                                <li>Available in multiple sizes</li>
                            </ul>
                        </div>
                    ) : (
                        <div>
              <h2 className="text-xl font-semibold text-black mb-3">
                Customer Reviews
              </h2>
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <p className="font-medium">⭐️⭐️⭐️⭐️⭐️ Priya</p>
                  <p> "I've been using Ishmi's products for a few weeks now, and my skin has never looked better! The natural ingredients really make a difference."</p>
                </div>
                <div className="border-b pb-3">
                  <p className="font-medium">⭐️⭐️⭐️⭐️ Amit</p>
                  <p> "The quality of the beauty foods is amazing. My hair feels so soft and healthy, and the best part is that it's all natural!"</p>
                </div>
                <div className="border-b pb-3">
                  <p className="font-medium">⭐️⭐️⭐️⭐️⭐️ Anita</p>
                  <p>"I've been looking for a natural solution to my skincare concerns, and I finally found it with Ishmi. Their products are a game-changer!"</p>
                </div>
                <div className="border-b pb-3">
                  <p className="font-medium">⭐️⭐️⭐️⭐️ Suresh </p>
                  <p>"I’ve tried many beauty food brands, but none compare to Ishmi. The results are visible in just a few days!"</p>
                </div>
                 <div >
                  <p className="font-medium">⭐️⭐️⭐️⭐️⭐️ Neha</p>
                  <p>"Ishmi Beauty Foods have become a staple in my daily routine. My skin feels nourished and glowing every day!"</p>
                </div>
              </div>
            </div>
                    )}
                </div>
            </div>
            {/* <RelatedProducts category={productData.category} /> */}
        </div>
    );
};

export default CombosDetail;