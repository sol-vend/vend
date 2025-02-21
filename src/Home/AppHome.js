import React, { useState } from 'react';
import './AppHome.css'; // Create this file for styling
import SolanaLogoSvg from '../Vendor Components/SolanaLogoSvg';
import EmployeeLogin from '../Vendor Components/EmployeeComponents/EmployeeLogin';



const AppHome = () => {

    const [selectedRoute, setSelectedRoute] = useState(false);

    if (selectedRoute) {
        return (
            <>
                {selectedRoute}
            </>
        );
    } else {
        return (
            <div className="app-home">
                <div className="top-section">
                    <div className="header">
                        <div className="menu-icon">&#9776;</div>
                        <div className="logo">Sol Vend</div>
                        <div className='sol-logo'><SolanaLogoSvg /></div>
                    </div>


                    <div className="vendor-portal" onClick={()=> setSelectedRoute(<EmployeeLogin />)}>
                        <div className="vendor-portal-text">VENDOR PORTAL</div>
                        <div className="vendor-portal-subtext">Log In Take Payments</div>
                    </div>


                    <div className="vendor-map">
                        <div className="vendor-map-text">VENDOR MAP</div>
                        <div className="vendor-map-subtext">Find new places to pay with Solana</div>
                    </div>


                    <div className="packages">
                        <div className="packages-text">PACKAGES</div>
                        <div className="packages-subtext">Become A Vendor</div>
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
                    At Sol Vend, our mission is to revolutionize everyday financial interactions by making cryptocurrency accessible, intuitive, and practical for everyone. We are dedicated to empowering individuals with seamless payment solutions built on the Solana blockchain, enabling fast, secure, and cost-effective transactions for both mainstream users and meme coin enthusiasts. By bridging the gap between cutting-edge blockchain technology and real-world usability, we strive to create a future where sending and receiving crypto payments is as simple and commonplace as using traditional money. Together, we’re building a more inclusive financial ecosystem—one transaction at a time.
                    </div>
                    <button className="read-more-button">READ MORE</button>
                </div>


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
        );
    }
}


export default AppHome;
