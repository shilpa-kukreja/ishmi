import React, { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/all-partner");
      setUsers(response.data.Users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/auth/delete/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Admin Panel - Manage Users
      </h1>

      {loading ? (
        <p className="text-center text-sm text-gray-500">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-center text-sm text-gray-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="p-3 text-sm border-b">Number</th>
                <th className="p-3 text-sm border-b">Email</th>
                <th className="p-3 text-sm border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className={`border-b hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="p-3 text-sm">{user.mobile || "N/A"}</td>
                  <td className="p-3 text-sm">{user.email}</td>
                  <td className="p-3 text-sm text-center">
                    <button
                      onClick={() => handleDelete(user._id)}
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

export default Users;
