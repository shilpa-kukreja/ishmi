import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50  ">

        <img  
              className="w-full  object-cover shadow-lg"
              src={assets.TOPBANNER}
              alt="Contact Banner"
            />


      <div className="w-full mx-auto  text-center">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-[#c2905c] text-white p-12  shadow-lg"
        >
          <h1 className="sm:text-5xl text-3xl font-extrabold mb-4">About Us</h1>
          <p className="sm:text-lg text-base max-w-3xl mx-auto">
           At Ishmi Beauty Food, we believe true beauty begins from within—and nature holds the key. Inspired by the ancient wisdom of Ayurveda, our mission is to bring you herbal, natural, and chemical-free products that support both inner wellness and outer glow.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 px-6"
        >
          <h2 className="sm:text-3xl text-2xl font-semibold text-gray-800">Our Mission</h2>
          <p className="sm:text-lg text-base text-gray-600 max-w-3xl mx-auto mt-4">
            Our mission is to revolutionize online shopping by offering high-quality products, exceptional customer service, and a hassle-free experience.
          </p>
        </motion.div>

        {/* Why Choose Us Section */}
        <div className="mt-12 grid grid-cols-1 px-6 md:grid-cols-3 gap-8">
          {[
            { title: "🛍️ Wide Product Range", desc: "From fashion to electronics, we have everything you need in one place." },
            { title: "🚚 Fast & Secure Delivery", desc: "We ensure quick and safe delivery, right to your doorstep." },
            { title: "⭐ Trusted by Thousands", desc: "Thousands of happy customers trust us for their shopping needs." }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
              className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition"
            >
              <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
              <p className="text-gray-600 mt-2">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16"
        >
          <h2 className="sm:text-3xl text-2xl font-semibold text-gray-800">Get in Touch</h2>
          <p className="sm:text-lg text-base text-gray-600 max-w-3xl mx-auto mt-4">
            Have any questions? We'd love to hear from you. Reach out to us anytime!
          </p>
          <Link
            to="/contact us"
            className="mt-6 mb-6  inline-block bg-[#D4A373] text-white px-6 py-3 rounded-md text-lg font-medium  transition"
          >
            Contact Us
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
