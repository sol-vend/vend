import React from "react";
import CameraAccessEntry from "./CameraAccessEntry";
import QRScannerWithFocusBox from "./QRScannerWithFocusBox";
import HeaderWrapper from "../Vendor Components/HeaderWrapper";
import "./BuyHome.css";
import SolanaLogoSvg from "../Vendor Components/SolanaLogoSvg";

const BuyHome = () => {
  return (
    <>
      <HeaderWrapper />
      <div className="opt-descr">
        <p>
          Optimized for <strong className="sweep-text">Phantom</strong> Wallet
        </p>
        <SolanaLogoSvg />
      </div>
      <p style={{textAlign:'center'}}>Having Problems? Try scanning with your camera app.</p>

      <>
        <CameraAccessEntry>
          <QRScannerWithFocusBox />
        </CameraAccessEntry>
      </>
    </>
  );
};

export default BuyHome;
