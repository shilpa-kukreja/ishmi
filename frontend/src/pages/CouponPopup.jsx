import { useEffect, useState } from "react";
import axios from "axios";

const CouponPopup = () => {
  const [visible, setVisible] = useState(false);
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
  const timer = setTimeout(() => {
    setVisible(true);
  }, 5000);
  return () => clearTimeout(timer);
}, []);

   useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/coupon/get");
        const couponData = res.data?.coupons || res.data;
        if (Array.isArray(couponData)) {
          // Filter only active coupons
          const activeCoupons = couponData.filter(c => c.isActive === true);
          setCoupons(activeCoupons);
        } else {
          console.warn("Unexpected coupon response structure:", res.data);
        }
      } catch (err) {
        console.error("Error fetching coupons:", err.message);
      }
    };
    fetchCoupons();
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50  bg-opacity-30 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative select-text animate-fade-in">
        <button
          onClick={() => setVisible(false)}
          className="absolute top-3 right-4 text-gray-600 hover:text-red-500 text-2xl font-bold"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          🎁 Available Coupons
        </h2>
        {Array.isArray(coupons) && coupons.length > 0 ? (
          <ul className="space-y-4">
            {coupons.map((coupon) => (
              <li
                key={coupon._id}
                className="p-4 bg-gradient-to-r from-green-100 via-white to-green-50 border border-green-300 rounded-lg"
              >
                <div className="text-lg font-semibold text-green-800">
                  Code: {coupon.code}
                </div>
                <div className="text-gray-600">{coupon.description || "Discount coupon"}</div>
                <div className="text-sm text-gray-500 mt-1">
                  ₹{coupon.discount} OFF (Min. Purchase: ₹{coupon.minPurchaseAmount})
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No coupons available right now.</p>
        )}
      </div>
    </div>
  );
};

export default CouponPopup;
