import React from "react";

const Headers = () => {
  return (
    <div className="flex bg-[#FEF0E1] flex-col items-center    text-center space-y-6 px-6 py-12 ">
      {/* Main Heading */}
      <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
      Welcome To{" "}
        <span className="bg-[#8f6943]  text-transparent bg-clip-text">
          ISHMI – Beauty That Heals
        </span>
      </h1>

      {/* Description Section */}
      <div className="max-w-2xl text-lg text-gray-700 leading-relaxed">
        <p className="text-sm text-gray-800">
        Rooted in Ancient Ayurveda and crafted by experts, ISHMI offers skincare and wellness products that nourish, heal, and restore.
        </p>
        <p className="mt-2">
          <span className="font-semibold text-gray-900">Healing You,</span>{" "}
          <span className="font-semibold text-gray-900">Naturally,</span>{" "}
          <span className="font-semibold text-gray-900">
          Every Day, Because You Deserve True Ayurveda.
          </span>
        </p>
      </div>

      {/* Call to Action */}
      <p className="text-xl font-medium text-gray-900 italic">
      Be radiant.<span className="text-[#8f6943] font-bold">Be nourished.</span>{" "}
        <span className="text-[#8f6943] font-bold">Be ISHMI!</span>
      </p>
    </div>
  );
};

export default Headers;
