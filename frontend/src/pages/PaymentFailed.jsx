import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentFailed = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const orderId = params.get('orderId');
  const status = params.get('status');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="text-red-500 text-6xl mb-4">✗</div>
        <h1 className="text-2xl font-bold mb-4">Payment Failed</h1>
        <p className="text-gray-600 mb-4">
          {status === 'failure' 
            ? 'Your payment was unsuccessful. Please try again.' 
            : 'Your payment was cancelled.'}
        </p>
        {orderId && (
          <p className="text-sm text-gray-500 mb-6">
            Order ID: {orderId}
          </p>
        )}
        <div className="space-y-3">
          <button 
            onClick={() => navigate("/checkout")}
            className="w-full bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
          <button 
            onClick={() => navigate("/cart")}
            className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Go to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;