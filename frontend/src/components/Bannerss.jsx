import React from "react";
import { assets } from "../assets/assets";

const Bannerss = () => {
  return (
    <div className=" py-12    bg-[#FEF0E1] relative w-full flex justify-center items-center ">

      
    <div className="w-full max-w-6xl aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-black">
      
   

      <video  className="w-full h-full object-cover"
        src={assets.video}
        type="video/mp4"
        autoPlay
        loop
        playsInline
        muted
       
      ></video>
       </div>

    </div>
  );
};

export default Bannerss;
