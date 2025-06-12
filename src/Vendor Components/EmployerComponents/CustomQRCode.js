import React from "react";
import QRCode from "react-qr-code"; // Import react-qr-code library
import './CustomQRCode.css'

// CustomQRCode component using react-qr-code library
const CustomQRCode = ({ data }) => {

console.log(data);
  return (
    <div className="customer-facing-qr-code-container">
      <QRCode value={data} size={275} fgColor="white" bgColor="black" level="H"/>
        <img src={"/vend_qr.png"} alt="logo" className="centered-qr-logo-image" />
    </div>
  );
};

export default CustomQRCode;
