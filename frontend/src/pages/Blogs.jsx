import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Blogs = () => {
  const { blogs } = useContext(ShopContext);

  return (
    <div className="bg-[#F7F3EE] ">
      <img className="pb-5" src={assets.TOPBANNER3} alt="" />
      <div className="text-center mb-12">
        <h2 className="sm:text-2xl text-2xl font-extrabold text-gray-800 leading-snug">
          Ishmi Invites You to Explore
        </h2>
        <h3 className="sm:text-4xl text-4xl text-[#D4A373] font-bold mt-3">
          Ayurveda’s Secrets
        </h3>
        <p className="sm:text-lg text-base text-gray-600 mt-4 max-w-2xl mx-auto">
          Nourish your skin, body, and soul with time-tested wisdom and holistic care.
        </p>
      </div>
      <div className="grid md:grid-cols-3 px-5 sm:px-10 pb-5 gap-5">
        {blogs.map((blog) => (
          <Link to={`/blog/${blog._id}`} key={blog._id} className="group">
            <div className="bg-white rounded-xl shadow-none sm:shadow-xl overflow-hidden  ">
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}${blog.image.url}`}
                alt={blog.name}
                className="w-full   transition duration-300 ease-in-out group-hover:opacity-90"
              />

              <div className="p-6">
                <p className="text-sm font-semibold text-gray-500">11 March 2025</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-3 group-hover:text-[#D4A373] transition line-clamp-2">
                  {blog.name}
                </h3>

                <p
                  className="text-gray-600 text-md mt-3 line-clamp-3 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: blog.description.substring(0, 150),
                  }}
                ></p>
                <div className="mt-5">
                  <button className="px-5 py-2 bg-[#D4A373] text-white font-semibold rounded-full shadow-md hover:bg-[#b8865b] transition">
                    Read More →
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
