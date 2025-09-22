import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { motion } from "framer-motion";
import RelatedProducts from "../components/RelatedProduct";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal ";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

// ReviewsSection Component
const ReviewsSection = ({ productId, setReviewCount }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const { currency } = useContext(ShopContext);



  // In ReviewsSection component
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch((`http://localhost:5000/api/reviews/product/${productId}`));
        const data = await response.json();

        if (data.success) {
          setReviews(data.reviews);
          // Always set the review count, even if it's 0
          setReviewCount(data.reviews.length);

          // Calculate average rating
          if (data.reviews.length > 0) {
            const total = data.reviews.reduce((sum, review) => sum + review.rating, 0);
            setAverageRating(total / data.reviews.length);

            // Calculate rating distribution
            const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
            data.reviews.forEach(review => {
              if (review.rating >= 1 && review.rating <= 5) {
                distribution[Math.floor(review.rating)]++;
              }
            });
            setRatingDistribution(distribution);
          } else {
            // Reset values when there are no reviews
            setAverageRating(0);
            setRatingDistribution({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
          }
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const RatingStars = ({ rating, size = "w-5 h-5" }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`${size} ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const RatingBar = ({ stars, count, total }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;

    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-600 w-4">{stars}</span>
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-400"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="text-sm text-gray-500 w-12">{count} review{count !== 1 ? 's' : ''}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10极速加速器 h.01M16 10h.01M9 16H5a2 2 0 01-2-2极速加速器 V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-500">Be the first to review this product!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Rating Summary */}
          <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-gray-900 mb-2">{averageRating.toFixed(1)}</div>
              <RatingStars rating={averageRating} size="w-6 h-6" />
              <p className="text-sm text-gray-600 mt-2">Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
            </div>

            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((stars) => (
                <RatingBar
                  key={stars}
                  stars={stars}
                  count={ratingDistribution[stars]}
                  total={reviews.length}
                />
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <div className="md:col-span-2">
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-100 text-indigo-800 rounded-full w-10 h-10 flex items-center justify-center font-semibold">
                        {review.name ? review.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{review.name || 'Anonymous'}</h4>
                        {/* <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p> */}
                      </div>
                    </div>
                    <RatingStars rating={review.rating} />
                  </div>

                  <p className="text-gray-700 mb-4">{review.comment}</p>

                  {review.verified && (
                    <div className="flex items-center text-sm text-green-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                      </svg>
                      Verified Purchase
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Product = () => {
  const { productId } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [reviewCount, setReviewCount] = useState(0);
  const [productData, setProductData] = useState(null);
  const {
    products,
    combos,
    addToCart,
    currency,
    addToWishlist,
    updateQuantity,
    cartItems,
    navigate,
    token, setLoginnavigate
  } = useContext(ShopContext);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const handleSizeSelection = (size) => {
    const foundSize = productData.sizes.find((item) => item.size === size);
    setSize(foundSize);
  };

  const handleUpdateQuantity = (action) => {
    let newQuantity = action === "increase" ? quantity + 1 : quantity - 1;
    if (newQuantity < 1) return; // Prevent going below 1

    setQuantity(newQuantity);
    updateQuantity(productData._id, size.size, newQuantity);
  };

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const cartItemData = cartItems[productData?._id]?.sizes?.[size?.size];
    if (cartItemData) {
      setQuantity(cartItemData.quantity);
    }
  }, [cartItems, productData, size]);

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
    if (products.length > 0) {
      const foundProduct = products.find(
        (product) => product._id === productId
      );
      setProductData(foundProduct);
      console.log(products);
      console.log("Found Product: ", foundProduct);
    }
  }, [products, productId]);

  useEffect(() => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0].url);
    }
  }, [productId, products]);

  if (!productData) {
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
                src={`${import.meta.env.VITE_BACKEND_URL}${image}`} // Ensure full path is used
                alt={productData.name}
                className="sm:w-[550px]  w-[450px]     rounded-none sm:rounded-lg"
              />
            </Zoom>
          </div>

          <div className="flex gap-2  justify-center">
            {productData.image.map((item, index) => (
              <img
                key={index}
                src={`${import.meta.env.VITE_BACKEND_URL}${item.url}`} // use item.url
                alt={item.originalname || `Image ${index + 1}`}
                className={`w-16 h-16 object-cover rounded-lg cursor-pointer border ${image === item.url
                  ? "border-black opacity-100"
                  : "border-gray-300 opacity-50 hover:opacity-80"
                  }`}
                onClick={() => setImage(item.url)}
              />
            ))}
          </div>
        </motion.div>

        <div className=" px-4">
          <h1 className="text-4xl philosopher-bold  font-bold text-gray-900 mb-3">
            {productData.name}
          </h1>
          <div className="flex items-center gap-1 text-yellow-500 text-lg">
            {[...Array(5)].map((_, index) => (
              <span key={index}>★</span>
            ))}
 
          </div>

          <div className="text-gray-600 text-lg text-justify" dangerouslySetInnerHTML={{
            __html: productData.Shortdescription
          }}>

          </div>

          <div className="flex items-center gap-4 my-4">
            <p className="text-3xl font-semibold text-gray-900">
              {currency}
              {size ? size.discountedprice : productData.sizes[0].discountedprice}
            </p>
            <p className="text-xl text-gray-500 line-through">
              {currency}
              {size
                ? size.actualprice
                : productData.sizes[0].actualprice}
            </p>
            <p className="top-2 left-2 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
              {size ? size.offer : productData.sizes[0].offer}% OFF
            </p>
          </div>

          <p className="text-gray-600 text-lg">
            {productData.shortDescription}
          </p>

          <div className="mt-6">
            <p className="text-lg font-medium">Select Size</p>
            <div className="flex gap-2 mt-2">
              {productData.sizes.map((item, index) => (
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
          </div>

          <div className="mt-6 w-[300px] flex gap-4">
            <motion.button
              onClick={() => {
                addToCart(productData, "product");
                if (size == "") {
                  setMenuOpen(true);
                }
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
                        if (!token) {
                          setLoginnavigate('/place-order');
                          navigate('/loginsignup', {
                            state: {
                              from: 'cart',
                              intendedPath: '/place-order',
                            },
                            replace: true,
                          });
                        } else {
                          navigate('/place-order');
                        }
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
                addToCart(productData, size);
                if (size !== "") {
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
                if (productData) {
                  addToWishlist(productData, "product");
                  console.log("Added to wishlist:", productData);
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

          </ul>
        </div>
      </div>

      <div className="mt-16">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-6 py-3 sm:text-lg text-base font-medium text-justify transition ${activeTab === "description"
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
            Reviews 
          </button>

        </div>

        <div className="p-6 text-gray-700 text-lg border border-gray-200 rounded-lg mt-4">
          {activeTab === "description" ? (
            <div>
              <h2 className="text-xl font-semibold text-black mb-3">
                Product Details
              </h2>
              <div className="description text-justify">
                <div dangerouslySetInnerHTML={{ __html: productData.description }} />
              </div>
            </div>
          ) : activeTab === "additonalinfo" ? (
            <div>
              <h2 className="text-xl font-semibold text-black mb-3">
                Additional Details
              </h2>
              <div className="description text-justify">
                <div dangerouslySetInnerHTML={{ __html: productData.AdditionalInformation }} />
              </div>
            </div>
          ) : (
            <ReviewsSection productId={productId} setReviewCount={setReviewCount} />
          )}
        </div>
      </div>
      <RelatedProducts category={productData.category} />
    </div>
  );
};

export default Product;