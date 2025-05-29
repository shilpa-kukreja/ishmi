import React from "react";
import { FaStar } from "react-icons/fa"; 

const Banner = () => {
  return (
    <div className="bg-[#8f6943] py-5 relative  overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee space-x-8 text-white text-lg font-semibold tracking-wide">
        
        {[...Array(15)].map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <FaStar className="text-yellow-400 text-xl" />
            <span>Be You, Be Moody</span>
            <FaStar className="text-yellow-400 text-xl" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banner;
