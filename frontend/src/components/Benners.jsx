import React from "react";
import { assets } from "../assets/assets";

const Banners = () => {
  return (
    <div className=" text-black relative text-center shadow-lg">
      <img className="w-full relative h-14" src={assets.S1} alt="" />
      <p className="text-lg absolute   font-medium tracking-wide">
      
        🎉 Buy Any <span className="font-bold">4</span> @ 
        <span className="text-2xl font-extrabold ml-1">₹799</span> 🎉
      </p>
    </div>
  );
};

export default Banners;
