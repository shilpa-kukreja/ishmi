import React, { useRef } from 'react';
import { assets } from '../assets/assets';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Images = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      if (direction === 'left') {
        scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className='sm:px-8 px-5 py-8 bg-[#FEF0E1] space-y-5 text-center'>
      
      <div className='space-y-3'>
        <p className='text-base font-semibold text-gray-700'>Embrace The Timeless</p>
        <p className='text-3xl font-semibold font-serif text-gray-900'>Glow Of Nature With Ishmi Beauty Food</p>
      </div>

      
      <div className='relative flex items-center justify-center'>
        <button onClick={() => scroll('left')} className='absolute left-0 p-3 bg-gray-300 rounded-full shadow-md hover:bg-gray-400 transition'>
          <FaArrowLeft className='text-xl text-white' />
        </button>

        <div ref={scrollRef} className='flex flex-row gap-4 overflow-x-auto scrollbar-hide scroll-smooth w-[80%] mx-auto'>
          {[assets.slider1, assets.slider2, assets.slider3, assets.slider4].map((src, index) => (
            <img key={index} className='w-full h-[320px] rounded-xl shadow-lg object-cover' src={src} alt={`Slide ${index + 1}`} />
          ))}
        </div>

        <button onClick={() => scroll('right')} className='absolute right-0 p-3 bg-gray-300 rounded-full shadow-md hover:bg-gray-400 transition'>
          <FaArrowRight className='text-xl text-white' />
        </button>
      </div>
    </div>
  );
};

export default Images;
