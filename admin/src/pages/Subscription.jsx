import React, { useEffect, useState } from "react";
import axios from "axios";

const Subscription = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/subscribers");
      setSubscribers(response.data);
    } catch (error) {
      console.error("Failed to fetch subscribers", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (email) => {
    const confirmUnsubscribe = window.confirm(
      `Are you sure you want to remove ${email}?`
    );
    if (!confirmUnsubscribe) return;

    try {
      await axios.delete(`http://localhost:5000/api/unsubscribe/${email}`);
      setSubscribers(subscribers.filter((sub) => sub.email !== email));
    } catch (error) {
      console.error("Unsubscribe failed", error);
    }
  };

  return (
    <div className="p-6  mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Admin Panel - Subscribers
      </h1>

      {loading ? (
        <p className="text-center text-sm text-gray-500">Loading subscribers...</p>
      ) : subscribers.length === 0 ? (
        <p className="text-center text-sm text-gray-500">No subscribers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="p-3 border-b text-sm">Email</th>
                <th className="p-3 border-b text-sm text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber, index) => (
                <tr
                  key={subscriber.email}
                  className={`border-b hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="p-3 text-sm">{subscriber.email}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleUnsubscribe(subscriber.email)}
                      className="bg-red-500 text-sm hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Subscription;
