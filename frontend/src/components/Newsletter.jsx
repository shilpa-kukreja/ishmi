import React, { useState } from "react";
import axios from "axios";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = async () => {
    try {
      const response = await axios.post("https://ishmiherbal.com/api/subscribe", { email });
      alert(response.data.message);
      setEmail("");
    } catch (error) {
      alert(error.response?.data?.message || "Subscription failed");
    }
  };

  return (
    <div className="bg-[#DFC4A6]  py-10 flex flex-col items-center text-center space-y-6">
      <h2 className="sm:text-4xl text-3xl font-bold text-white drop-shadow-lg">Join the ISHMI Club!</h2>
      <div className="flex flex-row gap-3 bg-white px-4 py-2 rounded-full shadow-lg">
        <input
          className="px-6 py-3 sm:w-80 w-48 text-black border-none outline-none rounded-full text-lg"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleSubscribe}
          className="sm:px-6 px-4 sm:py-3 py-2 text-base sm:text-lg bg-[#8f6943] hover:bg-[#a78767]  cursor-pointer text-white font-semibold rounded-full shadow-md  transition duration-300"
        >
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default Newsletter;
