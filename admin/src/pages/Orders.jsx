import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        'http://localhost:5000/api/order/list',
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message || "Failed to fetch orders.");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/order/status',
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Order status updated.");
        await fetchAllOrders();
      } else {
        toast.error(response.data.message || "Update failed.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">Order Page</h3>

      <div>
        {currentOrders.map((order) => (
          <div
            key={order._id}
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
          >
            <img
              className="w-12"
              src="https://img.icons8.com/?size=100&id=8382&format=png&color=000000"
              alt="Order Icon"
            />

            <div>
              <div>
                {order.items.map((item, index) => (
                  <p className="py-0.5" key={index}>
                    {item.name} x {item.quantity} <span>{item.size}</span>
                    {index < order.items.length - 1 && ','}
                  </p>
                ))}
              </div>
              <p className="mt-3 mb-2 font-medium">
                {order.address?.firstName} {order.address?.lastName}
              </p>
              <div>
                <p>{order.address?.street},</p>
                <p>
                  {order.address?.city}, {order.address?.state},{' '}
                  {order.address?.country}, {order.address?.zipcode}
                </p>
              </div>
              <p>{order.address?.phone}</p>
            </div>

            <div>
              <p className="text-sm sm:text-[15px]">
                Items : {order.items.length}
              </p>
              <p className="mt-3">Method : {order.paymentMethod}</p>
              <p>Payment : {order.payment ? 'Done' : 'Pending'}</p>
              <p>
                Date :{' '}
                {new Date(order.date).toLocaleString(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
            </div>

            <p className="text-sm sm:text-[15px] font-semibold text-black">
              ₹{order.amount}
            </p>

            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
              className="p-2 font-semibold border rounded"
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1
                  ? 'bg-black text-white'
                  : 'bg-gray-200'
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
