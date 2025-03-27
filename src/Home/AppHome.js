import React, { useState, useEffect, useRef } from "react";
import "./AppHome.css"; // Create this file for styling
import SolanaLogoSvg from "../Vendor Components/SolanaLogoSvg";
import { fetchTokens } from "../Vendor Components/Shared";
import VendorApp from "../Vendor Components/VendorApp";
import { FaHome, FaQuestionCircle, FaDollarSign } from "react-icons/fa";
import TokenTicker from "./TokenTicker";
import SideMenu from "./SideMenu";
import MapComponent from "../MapComponents/MapComponent";

const AppHome = ({ autoRoute = false }) => {
  const [selectedRoute, setSelectedRoute] = useState(false);
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [fetchedTokens, setFetchedTokens] = useState(false);
  const optionsRef = useRef(null);
  const menuRef = useRef(null);
  const menuItems = {
    Home: { icon: <FaHome /> },
    "How it works": { icon: <FaQuestionCircle /> },
    "VEND Token": { icon: <FaDollarSign /> },
  };

  const toggleOptions = () => {
    setIsMenuActive(!isMenuActive);
  };

  const handleClickOutside = (event) => {
    if (
      optionsRef.current &&
      !optionsRef.current.contains(event.target) &&
      menuRef.current &&
      !menuRef.current.contains(event.target)
    ) {
      setIsMenuActive(false);
    }
  };
  console.log(fetchedTokens);
  useEffect(() => {
    fetchTokens(setFetchedTokens);
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleMenuSelection = (key, index) => {
    if (key === "Home") {
      window.location.href = "https://solvend.fun";
    }
    console.log(`Menu item ${key} was clicked!`);
  };

  if (selectedRoute) {
    return (
      <>
        {selectedRoute}
        <div
          onClick={toggleOptions}
          className="menu-icon absolute"
          ref={menuRef}
          style={{ color: isMenuActive ? "black" : "white" }}
        >
          &#9776;
        </div>
        {isMenuActive && (
          <SideMenu
            menuItems={menuItems}
            optionsRef={optionsRef}
            handleMenuSelection={handleMenuSelection}
          />
        )}
      </>
    );
  } else if (autoRoute) {
    return (
      <>
        {<VendorApp setSelectedRoute={setSelectedRoute} />}
        <div
          onClick={toggleOptions}
          className="menu-icon absolute"
          ref={menuRef}
          style={{ color: isMenuActive ? "black" : "white" }}
        >
          &#9776;
        </div>
        {isMenuActive && (
          <SideMenu
            menuItems={menuItems}
            optionsRef={optionsRef}
            handleMenuSelection={handleMenuSelection}
          />
        )}
      </>
    );
  } else {
    return (
      <>
        <div className="app-home geist-geist-font">
          <div className="top-section">
            <div className="header">
              <div
                onClick={toggleOptions}
                className="menu-icon"
                ref={menuRef}
                style={{ color: isMenuActive ? "black" : "white" }}
              >
                &#9776;
              </div>
              <div className="logo">
                <img src="/Vend-Logo.png" width="140px" />
              </div>
              <div className="sol-logo">
                <SolanaLogoSvg />
              </div>
            </div>

            <div
              className="vendor-portal"
              onClick={() =>
                setSelectedRoute(() => (
                  <VendorApp setSelectedRoute={setSelectedRoute} />
                ))
              }
            >
              <div className="vendor-portal-text">VEND</div>
              <div className="vendor-portal-subtext">Log In Take Payments</div>
            </div>

            <div className="buy">
              <div className="buy-text">BUY</div>
              <div className="buy-subtext">Use Solana tokens for purchases</div>
            </div>              
            <div className="vendor-map"
             onClick={() =>
              setSelectedRoute(() => (
                <MapComponent setSelectedRoute={setSelectedRoute} />
              ))
            }
            >
              <div className="vendor-map-text">MAP</div>
              <div className="vendor-map-subtext">
                Find new places to pay with Solana
              </div>
            </div>

            <div className="store">
              <div className="store-text">STORE</div>
              <div className="store-subtext">Sol Vend Merchandise</div>
            </div>
          </div>

          {/* About Us Section */}
          <div className="about-us-section">
            <div className="about-us-title">About us</div>
            <div className="about-us-text">
              At Sol Vend, our mission is to revolutionize everyday financial
              interactions by making cryptocurrency accessible, intuitive, and
              practical for everyone. We are dedicated to empowering individuals
              with seamless payment solutions built on the Solana blockchain,
              enabling fast, secure, and cost-effective transactions for both
              mainstream users and meme coin enthusiasts. By bridging the gap
              between cutting-edge blockchain technology and real-world
              usability, we strive to create a future where sending and
              receiving crypto payments is as simple and commonplace as using
              traditional money. Together, we’re building a more inclusive
              financial ecosystem—one transaction at a time.
            </div>
            <button className="read-more-button">READ MORE</button>
          </div>
          <div className="about-us-title">Accepted Tokens...</div>
          <div>{fetchedTokens && <TokenTicker tokens={fetchedTokens} />}</div>

          {/* Contact Section */}
          <div className="contact-section">
            <div className="contact-option">
              <span className="contact-icon">&#9742;</span> {/* Phone icon */}
              <div className="contact-text">Call us</div>
            </div>
            <div className="contact-option">
              <span className="contact-icon">&#9993;</span> {/* SMS icon */}
              <div className="contact-text">Send SMS</div>
            </div>
            <div className="contact-option">
              <span className="contact-icon">
                <i className="fab fa-facebook-f"></i>
              </span>
              <div className="contact-text">Facebook</div>
            </div>
            <div className="contact-option">
              <span className="contact-icon">
                <i className="fab fa-instagram"></i>
              </span>
              <div className="contact-text">Instagram</div>
            </div>
          </div>
        </div>
        {isMenuActive && (
          <SideMenu
            menuItems={menuItems}
            optionsRef={optionsRef}
            handleMenuSelection={handleMenuSelection}
          />
        )}
      </>
    );
  }
};

export default AppHome;
