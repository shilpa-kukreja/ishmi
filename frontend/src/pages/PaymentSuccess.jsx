// import React, { useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';

//  const  PaymentSuccess = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect( () => {
//     // Extract parameters from URL
//     const params = new URLSearchParams(location.search);
//     const orderId = params.get('orderId');

//     if (orderId) {
//       // You can optionally verify the payment again here
//       toast.success('Payment successful! Order confirmed.');
//     }
//   }, [location]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="bg-white p-8 rounded-lg shadow-lg text-center">
//         <div className="text-green-500 text-6xl mb-4">✓</div>
//         <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
//         <p className="text-gray-600 mb-6">
//           Thank you for your order. Your payment was successful and your order is being processed.
//         </p>
//         <div className="space-y-3">
//           <button 
//             onClick={() => navigate("/orders")}
//             className="w-full bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
//           >
//             View My Orders
//           </button>
//           <button 
//             onClick={() => navigate("/")}
//             className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
//           >
//             Continue Shopping
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccess;


import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Home, 
  ShoppingBag, 
  Download, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  CreditCard,
  Loader2
} from "lucide-react";
import axios from "axios";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [timeLeft, setTimeLeft] = useState(10);

  // Helper functions
  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) return "0.00";
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return numAmount.toFixed ? numAmount.toFixed(2) : numAmount.toString();
  };

  const getOrderAmount = (order) => {
    if (!order || !order.amount) return "0.00";
    return formatAmount(order.amount);
  };

  const getItemPrice = (item) => {
    const price = parseFloat(item.discountedprice || 0);
    const quantity = parseInt(item.quantity || 1);
    const total = price * quantity;
    return formatAmount(total);
  };

  const getActualPrice = (item) => {
    const price = parseFloat(item.actualprice || 0);
    const quantity = parseInt(item.quantity || 1);
    const total = price * quantity;
    return formatAmount(total);
  };

  const calculateSavings = () => {
    if (!orderDetails?.items) return 0;
    const savings = orderDetails.items.reduce((total, item) => {
      const actualPrice = parseFloat(item.actualprice || 0);
      const discountedPrice = parseFloat(item.discountedprice || 0);
      const quantity = parseInt(item.quantity || 1);
      return total + ((actualPrice - discountedPrice) * quantity);
    }, 0);
    return parseFloat(savings.toFixed(2));
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      // Get parameters from URL
      const orderIdParam = params.get("orderId");
      const txnidParam = params.get("txnid");
      const statusParam = params.get("status");
      const amountParam = params.get("amount");
      
      console.log("URL Parameters:", { 
        orderId: orderIdParam, 
        txnid: txnidParam, 
        status: statusParam,
        amount: amountParam
      });

      // Use orderId from URL or localStorage
      let orderId = orderIdParam;
      if (!orderId) {
        const storedOrderId = localStorage.getItem('lastOrderId');
        if (storedOrderId) {
          console.log("Using stored order ID from localStorage:", storedOrderId);
          orderId = storedOrderId;
        } else {
          setError("No order ID provided");
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem("token");
        console.log("Auth check:", { token: !!token });
        
        // Try authenticated endpoint first if token exists
        if (token) {
          try {
            console.log("Trying with token...");
            const response = await axios.get(
              `${process.env.VITE_BACKEND_URL || 'https://ishmiherbal.com'}/api/order/${orderId}`,
              { headers: { token } }
            );

            if (response.data.success) {
              setOrderDetails(response.data.order);
              console.log("Order found with token:", response.data.order._id);
              setLoading(false);
              return;
            }
          } catch (tokenError) {
            console.log("Token-based fetch failed:", tokenError.message);
          }
        }

        // If authenticated fetch failed or no token, check if we have payment confirmation
        if (statusParam === 'success' && txnidParam) {
          // Create a temporary order object from URL params
          const tempOrder = {
            _id: orderId,
            orderid: orderId,
            transactionId: txnidParam,
            amount: parseFloat(amountParam || "0"),
            payment: true,
            paymentStatus: 'paid',
            status: 'processing',
            paymentMethod: 'PayU',
            items: [],
            address: {
              firstName: '',
              lastName: '',
              email: '',
              street: '',
              city: '',
              state: '',
              zipcode: '',
              country: '',
              phone: ''
            },
            date: Date.now(),
            discount: 0,
            Shipping: 0,
            __v: 0
          };
          
          console.log("Created temporary order from URL params:", tempOrder);
          setOrderDetails(tempOrder);
          
          // Still try to fetch actual order details in background
          if (token) {
            setTimeout(() => {
              fetchActualOrderDetails(orderId, token);
            }, 2000);
          }
        } else {
          setError("Unable to verify order. Please check your order history.");
        }
        
      } catch (error) {
        console.error("Error in fetchOrderDetails:", error);
        setError(
          "Your payment was successful but we're having trouble loading order details. " +
          "Please check your email for confirmation."
        );
      } finally {
        setLoading(false);
      }
    };

    // Helper function to fetch actual order details
    const fetchActualOrderDetails = async (orderId, token) => {
      try {
        const response = await axios.get(
          `${process.env.VITE_BACKEND_URL || 'https://ishmiherbal.com'}/api/order/${orderId}`,
          { headers: { token } }
        );
        
        if (response.data.success) {
          console.log("Updated with actual order data:", response.data.order._id);
          setOrderDetails(response.data.order);
        }
      } catch (error) {
        console.log("Background fetch failed:", error.message);
      }
    };

    fetchOrderDetails();
  }, [params, navigate]);

  // Countdown for redirect
  // useEffect(() => {
  //   if (timeLeft > 0) {
  //     const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
  //     return () => clearTimeout(timer);
  //   } else {
  //     navigate("/orders");
  //   }
  // }, [timeLeft, navigate]);

  const handleDownloadInvoice = async () => {
    if (!orderDetails?._id) {
      alert("Cannot download invoice - order details not fully loaded");
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to download invoice");
        return;
      }
      
      const response = await axios.post(
        "https://ishmiherbal.com/api/order/generate-invoice",
        { orderId: orderDetails._id },
        {
          headers: { token },
          responseType: 'blob'
        }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${orderDetails._id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading invoice:", error);
      alert("Invoice download failed. Please try again from your order history.");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Just now";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateEstimatedDelivery = (orderDate) => {
    if (!orderDate) return "N/A";
    const date = new Date(orderDate);
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString("en-US", {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Loading your order details...</h2>
          <p className="text-gray-500 mt-2">Please wait while we fetch your information</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Your payment was processed successfully.</p>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Link
              to="/orders"
              className="block w-full bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition-colors"
            >
              View Order History
            </Link>
            <Link
              to="/"
              className="block w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Order Data</h2>
          <p className="text-gray-600 mb-6">Unable to load order information</p>
          <Link
            to="/"
            className="inline-block bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const savings = calculateSavings();
  const estimatedDelivery = calculateEstimatedDelivery(orderDetails.date);
  const orderDate = formatDate(orderDetails.date);
  const orderAmount = getOrderAmount(orderDetails);
  const orderIdDisplay = orderDetails.orderid || orderDetails._id?.slice(-8) || 'N/A';

  // Define steps based on order status
  const steps = [
    { 
      icon: <CheckCircle size={20} />, 
      label: "Order Placed", 
      active: true,
      status: "Completed"
    },
    { 
      icon: <Package size={20} />, 
      label: "Processing", 
      active: orderDetails.status === "processing" || orderDetails.status === "shipped" || orderDetails.status === "delivered",
      status: orderDetails.status === "processing" ? "In Progress" : "Pending"
    },
    { 
      icon: <Truck size={20} />, 
      label: "Shipped", 
      active: orderDetails.status === "shipped" || orderDetails.status === "delivered",
      status: orderDetails.status === "shipped" ? "In Transit" : "Pending"
    },
    { 
      icon: <CheckCircle size={20} />, 
      label: "Delivered", 
      active: orderDetails.status === "delivered",
      status: orderDetails.status === "delivered" ? "Delivered" : "Pending"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Payment Successful! 🎉
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Thank you for your purchase! Your order #{orderIdDisplay} has been confirmed.
          </p>
          {!orderDetails.items || orderDetails.items.length === 0 ? (
            <p className="text-sm text-yellow-600 mt-2">
              Order details are still loading. Please check your order history for full details.
            </p>
          ) : null}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Summary */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Status Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Order Status</h2>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  orderDetails.payment ? 
                  'bg-green-100 text-green-800' : 
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {orderDetails.payment ? 'Payment Confirmed' : 'Payment Pending'}
                </div>
              </div>
              
              {/* Progress Steps */}
              <div className="relative mb-8">
                <div className="flex justify-between">
                  {steps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center relative z-10 w-1/4">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-2 border-4 border-white ${
                        step.active ? 
                        'bg-green-500 text-white shadow-lg transform scale-110' : 
                        'bg-gray-100 text-gray-400'
                      } transition-all duration-300`}>
                        {step.icon}
                      </div>
                      <span className={`text-sm font-medium ${step.active ? 'text-green-600' : 'text-gray-500'}`}>
                        {step.label}
                      </span>
                      <span className={`text-xs mt-1 ${step.active ? 'text-green-500 font-semibold' : 'text-gray-400'}`}>
                        {step.status}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10">
                  <div 
                    className="h-full bg-green-500 transition-all duration-500 ease-out"
                    style={{ 
                      width: steps.filter(s => s.active).length === 1 ? '25%' :
                             steps.filter(s => s.active).length === 2 ? '50%' :
                             steps.filter(s => s.active).length === 3 ? '75%' : '100%'
                    }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-semibold text-gray-900">
                        {orderIdDisplay}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Order Date</p>
                      <p className="font-semibold text-gray-900">{orderDate}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Transaction ID</p>
                      <p className="font-semibold text-gray-900">{orderDetails.transactionId || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p className="font-semibold text-gray-900 capitalize">
                        {orderDetails.paymentMethod || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items Card - Only show if items exist */}
            {/* {orderDetails.items && orderDetails.items.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Items</h2>
                <div className="space-y-4">
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                        {item.image ? (
                          Array.isArray(item.image) ? (
                            <img 
                              src={`${process.env.REACT_APP_BACKEND_URL}${item.image[0]?.url || item.image[0]}`} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img 
                              src={`${process.env.REACT_APP_BACKEND_URL}${item.image}`} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          )
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        {item.size && (
                          <p className="text-sm text-gray-500">Size: {item.size}</p>
                        )}
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ₹{getItemPrice(item)}
                        </p>
                        {parseFloat(item.actualprice || 0) > parseFloat(item.discountedprice || 0) && (
                          <p className="text-sm text-gray-400 line-through">
                            ₹{getActualPrice(item)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Items</h2>
                <p className="text-gray-500 text-center py-8">
                  Loading order items... Please check your order history for full details.
                </p>
              </div>
            )} */}

            {/* Shipping Details Card - Only show if address exists */}
            {orderDetails.address && orderDetails.address.firstName ? (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Details</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {orderDetails.address.firstName} {orderDetails.address.lastName}
                      </p>
                      <p className="text-gray-600">{orderDetails.address.email || 'Email not available'}</p>
                    </div>
                  </div>
                  {orderDetails.address.street && (
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-gray-600">{orderDetails.address.street}</p>
                        <p className="text-gray-600">
                          {orderDetails.address.city}, {orderDetails.address.state} {orderDetails.address.zipcode}
                        </p>
                        <p className="text-gray-600">{orderDetails.address.country}</p>
                      </div>
                    </div>
                  )}
                  {orderDetails.address.phone && (
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-gray-600">{orderDetails.address.phone}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start space-x-3 pt-4 border-t">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <Truck className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estimated Delivery</p>
                      <p className="font-medium text-gray-900">{estimatedDelivery}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Right Column - Actions & Summary */}
          <div className="space-y-6">
            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{orderAmount}</span>
                </div>
                {orderDetails.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-green-600">
                      -₹{formatAmount(orderDetails.discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">
                    {orderDetails.Shipping > 0 ? `₹${formatAmount(orderDetails.Shipping)}` : "Free"}
                  </span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">You Saved</span>
                    <span className="font-medium text-green-600">₹{formatAmount(savings)}</span>
                  </div>
                )}
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-green-600">
                      ₹{orderAmount}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center text-sm">
                  <div className={`w-2 h-2 rounded-full mr-2 ${orderDetails.payment ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                  <span className={`font-medium ${orderDetails.payment ? 'text-green-600' : 'text-yellow-600'}`}>
                    {orderDetails.payment ? 'Payment Confirmed' : 'Payment Pending'}
                  </span>
                  <span className="text-gray-500 ml-2">
                    via {orderDetails.paymentMethod || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">What's Next?</h2>
              <div className="space-y-3">
                {/* <button
                  onClick={handleDownloadInvoice}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg"
                >
                  <Download size={20} />
                  <span>Download Invoice</span>
                </button>
                 */}
                <Link
                  to="/orders"
                  className="block w-full text-center border-2 border-green-500 text-green-600 py-3 rounded-xl font-medium hover:bg-green-50 transition-colors duration-300"
                >
                  View All Orders
                </Link>
                
                <Link
                  to="/"
                  className="block w-full text-center border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-300 flex items-center justify-center"
                >
                  <ShoppingBag className="mr-2" size={18} />
                  Continue Shopping
                </Link>
                
                <Link
                  to="/"
                  className="block w-full text-center text-gray-600 py-3 font-medium hover:text-green-600 transition-colors duration-300 flex items-center justify-center"
                >
                  <Home className="mr-2" size={18} />
                  Back to Home
                </Link>
              </div>
              
              {/* Countdown Timer */}
              {/* <div className="mt-6 pt-6 border-t text-center">
                <p className="text-sm text-gray-500">
                  Redirecting to orders page in{" "}
                  <span className="font-bold text-green-600">{timeLeft}</span> seconds
                </p>
                <button
                  onClick={() => navigate("/orders")}
                  className="text-sm text-green-600 hover:text-green-700 font-medium mt-2"
                >
                  Go now
                </button>
              </div> */}
            </div>

          
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentSuccess;