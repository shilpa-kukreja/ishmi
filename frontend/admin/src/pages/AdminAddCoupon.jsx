import React, { useState } from 'react';
import axios from 'axios';

const AdminAddCoupon = ({token}) => {
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    expiryDate: '',
    minPurchaseAmount: '',
    maxDiscountAmount: '',
    isActive: true,
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      

      const { data } = await axios.post('https://ishmiherbal.com/api/coupon/add', formData, 
        {headers:{token}}
      );

      setMessage(data.message);
      setFormData({
        code: '',
        discount: '',
        expiryDate: '',
        minPurchaseAmount: '',
        maxDiscountAmount: '',
        isActive: true,
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to add coupon');
    }
  };

  return (
    <div className=" mx-auto p-6 mt-5 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-6 text-center">Add New Coupon</h2>

      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Coupon Code</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Discount (%)</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Expiry Date</label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Minimum Purchase Amount</label>
          <input
            type="number"
            name="minPurchaseAmount"
            value={formData.minPurchaseAmount}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Maximum Discount Amount</label>
          <input
            type="number"
            name="maxDiscountAmount"
            value={formData.maxDiscountAmount}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label className="font-medium text-sm">Active</label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-sm hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Create Coupon
        </button>
      </form>
    </div>
  );
};

export default AdminAddCoupon;

