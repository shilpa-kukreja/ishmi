import React from 'react';
import { assets } from '../assets/assets';

const Information = () => {
  return (
    <div className='sm:px-16 px-2 bg-[#FEF0E1] py-12 flex sm:flex-row flex-col items-center  gap-16 '>
      
      <div className='flex flex-col sm:flex-row  sm:gap-4 gap-2'>
        <img className=' sm:w-[280px] w-[330px] sm:h-[350px] h-[300px] rounded-xl shadow-lg object-cover' src={assets.B12} alt='Skincare Image 1' />
        <img className=' sm:w-[280px] w-[330px] sm:h-[350px] h-[300px] rounded-xl shadow-lg object-cover' src={assets.B13} alt='Skincare Image 2' />
      </div>
     
      
      <div className='sm:w-[500px] w-[400px] px-8 space-y-3'>
        <p className='text-lg text-gray-600 font-serif tracking-wide'>Honoring Ayurveda’s Legacy</p>
        <h1 className='text-3xl font-bold font-serif text-gray-800 leading-tight'>
        Pure Ayurvedic Care for Skin, Health & Indulgence
        </h1>
        <p className='sm:text-sm   text-gray-600 leading-relaxed'>
        At ISHMI, we craft pure, plant-based skincare rooted in ancient wisdom. Our gentle, chemical-free formulas are designed for all ages, blending tradition with modern care for healthy, radiant skin.
        </p>
        <button className='px-6 py-3 bg-[#8f6943] hover:bg-[#a78767] text-white font-semibold rounded-xl shadow-md cursor-pointer transition duration-300'>
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default Information;
