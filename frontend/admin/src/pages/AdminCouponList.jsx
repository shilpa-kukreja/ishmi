import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminCouponList = ({ token }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCoupons = async () => {
    try {
      const { data } = await axios.get("https://ishmiherbal.com/api/coupon/get", 
        {headers:{token}}
      );
      setCoupons(data.coupons);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const { data } = await axios.put(`https://ishmiherbal.com/api/coupon/${id}/toggle`, {}, 
        {headers:{token}}
      );

      setCoupons((prev) =>
        prev.map((coupon) =>
          coupon._id === id ? { ...coupon, isActive: data.coupon.isActive } : coupon
        )
      );
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  if (loading) return <div className="text-center mt-8">Loading coupons...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 mt-5 bg-white shadow rounded-md">
      <h2 className="text-xl font-bold mb-6">All Coupons</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 text-sm border">Code</th>
              <th className="p-2 text-sm border">Discount (%)</th>
              <th className="p-2 text-sm border">Min Purchase</th>
              <th className="p-2 text-sm border">Max Discount</th>
              <th className="p-2 text-sm border">Expiry</th>
              <th className="p-2 text-sm border">Status</th>
              <th className="p-2 text-sm border">Action</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id} className="border-b">
                <td className="p-2 text-sm border">{coupon.code}</td>
                <td className="p-2 text-sm border">{coupon.discount}</td>
                <td className="p-2 text-sm border">{coupon.minPurchaseAmount}</td>
                <td className="p-2 text-sm border">{coupon.maxDiscountAmount || '-'}</td>
                <td className="p-2 text-sm border">
                  {new Date(coupon.expiryDate).toLocaleDateString()}
                </td>
                <td className={`p-2 border ${coupon.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {coupon.isActive ? "Active" : "Inactive"}
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => toggleStatus(coupon._id)}
                    className={`px-3 py-1 rounded text-white ${coupon.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                  >
                    {coupon.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCouponList;
