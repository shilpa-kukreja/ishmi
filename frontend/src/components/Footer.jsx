import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

const Footer = () => {
  const [openSections, setOpenSections] = useState({
    usefulLinks: false,
    helpCenter: false,
    knowledge: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const links = [
    { name: 'My Account', path: '/loginsignup' },
    { name: 'Our Products', path: '/shop' },
    { name: 'My Cart', path: '/cart' },
    { name: 'My Wishlist', path: '/wishlist' },
  ];

  return (
    <footer className="text-[#8f6943] shadow py-12 px-6 md:px-16 bg-[url('assets/footer.jpg')] bg-cover bg-center bg-no-repeat relative">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Info (always visible) */}
        <div className="space-y-4">
          <NavLink to='/'>
            <img
              src={assets.S2}
              alt="Logo"
              className="w-[140px]"
            />
          </NavLink>
          <p className="text-sm leading-relaxed pt-4">
            Rooted in Ayurveda, we craft luxurious skincare, potent remedies, and healing chocolates—pure, natural, and made with love for your skin and soul.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="hover:opacity-75 transition">
              <img className="w-7" src="https://img.icons8.com/?size=100&id=uLWV5A9vXIPu&format=png&color=ffffff" alt="Facebook" />
            </a>
            <a href="#" className="hover:opacity-75 transition">
              <img className="w-7" src="https://img.icons8.com/?size=100&id=BrU2BBoRXiWq&format=png&color=ffffff" alt="Instagram" />
            </a>
            <a href="#" className="hover:opacity-75 transition">
              <img className="w-7" src="https://img.icons8.com/?size=100&id=19318&format=png&color=ffffff" alt="Twitter" />
            </a>
          </div>
        </div>

        {/* Mobile Accordion Sections */}
        <div className="md:hidden">
          {/* Useful Links Accordion */}
          <div className="border-b border-[#8f6943] pb-2 mb-4">
            <button 
              onClick={() => toggleSection('usefulLinks')}
              className="w-full flex justify-between items-center philosopher-bold"
            >
              <h2 className="text-lg font-semibold text-[#8f6943]">Useful Links</h2>
              <span className="text-xl">
                {openSections.usefulLinks ? '−' : '+'}
              </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openSections.usefulLinks ? 'max-h-96' : 'max-h-0'}`}>
              <ul className="space-y-2 text-sm pt-2 pl-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        `block py-1 transition cursor-pointer hover:text-[#5c442c] ${isActive ? "font-bold text-[#5c442c]" : "text-[#8f6943]"}`
                      }
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Help Center Accordion */}
          <div className="border-b border-[#8f6943] pb-2 mb-4">
            <button 
              onClick={() => toggleSection('helpCenter')}
              className="w-full flex justify-between items-center philosopher-bold"
            >
              <h2 className="text-lg font-semibold text-[#8f6943]">Help Center</h2>
              <span className="text-xl">
                {openSections.helpCenter ? '−' : '+'}
              </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openSections.helpCenter ? 'max-h-96' : 'max-h-0'}`}>
              <ul className="space-y-2 text-sm pt-2 pl-4">
                {['About Us', 'Blogs', 'FAQs', 'Contact Us'].map((link) => (
                  <li key={link}>
                    <NavLink 
                      to={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block py-1 hover:text-[#5c442c] cursor-pointer transition"
                    >
                      {link}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Knowledge Accordion */}
          <div className="border-b border-[#8f6943] pb-2 mb-4">
            <button 
              onClick={() => toggleSection('knowledge')}
              className="w-full flex justify-between items-center philosopher-bold"
            >
              <h2 className="text-lg font-semibold text-[#8f6943]">Knowledge</h2>
              <span className="text-xl">
                {openSections.knowledge ? '−' : '+'}
              </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openSections.knowledge ? 'max-h-96' : 'max-h-0'}`}>
              <ul className="space-y-2 text-sm pt-2 pl-4">
                {['Terms & Conditions', 'Privacy Policy', 'Return & Refund Policy', 'Shipping Policy'].map((link) => (
                  <li key={link}>
                    <NavLink 
                      to={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block py-1 hover:text-[#5c442c] cursor-pointer transition"
                    >
                      {link}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Desktop Sections (hidden on mobile) */}
        <div className="hidden md:block philosopher-bold">
          <h2 className="text-lg font-semibold text-[#8f6943] mb-3">Useful Links</h2>
          <ul className="space-y-2 text-sm">
            {links.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `transition cursor-pointer hover:text-[#5c442c] ${isActive ? "font-bold text-[#5c442c]" : "text-[#8f6943]"}`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden md:block philosopher-bold">
          <h2 className="text-lg font-semibold text-[#8f6943] mb-3">Help Center</h2>
          <ul className="space-y-2 text-sm">
            {['About Us', 'Blogs', 'FAQs', 'Contact Us'].map((link) => (
              <li key={link}>
                <NavLink 
                  to={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                  className="hover:text-[#5c442c] cursor-pointer transition block py-1"
                >
                  {link}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden md:block philosopher-bold">
          <h2 className="text-lg font-semibold text-[#8f6943] mb-3">Knowledge</h2>
          <ul className="space-y-2 text-sm">
            {['Terms & Conditions', 'Privacy Policy', 'Return & Refund Policy', 'Shipping Policy'].map((link) => (
              <li key={link}>
                <NavLink 
                  to={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                  className="hover:text-[#5c442c] cursor-pointer transition block py-1"
                >
                  {link}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <hr className="my-8 border-gray-700" />

      <div className="text-center philosopher-bold text-sm">
        <p className="text-[#8f6943]">© {new Date().getFullYear()} ISHMI. All rights reserved.</p>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
        {/* Call Button */}
        <a 
          href="tel:0000000" 
          className="btn-pulse bg-[#8f6943] hover:bg-[#5c442c] w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110"
          aria-label="Call Now"
        >
          <img
            src="https://img.icons8.com/ios-filled/50/ffffff/phone.png"
            alt="Call Icon"
            className="w-6 h-6"
          />
        </a>

       {/* WhatsApp Button */}
<a href="//wa.me/0000000" className="btn-pulse btn-whatsapp" aria-label="Chat on WhatsApp">
  <img
    src="https://img.icons8.com/ios-filled/50/ffffff/whatsapp--v1.png"
    alt="WhatsApp Icon"
    className="pulse-icon"
  />
</a>
      </div>
    </footer>
  );
};

export default Footer;