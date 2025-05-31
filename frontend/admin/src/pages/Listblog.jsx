import React, { useEffect, useState } from "react";
import axios from "axios";

const Listblog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("https://ishmiherbal.com/api/blog/get");
        setBlogs(response.data.blogs);
      } catch (error) {
        console.error("Error fetching blogs", error);
      }
    };
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.post("https://ishmiherbal.com/api/blog/remove", { id });
      alert(response.data.message);
      setBlogs(blogs.filter((blog) => blog._id !== id));
    } catch (error) {
      console.error("Error deleting blog", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 ">
      <div className="container mx-auto ">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <h1 className="text-xl font-extrabold text-gray-800 text-center mb-8">
            Blog Management
          </h1>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden shadow-md">
              <thead className="bg-gray-500 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Blog Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Image</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.length > 0 ? (
                  blogs.map((blog) => (
                    <tr
                      key={blog._id}
                      className="hover:bg-gray-100 transition duration-200"
                    >
                      <td className="px-6 py-4 text-gray-800 text-sm font-medium">
                        {blog.name}
                      </td>
                      <td className="px-6 py-4">
                        <img
                          src={`${import.meta.env.VITE_BACKEND_URL}${blog.image.url}`}
                          alt={blog.name}
                          className="w-20 text-sm h-20 object-cover rounded-lg border border-gray-300 shadow-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="bg-red-500 text-sm text-white py-2 px-4 rounded-md font-semibold hover:bg-red-600 shadow-lg transition duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-8 text-center text-gray-600 text-lg font-medium"
                    >
                      No blogs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listblog;
