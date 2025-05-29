import React from "react";

const WhatsAppChatButton = () => {
  const whatsappLink =
    "https://wa.me/919335162135";

  return (
    <div className="whatsapp-chat-container">
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-chat-button"
      >
        <img
          src="https://img.icons8.com/color/48/whatsapp.png"
          alt="WhatsApp"
          className="whatsapp-icon"
        />
       
      </a>

      <style jsx>{`
        .whatsapp-chat-container {
          position: fixed;
          bottom: 20px;
          right: 90px;
          z-index: 1000;
        }

        .whatsapp-chat-button {
          display: flex;
          align-items: center;
          background-color: #25d366;
          color: white;
          padding: 10px 10px;
          border-radius: 100%;
          text-decoration: none;
          font-size: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: background-color 0.3s ease;
        }

        .whatsapp-chat-button:hover {
          background-color: #1ebe5b;
        }

        .whatsapp-icon {
          margin: 5px;
        }
      `}</style>
    </div>
  );
};

export default WhatsAppChatButton;