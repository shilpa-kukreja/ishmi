import React, { useState } from 'react';
import { assets } from '../assets/assets';

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'What makes ishmibeautyfoodproducts different from others?',
      answer: ' Our products are rooted in Ayurveda and made using 100% natural, herbal, and chemical-free ingredients. We focus on internal wellness and external beauty by using time-tested herbs that nourish the body from within.'
    },
    {
      question: 'Are your products safe for all skin types and ages?',
      answer: ' Yes, our formulations are gentle, natural, and suitable for most skin types. However, we always recommend doing a patch test and consulting your doctor if you have sensitive skin or any medical condition.'
    },
    {
      question: 'Are ishmibeautyfoodproducts completely chemical-free?',
      answer: ' Absolutely. We do not use any synthetic chemicals, artificial fragrances, or preservatives. Every product is crafted with pure, plant-based ingredients.'
    },
    {
      question: 'Do you offer international shipping?',
      answer: ' Currently, we are focused on shipping within India. However, we are working on expanding our reach, and international shipping will be available soon. Stay tuned!'
    },
    {
      question: 'How do I place an order?',
      answer: ' You can place your order directly through our Instagram page or our official website (coming soon). Just DM us on Instagram or email us for assistance.'
    },
    {
      question: 'Can I return or exchange a product?',
      answer: ' Due to the nature of our herbal products, we do not offer returns once the product is opened. However, if you receive a damaged or incorrect item, please contact us within 48 hours of delivery, and we’ll be happy to help'
    }
  ];

  return (
    <div className="w-full mx-auto  ">
      <img src={assets.faq} alt="" />
      <h2 className="text-4xl font-bold text-center pt-5 mb-10">Help & Support</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 pb-10 px-10   gap-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b pb-4">
            <button 
              className="w-full text-left flex items-center justify-between py-3 text-lg font-semibold focus:outline-none transition duration-300 ease-in-out hover:text-blue-600" 
              onClick={() => toggleAnswer(index)}
            >
              <span>{faq.question}</span>
              <span className="text-xl font-bold">{activeIndex === index ? '-' : '+'}</span>
            </button>
            {activeIndex === index && (
              <p className="mt-2 text-gray-700 leading-relaxed transition duration-300 ease-in-out">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQs;
