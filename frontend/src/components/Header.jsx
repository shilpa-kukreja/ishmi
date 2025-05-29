import React from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Desktop banners
import banner1 from "../assets/banner/1.jpg";
import banner2 from "../assets/banner/2.jpg";
import banner3 from "../assets/banner/3.jpg";

// Mobile banners
import pbanner4 from "../assets/banner/4.webp";
import pbanner5 from "../assets/banner/5.webp";
import pbanner6 from "../assets/banner/6.webp";

const Header = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div className="w-full bg-[#FEF0E1] overflow-hidden">
      <Slider {...settings} className="w-full">
        {[ 
          { desktop: banner1, mobile: pbanner4 },
          { desktop: banner2, mobile: pbanner5 },
          { desktop: banner3, mobile: pbanner6 },
        ].map((slide, index) => (
          <div key={index}>
            <img
              src={slide.desktop}
              alt={`Desktop Banner ${index + 1}`}
              className="w-full object-cover !hidden sm:!block"
            />
            <img
              src={slide.mobile}
              alt={`Mobile Banner ${index + 1}`}
              className="w-full object-cover !block sm:!hidden"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Header;
