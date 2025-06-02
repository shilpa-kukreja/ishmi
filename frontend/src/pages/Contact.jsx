import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from 'react-toastify';
import { assets } from "../assets/assets";

const Contact = () => {
  const [result, setResult] = React.useState(" ")

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending...")

    const formData = new FormData(event.target);
    const data = {
      name: formData.get("Name"),
      email: formData.get("Email"),
      message: formData.get("Message")

    }

    try {
      const response = await fetch("https://ishmiherbal.com/api/contact/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json();
      if (result.success) {
        setResult(" ");
        toast.success("Form Submitted Successfully");
        event.target.reset();
      } else {
        toast.error(result.message || "Submission Failed");
        setResult("");
      }
    } catch (error) {
      console.error("Error submitting form", error);
      toast.error("An error occurred while submitting the form");
      setResult("");
    }
  }
  return (
    <div className="min-h-screen bg-[#FEF0E1] ">
      {/* Banner Image */}
      <img
        className="w-full  object-cover shadow-lg"
        src={assets.Contact}
        alt="Contact Banner"
      />

      <div className="max-w-7xl mx-auto text-center mt-12">
        {/* Contact Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className=" text-[#c2905c] sm:py-3 py-1 px-10  "
        >
          <h1 className="sm:text-5xl text-3xl font-extrabold mb-4">Connect With ISHMI</h1>
          <p className="sm:text-lg text-black text-base   sm:max-w-3xl mx-w-4xl mx-auto">
            Thank you for your interest in Ishmi Beauty Food.
            We’re always happy to connect with our community of wellness and beauty seekers.
            Whether you have questions about our herbal products, want to learn more about ingredients, need help with your order, or are interested in collaborating—we’re just a message away.

          </p>
        </motion.div>

        {/* Contact Information */}
        <div className="sm:mt-10 mt-10 px-5 grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-10">
          {[
            {
              icon: <Mail className="sm:w-12 sm:h-12 w-8 h-8 text-[#c2905c]" />, title: "Email", info: "support@ecommerce.com",
            },
            {
              icon: <Phone className="sm:w-12 sm:h-12 w-8 h-8 text-[#c2905c]" />, title: "Phone", info: "+91  6261775040",
            },
            {
              icon: <MapPin className="sm:w-12 sm:h-12 w-8 h-8 text-[#c2905c]" />, title: "Location", info: "Address Plot no. 234/1/31, Bajrangpura, Chhota Bangarda, Industrial Area, Indore",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white sm:p-8 p-4 rounded-lg shadow-lg flex flex-col items-center space-y-4 hover:scale-105 transition-transform"
            >
              {item.icon}
              <h3 className="text-2xl font-semibold text-gray-900">{item.title}</h3>
              <p className="text-gray-600 text-lg">{item.info}</p>
            </motion.div>
          ))}
        </div>

        {/* Contact Form & Map */}
        <div className="flex flex-col lg:flex-row items-center justify-center  gap-12 sm:px-6 px-5 sm:py-10 py-10 bg-[#FEF0E1] sm:mt-16 mt-10  sm:rounded-xl rounded-2xl shadow-lg">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white p-10 sm:rounded-2xl rounded-none shadow-md w-full sm:max-w-lg"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">Get in Touch</h2>
            <p className="text-gray-600 text-center mb-6">
              Have any questions? Send us a message, and we’ll respond promptly.
            </p>
            <form onSubmit={onSubmit} className="space-y-5">
              <input
                type="text"
                name="Name"
                placeholder="Your Name"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-lg"
                required
              />
              <input
                type="email"
                name="Email"
                placeholder="Your Email"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-lg"
                required
              />
              <textarea
                name="Message"
                placeholder="Your Message"
                rows="5"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-lg"
                required
              ></textarea>
              <button
                type="submit"
                className="w-full bg-[#c2905c] text-white py-4 rounded-lg hover:opacity-90 transition-all text-lg font-semibold shadow-md"
              >
                Send Message
              </button>
              {result && <p className="text-center text-gray-600 mt-2">{result}</p>}
            </form>

          </motion.div>

          {/* Google Maps Embed */}
          <div className="w-full max-w-lg sm:rounded-2xl rounded-none overflow-hidden shadow-md">
            <iframe
              className="w-[600px] h-[600px] rounded-none sm:rounded-2xl"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.9842892314214!2d-74.00601518459458!3d40.71277577933051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sGoogle!5e0!3m2!1sen!2sus!4v1635151242120!5m2!1sen!2sus"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
