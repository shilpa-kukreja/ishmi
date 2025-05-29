import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { FiLock, FiMail } from "react-icons/fi";
import { assets } from "../assets/assets";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${backendUrl}/api/auth/admin`, { email, password });
      if (response.data.success) {
        setToken(response.data.token);
        toast.success("Login successful!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-3xl flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300">
       
        <div className="hidden md:block md:w-1/2 h-[500px]">
          <img src={assets.s3} alt="Illustration" className="w-full h-full object-cover" />
        </div>

       
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
         
          <div className="flex justify-center mb-6">
            <img
              src={assets.S}
              alt="Logo"
              className="w-28"
            />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Admin Login</h1>
          <form onSubmit={onSubmitHandler} className="space-y-5">
            
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="pl-12 pr-4 py-3 w-full rounded-md border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500"
                type="email"
                placeholder="Email Address"
                required
              />
            </div>

            
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="pl-12 pr-4 py-3 w-full rounded-md border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500"
                type="password"
                placeholder="Password"
                required
              />
            </div>

            
            <button
              className="w-full py-3 rounded-md text-white bg-[#743B32] transition-all transform hover:scale-105 duration-300 font-semibold shadow-md"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
