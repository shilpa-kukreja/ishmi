import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import CartTotal from "../components/CartTotal ";
import axios from "axios";
import { toast } from "react-toastify";
import CouponDropdown from "../components/CouponDropdown";


const Placeorder = () => {
  const [method, setMethod] = useState("razorpay");
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    navigate,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
    combos,
  } = useContext(ShopContext);

  const cartTotal = getCartAmount() + delivery_fee;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };



  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      const totalAmount = cartTotal;
      const { data } = await axios.post(
        "https://ishmiherbal.com/api/coupon/apply",
        { code: couponCode, totalAmount },
        { headers: { token } }
      );

      if (data.success) {
        setDiscount(data.discount);
        setTotalAfterDiscount(data.newTotalAmount);
        toast.success(`Coupon applied! You saved ₹${data.discount}`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount.toFixed(2),
      currency: order.currency,
      name: "Order Payment",
      description: "Order Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        setLoading(true); // Show loader
        try {
          const { data } = await axios.post(
            "https://ishmiherbal.com/api/order/verifyRazorpay",
            { ...response, orderData: prepareOrderData() },
            { headers: { token } }
          );
           if (data.success) {
            // 1. Get Shiprocket Auth Token
            const authRes = await axios.post(
              'https://apiv2.shiprocket.in/v1/external/auth/login',
              {
                email: "niranjan13ishnavi@gmail.com",
                password: "7@@k6tkixb0Edr^c"
              },
              {
                headers: { 'Content-Type': 'application/json' }
              }
            );

            const shiprokettoken = authRes.data.token;
            

            // console.log(shiprokettoken);

            // 2. Prepare shipping order payload

            const formatDate = (timestamp) => {
              const date = new Date(timestamp);
              const yyyy = date.getFullYear();
              const mm = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
              const dd = String(date.getDate()).padStart(2, '0');
              const hh = String(date.getHours()).padStart(2, '0');
              const min = String(date.getMinutes()).padStart(2, '0');
              return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
            };

            const currentDate = Date.now();
            var currentDatetime = formatDate(currentDate)
            // Get the current timestamp

            console.log("orderData:",order)

            const orderPayload = {
              order_id: order.id, // Order ID   
              order_date: currentDatetime, // Current datetime in "yyyy-mm-dd hh:mm" format
              pickup_location: "home-2", // Static pickup location
              comment: "",
              billing_customer_name: order.orderData.address.firstName, // Billing first name from order data
              billing_last_name: order.orderData.address.lastName, // Billing last name from order data
              billing_address: order.orderData.address.street, // Billing address from order data
              billing_address_2: "Near Hokage House", // Static second billing address
              billing_city: order.orderData.address.city, // Billing city from order data
              billing_pincode:order.orderData.address.zipcode, // Billing pincode from order data
              billing_state: order.orderData.address.state, // Billing state from order data
              billing_country: order.orderData.address.country, // Billing country from order data
              billing_email: order.orderData.address.email, // Billing email from order data
              billing_phone: order.orderData.address.phone, // Billing phone from order data
              shipping_is_billing: true, // Assuming shipping is the same as billing
              order_items: order.orderData.items.map(item => ({
                name: item.name, // Item name from order data
                sku: item._id, // SKU from order data
                units: item.quantity, // Item quantity from order data
                selling_price: item.discountedprice, // Discounted price from order data
                hsn: 441122 // Static HSN code (could be dynamic based on your needs)
              })),
              payment_method: 'prepaid', // Payment method from order data
              shipping_charges: 0, // Assuming no shipping charges
              giftwrap_charges: 0, // Assuming no giftwrap charges
              transaction_charges: 0, // Assuming no transaction charges
              total_discount: 0, // Assuming no discount
              sub_total: order.orderData.amount, // Subtotal from order data
              length: 8, // Static length (you can update based on actual data)
              breadth: 8, // Static breadth (you can update based on actual data)
              height: 3.5, // Static height (you can update based on actual data)
              weight: 0.2 // Static weight (you can update based on actual data)
            };
            console.log(orderPayload)

            // 3. Create Shiprocket Order
            const shipRes = await axios.post(
              'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
              orderPayload,
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${shiprokettoken}`
                }
              }
            );

            console.log("Shiprocket Response:", shipRes.data);

            setCartItems({});
            toast.success("Payment Verified");
            setTimeout(() => {
              navigate("/orders"); // Navigate after short delay
            }, 500); // optional delay for UX
          }
        } catch (error) {
          console.error(error);
          toast.error(error.response?.data?.message || "Payment verification failed");
        } finally {
          setLoading(false); // Hide loader
        }
      },

      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone,
      },
      theme: {
        color: "#3399cc",
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const prepareOrderData = () => {
    let orderItems = [];

    Object.entries(cartItems).forEach(([itemId, itemDetails]) => {
      // Handle products with sizes
      if (itemDetails.sizes) {
        Object.entries(itemDetails.sizes).forEach(([size, sizeDetails]) => {
          if (Number(sizeDetails.quantity)) {
            orderItems.push({
              _id: itemId,
              type: "product",
              name: itemDetails.name,
              image: itemDetails.image,
              size,
              quantity: sizeDetails.quantity,
              discountedprice: sizeDetails.discountedprice.toFixed(2),
              actualprice: sizeDetails.actualprice.toFixed(2),
            });
          }
        });
      }
      // Handle combos
      else if (itemDetails.type === "combo") {
        if (Number(itemDetails.quantity)) {
          const comboData = combos.find(c => c._id === itemId);
          orderItems.push({
            _id: itemId,
            type: "combo",
            name: itemDetails.name || comboData?.name,
            image: itemDetails.image || comboData?.thumbImg,
            quantity: itemDetails.quantity,
            discountedprice: itemDetails.discountedprice.toFixed(2),
            actualprice: itemDetails.actualprice.toFixed(2),
          });
        }
      }
    });

    return {
      address: formData,
      items: orderItems,
      amount: totalAfterDiscount !== null ? totalAfterDiscount : cartTotal,
      couponCode: couponCode.trim() || undefined,
      discount,
      paymentMethod: method,
    };
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    // Validate form
    if (!formData.firstName || !formData.phone || !formData.street) {
      toast.error("Please fill all required fields");
      setIsProcessing(false);
      return;
    }

    try {
      const orderData = prepareOrderData();

      if (orderData.items.length === 0) {
        toast.error("Your cart is empty");
        setIsProcessing(false);
        return;
      }

      switch (method) {
        case "cod":
          const { data } = await axios.post(
            "https://ishmiherbal.com/api/order/place",
            orderData,
            { headers: { token } }
          );
          if (data.success) {
            // 1. Get Shiprocket Auth Token
            const orderid = data.orderid;
            console.log("orderid:",orderid)
            const authRes = await axios.post(
              'https://apiv2.shiprocket.in/v1/external/auth/login',
              {
                email: "niranjan13ishnavi@gmail.com",
                password: "7@@k6tkixb0Edr^c"
              },
              {
                headers: { 'Content-Type': 'application/json' }
              }
            );

            const shiprokettoken = authRes.data.token;
            

            // console.log(shiprokettoken);

            // 2. Prepare shipping order payload

            const formatDate = (timestamp) => {
              const date = new Date(timestamp);
              const yyyy = date.getFullYear();
              const mm = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
              const dd = String(date.getDate()).padStart(2, '0');
              const hh = String(date.getHours()).padStart(2, '0');
              const min = String(date.getMinutes()).padStart(2, '0');
              return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
            };

            const currentDate = Date.now();
            var currentDatetime = formatDate(currentDate)
            // Get the current timestamp

           

            const orderPayload = {
              order_id: orderid, // Order ID   
              order_date: currentDatetime, // Current datetime in "yyyy-mm-dd hh:mm" format
              pickup_location: "home-2", // Static pickup location
              comment: "",
              billing_customer_name: orderData.address.firstName, // Billing first name from order data
              billing_last_name: orderData.address.lastName, // Billing last name from order data
              billing_address: orderData.address.street, // Billing address from order data
              billing_address_2: "Near Hokage House", // Static second billing address
              billing_city: orderData.address.city, // Billing city from order data
              billing_pincode:orderData.address.zipcode, // Billing pincode from order data
              billing_state: orderData.address.state, // Billing state from order data
              billing_country: orderData.address.country, // Billing country from order data
              billing_email: orderData.address.email, // Billing email from order data
              billing_phone: orderData.address.phone, // Billing phone from order data
              shipping_is_billing: true, // Assuming shipping is the same as billing
              order_items: orderData.items.map(item => ({
                name: item.name, // Item name from order data
                sku: item._id, // SKU from order data
                units: item.quantity, // Item quantity from order data
                selling_price: item.discountedprice, // Discounted price from order data
                hsn: 441122 // Static HSN code (could be dynamic based on your needs)
              })),
              payment_method: 'postpaid', // Payment method from order data
              shipping_charges: 0, // Assuming no shipping charges
              giftwrap_charges: 0, // Assuming no giftwrap charges
              transaction_charges: 0, // Assuming no transaction charges
              total_discount: 0, // Assuming no discount
              sub_total: orderData.amount, // Subtotal from order data
              length: 8, // Static length (you can update based on actual data)
              breadth: 8, // Static breadth (you can update based on actual data)
              height: 3.5, // Static height (you can update based on actual data)
              weight: 0.2 // Static weight (you can update based on actual data)
            };
            console.log(orderPayload)

            // 3. Create Shiprocket Order
            const shipRes = await axios.post(
              'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
              orderPayload,
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${shiprokettoken}`
                }
              }
            );

            console.log("Shiprocket Response:", shipRes.data);
            setCartItems({});
            navigate("/orders");
            toast.success("Order placed successfully!");
          }
          break;

        case "razorpay":
          const response = await axios.post(
            "https://ishmiherbal.com/api/order/razorpay",
            orderData,
            { headers: { token } }
          );
         if (response.data.success) {
            initPay({...response.data.order,orderData});
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setIsProcessing(false);
    }
  };



  return (
    <>
      {loading && (
        <div className="fixed inset-0  bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl flex items-center gap-3">
            <svg
              className="animate-spin h-6 w-6 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <p className="text-gray-800 font-medium">Verifying payment...</p>
          </div>
        </div>
      )}

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col pb-10 sm:flex-row justify-between gap-8 pt-4 sm:pt-8 min-h-[80vh] border-t border-gray-200 px-4 sm:px-20 lg:px-16 bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <div className="flex flex-col gap-6 w-full  sm:mt-10 bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Billing Address</h2>
          <div className="flex gap-4">
            <input
              required
              onChange={onChangeHandler}
              name="firstName"
              value={formData.firstName}
              className="border border-gray-200 rounded-lg py-2.5 px-4 w-full focus:outline-none focus:ring-2 focus:ring-black transition-all hover:border-gray-300 placeholder-gray-400"
              type="text"
              placeholder="First Name"
            />
            <input
              required
              onChange={onChangeHandler}
              name="lastName"
              value={formData.lastName}
              className="border border-gray-200 rounded-lg py-2.5 px-4 w-full focus:outline-none focus:ring-2 focus:ring-black transition-all hover:border-gray-300 placeholder-gray-400"
              type="text"
              placeholder="Last Name"
            />
          </div>
          <input
            required
            onChange={onChangeHandler}
            name="email"
            value={formData.email}
            className="border border-gray-200 rounded-lg py-2.5 px-4 w-full focus:outline-none focus:ring-2 focus:ring-black transition-all hover:border-gray-300 placeholder-gray-400"
            type="email"
            placeholder="Email Address"
          />
          <div className="flex gap-4">
            <input
              required
              onChange={onChangeHandler}
              name="zipcode"
              value={formData.zipcode}
              className="border border-gray-200 rounded-lg py-2.5 px-4 w-full focus:outline-none focus:ring-2 focus:ring-black transition-all hover:border-gray-300 placeholder-gray-400"
              type="text"
              placeholder="Pin Code"
            />
            <input
              required
              onChange={onChangeHandler}
              name="phone"
              value={formData.phone}
              className="border border-gray-200 rounded-lg py-2.5 px-4 w-full focus:outline-none focus:ring-2 focus:ring-black transition-all hover:border-gray-300 placeholder-gray-400"
              type="number"
              placeholder="Mobile"
            />
          </div>
          <input
            required
            onChange={onChangeHandler}
            name="street"
            value={formData.street}
            className="border border-gray-200 rounded-lg py-2.5 px-4 w-full focus:outline-none focus:ring-2 focus:ring-black transition-all hover:border-gray-300 placeholder-gray-400"
            type="text"
            placeholder="Address"
          />
          <div className="flex gap-4">
            <input
              required
              onChange={onChangeHandler}
              name="city"
              value={formData.city}
              className="border border-gray-200 rounded-lg py-2.5 px-4 w-full focus:outline-none focus:ring-2 focus:ring-black transition-all hover:border-gray-300 placeholder-gray-400"
              type="text"
              placeholder="City"
            />
            <input
              required
              onChange={onChangeHandler}
              name="state"
              value={formData.state}
              className="border border-gray-200 rounded-lg py-2.5 px-4 w-full focus:outline-none focus:ring-2 focus:ring-black transition-all hover:border-gray-300 placeholder-gray-400"
              type="text"
              placeholder="State"
            />
          </div>
          <div className="flex gap-4">
            <input
              required
              onChange={onChangeHandler}
              name="country"
              value={formData.country}
              className="border border-gray-200 rounded-lg py-2.5 px-4 w-full focus:outline-none focus:ring-2 focus:ring-black transition-all hover:border-gray-300 placeholder-gray-400"
              type="text"
              placeholder="Country"
            />
            <input
              className="border border-gray-200 rounded-lg py-2.5 px-4 w-full focus:outline-none focus:ring-2 focus:ring-black transition-all hover:border-gray-300 placeholder-gray-400"
              type="number"
              placeholder="Alt Mobile"
            />
          </div>
        </div>

        <div className="mt-8 w-full sm:max-w-[450px]">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Payment and Shipping</h2>
            <div className="flex flex-col gap-4">
              <div
                onClick={() => setMethod("razorpay")}
                className={`flex items-center gap-3 border p-3 rounded-lg cursor-pointer transition-all ${method === "razorpay"
                  ? "border-black shadow-md bg-gradient-to-r from-gray-50 to-gray-100"
                  : "border-gray-200 hover:border-black hover:bg-gray-50"
                  }`}
              >
                <div
                  className={`w-4 h-4 border rounded-full flex items-center justify-center ${method === "razorpay"
                    ? "bg-black border-black"
                    : "border-gray-300"
                    }`}
                >
                  {method === "razorpay" && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <img className="h-6" src={assets.razorpay_logo} alt="Razorpay" />
              </div>
              <div
                onClick={() => setMethod("cod")}
                className={`flex items-center gap-3 border p-3 rounded-lg cursor-pointer transition-all ${method === "cod"
                  ? "border-black shadow-md bg-gradient-to-r from-gray-50 to-gray-100"
                  : "border-gray-200 hover:border-black hover:bg-gray-50"
                  }`}
              >
                <div
                  className={`w-4 h-4 border rounded-full flex items-center justify-center ${method === "cod" ? "bg-black border-black" : "border-gray-300"
                    }`}
                >
                  {method === "cod" && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <p className="text-gray-700 text-sm font-medium">
                  CASH ON DELIVERY
                </p>
              </div>
            </div>
            <CouponDropdown />

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Apply Coupon</h3>
              <div className="flex gap-2">
                <input
                  className="border border-gray-200 rounded-lg py-2.5 px-4 w-full focus:outline-none focus:ring-2 focus:ring-black transition-all hover:border-gray-300 placeholder-gray-400"
                  type="text"
                  placeholder="Enter Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={!couponCode.trim()}
                  className="bg-black text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
              </div>
              {discount > 0 && (
                <p className="mt-2 text-green-600">
                  Discount Applied: ₹{discount}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-4 text-gray-600 text-sm">
              <div className="flex justify-between items-center">
                <p>Subtotal</p>
                <p className="font-medium text-gray-800">₹{getCartAmount().toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center">
                <p>Delivery Fee</p>
                <p className="font-medium text-gray-800">₹{delivery_fee}</p>
              </div>

              {discount > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <p>Discount</p>
                  <p className="font-medium">-₹{discount}</p>
                </div>
              )}

              <div className="border-t border-gray-200 my-2"></div>

              <div className="flex justify-between items-center font-semibold text-lg text-gray-800">
                <p>Total</p>
                <p>
                  ₹{(totalAfterDiscount !== null ? totalAfterDiscount : cartTotal).toFixed(2)}
                </p>
              </div>
            </div>
            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full bg-black text-white px-16 py-3 text-sm rounded-lg mt-6 ${isProcessing ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-800"
                }`}
            >
              {isProcessing ? "Processing..." : "PLACE ORDER"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};



export default Placeorder;

