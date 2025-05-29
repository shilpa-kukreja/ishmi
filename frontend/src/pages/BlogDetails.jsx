import React, { useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { FaArrowLeft, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

const BlogDetails = () => {
  const { blogs } = useContext(ShopContext);
  const { id } = useParams();
  const blog = blogs.find((b) => b._id === id);
  const latestBlogs = blogs.slice(0, 4);

  if (!blog)
    return <div className="p-10 text-center text-xl text-gray-600">Blog not found</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">

      <div className="md:col-span-2 bg-white shadow-lg rounded-md mb-6 p-6">

        <Link
          to="/"
          className="flex items-center text-gray-600 hover:text-gray-900 transition duration-200 mb-4"
        >
          <FaArrowLeft className="mr-2 text-lg" />
          <span className="text-lg font-medium">Back to Blogs</span>
        </Link>


        <div className="overflow-hidden border border-gray-200 shadow-md rounded-lg">
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}${blog.image.url}`}
            alt={blog.name}
            className="text-center  m-auto h-[400px] object-cover transition-transform duration-300 hover:scale-105"
          />

        </div>


        <h2 className="text-4xl font-extrabold text-gray-900 mt-6">{blog.name}</h2>


        <div className="flex items-center text-gray-500 text-sm mt-2">
          <span className="mr-2">📅 Published on 04 Sep 2024</span>
          <span>• ✍️ By Admin</span>
        </div>


        <p className="text-gray-700 text-lg mt-6 leading-relaxed text-justify" dangerouslySetInnerHTML={{ __html: blog.description }}></p>


        <div className="pt-5">
          <h1 className="text-xl font-semibold font-serif text-gray-600">Why Choose Ishmi?</h1>
          <p className="text-gray-700 text-lg mt-6 leading-relaxed">
            Albelee stands out for its commitment to purity and sustainability. By prioritizing organic ingredients and avoiding harmful chemicals, Albelee ensures that each product is safe for your skin and gentle on the planet. Their eco-friendly practices and cruelty-free ethos make Albelee a brand that resonates with conscious consumers looking to make mindful choices in their beauty routines.
          </p>
        </div>


        <div className="mt-8">
          <h3 className="text-gray-800 font-semibold text-lg mb-3">Share this blog:</h3>
          <div className="flex gap-4">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-transform duration-200 transform hover:scale-110 text-2xl"
            >
              <FaFacebook />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${blog.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-600 transition-transform duration-200 transform hover:scale-110 text-2xl"
            >
              <FaTwitter />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-900 transition-transform duration-200 transform hover:scale-110 text-2xl"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>


      <div className="bg-white shadow-lg w-[400px] rounded-lg p-6 h-fit">
        <h2 className="text-2xl philosopher-bold  font-semibold  text-gray-800 mb-4">Latest Posts</h2>
        <div className="space-y-6">
          {latestBlogs.map((latestBlog) => (
            <Link
              to={`/blog/${latestBlog._id}`}
              key={latestBlog._id}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-100 transition duration-200"
            >
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}${latestBlog.image.url}`}
                alt={latestBlog.name}
                className="w-20 h-20 object-cover  border border-gray-200 shadow-md rounded-lg"
              />
              <div>
                <h3 className="text-base font-medium text-gray-900">{latestBlog.name}</h3>
                <p className="text-sm text-gray-500">Published on 04 Sep 2024</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
