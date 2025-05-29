import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp, PercentCircle } from "lucide-react"; // Icons

const CouponDropdown = () => {
  const [expanded, setExpanded] = useState(false);
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/coupon/get");
        const couponData = res.data?.coupons || res.data;
        if (Array.isArray(couponData)) {
          const activeCoupons = couponData.filter(c => c.isActive);
          setCoupons(activeCoupons);
        }
      } catch (err) {
        console.error("Error fetching coupons:", err.message);
      }
    };
    fetchCoupons();
  }, []);

  return (
    <div className="mt-6 w-full max-w-xl mx-auto bg-white rounded-lg border border-gray-200 shadow-md p-4">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-2 text-green-700 font-medium">
          <PercentCircle size={20} />
          View Available Coupons
        </div>
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {expanded && (
        <div className="mt-4 space-y-3">
          {coupons.length > 0 ? (
            coupons.map((coupon) => (
              <div
                key={coupon._id}
                className="p-3 border border-green-300 rounded-md bg-green-50 hover:bg-green-100 transition-all"
              >
                <div className="font-semibold text-green-800">
                  Code: {coupon.code}
                </div>
                <div className="text-gray-600 text-sm">
                  {coupon.description || "Discount coupon"}
                </div>
                <div className="text-gray-500 text-xs mt-1">
                  ₹{coupon.discount} OFF on minimum ₹{coupon.minPurchaseAmount} purchase
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No coupons available right now.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CouponDropdown;
