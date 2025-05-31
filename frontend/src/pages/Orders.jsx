import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FiPackage, FiShoppingBag, FiClock,FiRepeat, FiTruck, FiCheckCircle, FiXCircle } from "react-icons/fi";

const Orders = () => {
  const { token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrderData = async () => {
    try {
      if (!token) return;

      setLoading(true);
      setError(null);

      const response = await axios.post(
        "https://ishmiherbal.com/api/order/userorders",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        const allOrdersItem = [];

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            const formattedItem = {
              ...item,
              orderId: order._id,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
              isCombo: item.type === "combo",
              imageUrl:
                item.type === "combo"
                  ? `${import.meta.env.VITE_BACKEND_URL}/uploads/thumbImg/${item.image}`
                  : `${import.meta.env.VITE_BACKEND_URL}${item.image?.[0]?.url || "/placeholder.jpg"}`,
            };
            allOrdersItem.push(formattedItem);
          });
        });

        setOrderData(allOrdersItem.reverse());
      } else {
        throw new Error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Order fetch error:", error);
      setError("Failed to load your orders. Please try again later.");
      toast.error("Failed to load order history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

 const getStatusDetails = (status) => {
    // Ensure consistent case handling and null/undefined safety
    const statusLower = (status || "order placed").toLowerCase().trim();
    
    // Define all status details in a single object for better maintainability
    const statusMap = {
        "order placed": {
            color: "bg-yellow-100 text-yellow-800",
            icon: <FiClock className="mr-1" />,
            text: "Order Placed",
            nextSteps: "We've received your order and it's being processed"
        },
        "packing": {
            color: "bg-blue-100 text-blue-800",
            icon: <FiPackage className="mr-1" />,  // Changed to FiPackage for better representation
            text: "Packing",
            nextSteps: "Your items are being carefully packed"
        },
        "shipped": {
            color: "bg-indigo-100 text-indigo-800",  // Different shade from packing
            icon: <FiTruck className="mr-1" />,
            text: "Shipped",
            nextSteps: "Your package is on its way"
        },
        "out for delivery": {
            color: "bg-green-100 text-green-800",
            icon: <FiTruck className="mr-1" />,
            text: "Out for Delivery",
            nextSteps: "Your package will arrive today"
        },
        "delivered": {
            color: "bg-green-100 text-green-800",
            icon: <FiCheckCircle className="mr-1" />,
            text: "Delivered",
            nextSteps: "Your order has been delivered"
        },
        "cancelled": {
            color: "bg-red-100 text-red-800",
            icon: <FiXCircle className="mr-1" />,
            text: "Cancelled",
            nextSteps: "This order has been cancelled"
        },
        "returned": {  // Added new status
            color: "bg-purple-100 text-purple-800",
            icon: <FiRepeat className="mr-1" />,
            text: "Returned",
            nextSteps: "Your return has been processed"
        }
    };

    // Return the matched status or default to "order placed"
    return statusMap[statusLower] || statusMap["order placed"];
};

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderSkeletonLoader = () => (
    <div className="space-y-6 max-w-6xl mx-auto">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="p-5 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="animate-pulse flex flex-col md:flex-row justify-between gap-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-gray-200"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
            <div className="flex flex-col justify-between items-start md:items-end gap-4">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="flex gap-3">
                <div className="h-8 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="border-t border-gray-200 pt-10 pb-16 px-4 sm:px-6 md:px-16 lg:px-28 bg-gray-50 min-h-screen">
      <div className="text-center mb-12 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Your Order History
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Track, return, or buy items again from your order history. All your purchases in one place.
        </p>
      </div>

      {loading ? (
        renderSkeletonLoader()
      ) : error ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm max-w-2xl mx-auto p-8">
          <div className="text-red-500 mb-4">
            <FiPackage className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Couldn't load your orders
          </h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={loadOrderData}
            className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition font-medium"
          >
            Retry
          </button>
        </div>
      ) : orderData.length > 0 ? (
        <div className="space-y-6 max-w-6xl mx-auto">
          {orderData.map((item, index) => (
            <div
              key={`${item.orderId}-${index}`}
              className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex items-start gap-4 flex-1">
                  <div className="relative">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg border border-gray-200 object-cover"
                      onError={(e) => {
                        e.target.src = `${import.meta.env.VITE_BACKEND_URL}/placeholder.jpg`;
                      }}
                    />
                    {item.isCombo && (
                      <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow-sm">
                        COMBO
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <span className="text-lg font-medium text-gray-900">
                        {currency} {(item.discountedprice || item.price)}
                      </span>
                    </div>

                    <div className="mt-2 text-sm text-gray-600 space-y-2">
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        <span>
                          <strong className="font-medium">Qty:</strong> {item.quantity}
                        </span>
                        {item.size && (
                          <span>
                            <strong className="font-medium">Size:</strong> {item.size}
                          </span>
                        )}
                        <span>
                          <strong className="font-medium">Order #:</strong> {item.orderId.substring(0, 8)}
                        </span>
                      </div>

                      <p>
                        <strong className="font-medium">Ordered:</strong> {formatDate(item.date)}
                      </p>

                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusDetails(item.status).color}`}>
                          {getStatusDetails(item.status).icon}
                          {getStatusDetails(item.status).text}
                        </span>
                        <span className="ml-3 text-sm">
                          <strong className="font-medium">Payment:</strong> {item.paymentMethod} ({item.payment ? "Paid" : "Pending"})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between items-start md:items-end gap-4">
                  <div className="w-full flex items-center justify-start">
                    <div className="text-left">
                      <p className="text-sm text-gray-500">Total paid</p>
                      <div className="text-gray-600">
                        Subtotal:{" "}
                        <span className="font-semibold">
                          {currency} {(item.discountedprice || item.price) * item.quantity}
                        </span>
                      </div>
                      
                        
                     
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 w-full justify-end">
                    {/* <Link
                      to={`/order-details/${item.orderId}`}
                      className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded hover:bg-gray-800 transition flex items-center"
                    >
                      <FiPackage className="mr-2" />
                      Order Details
                    </Link> */}
                    {item.status.toLowerCase() === "delivered" && (
                      <button className="px-4 py-2 text-sm font-medium border border-gray-300 text-gray-800 rounded hover:bg-gray-50 transition flex items-center">
                        <FiShoppingBag className="mr-2" />
                        Buy Again
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm max-w-2xl mx-auto p-8">
          <div className="text-gray-400 mb-4">
            <FiPackage className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No orders found
          </h3>
          <p className="text-gray-500 mb-6">
            You haven't placed any orders yet. Start shopping to see your order history here.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/shop"
              className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition font-medium"
            >
              Shop Now
            </Link>
            <Link
              to="/"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition font-medium"
            >
              Home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;