import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation  } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { assets } from "../assets/assets";

const Video = () => {
  const videoSources = [
    assets.video1,
    assets.video2,
    assets.video3,
    assets.video4,
    assets.video5,
  ];

  return (
    <div className="bg-[#FEF0E1] p-4">
      {/* Mobile Swiper Slider */}
      <div className="sm:hidden">
        <Swiper
          modules={[Pagination, Autoplay, Navigation ]}
          spaceBetween={16}
          
          slidesPerView={1.4}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          className="pb-6"
        >
          {videoSources.map((src, index) => (
            <SwiperSlide key={index}>
              <div className="rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-2xl transition-shadow duration-300">
                <video
                  src={src}
                  className="w-full object-cover rounded-t-lg"
                  autoPlay
                  loop
                  muted
                ></video>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop Grid Layout */}
      <div className="hidden sm:grid max-w-7xl mx-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
        {videoSources.map((src, index) => (
          <div
            key={index}
            className="w-full rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-2xl transition-shadow duration-300"
          >
            <video
              src={src}
              className="w-full object-cover rounded-t-lg"
              autoPlay
              loop
              muted
            ></video>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Video;
