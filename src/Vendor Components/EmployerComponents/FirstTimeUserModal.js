import React, { useState } from "react";
import { FaPaintBrush, FaTasks, FaCogs, FaTrophy } from "react-icons/fa";
import "./FirstTimeUserModal.css"; // Import the CSS file

const FirstTimeUserModal = () => {
  const [slide, setSlide] = useState(1);
  const [showModal, setShowModal] = useState(true);

  const nextSlide = () => {
    document.querySelector(".modal-content > div > h2").style.animation =
      "none";
    document.querySelector(".modal-content > div > h2").style.width = "0px";
    setTimeout(() => {
      document.querySelector(".modal-content > div > h2").style.animation =
        "typing 2.5s forwards";
    }, 250);
    setSlide(slide + 1);
  };

  const prevSlide = () => {
    setSlide(slide - 1);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (!showModal) {
    return null;
  }

  let content;

  switch (slide) {
    case 1:
      content = (
        <div>
          <h2>Design Your Customer Interface</h2>
          <span>
            <FaPaintBrush className="icon" style={{ animationDelay: "1s" }} />
          </span>
          <p>
            Welcome to VEND! With our platform, you have the freedom to design
            the interface that your customers will see. Personalize the look and
            feel to match your brand and create a seamless experience for your
            customers.
          </p>
        </div>
      );
      break;
    case 2:
      content = (
        <div>
          <h2>Customize Your Employee Interface</h2>
          <span>
            <FaTasks className="icon" style={{ animationDelay: "1s" }} />
          </span>
          <p>
            You can also set up the interface that your employees or authorized
            team members will use to create and fulfill customer orders.
            Streamline their workflow and make it easy for them to manage
            transactions.
          </p>
        </div>
      );
      break;
    case 3:
      content = (
        <div>
          <h2>Manage Your Settings</h2>
          <span>
            <FaCogs className="icon" style={{ animationDelay: "1s" }} />
          </span>
          <p>
            Remember, you can always change your employee/team member settings,
            payment preferences, and login details from this menu. Keep your
            account secure and up-to-date.
          </p>
        </div>
      );
      break;
    case 4:
      content = (
        <div>
          <h2>Thank You for Joining VEND!</h2>
          <span>
            <FaTrophy className="icon" style={{ animationDelay: "1s" }} />
          </span>
          <p>
            We appreciate you choosing VEND to power your payment system. We're
            here to support you every step of the way!
          </p>
        </div>
      );
      break;
    default:
      content = null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="logo-wrapper">
          <img src="./Vend-Logo.jpg" />
        </div>
        {content}

        <div className="button-container">
          {slide > 1 && (
            <button className="vendor-add-button-styles" onClick={prevSlide}>
              Previous
            </button>
          )}
          {slide < 4 ? (
            <button className="vendor-add-button-styles" onClick={nextSlide}>
              Next
            </button>
          ) : (
            <button className="vendor-add-button-styles" onClick={closeModal}>
              Get Started!
            </button>
          )}
        </div>

        <button className="skip-button" onClick={closeModal}>
          Skip
        </button>
      </div>
    </div>
  );
};

export default FirstTimeUserModal;
