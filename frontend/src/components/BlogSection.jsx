import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const BlogSection = () => {
  const { blogs } = useContext(ShopContext);

  return (
    <div className="bg-[#DFC4A6] p-8 px-5 sm:px-20">
      <h2 className="text-2xl   font-bold text-gray-800 mb-6">
        Ishmi Invites You to Explore Ayurveda’s Secrets
        <br />
        <span className="text-3xl  text-gray-900">Nourish your skin, body, and soul with time-tested wisdom and holistic care.</span>
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {blogs.map((blog) => (
          <Link to={`/blog/${blog._id}`} key={blog._id}>
            <div className="flex items-start bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition">
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}${blog.image.url}`}
                alt={blog.name}
                className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg mr-4"
              />

              <div>
                <p className="text-xs font-semibold text-gray-600">04 Sep 2024</p>
                <h3 className="text-lg font-bold text-gray-800">{blog.name}</h3>
                <p className="text-gray-600 text-sm mt-1" dangerouslySetInnerHTML={{
                    __html:blog.description.substring(0, 100)}}></p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogSection;
