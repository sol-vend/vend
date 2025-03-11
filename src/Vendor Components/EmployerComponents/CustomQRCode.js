import QRCodeStyling from "qr-code-styling";
import React, { useEffect, useRef, useState } from "react";

function CustomQRCode({ data, parentRef }) {
  const qrCodeRef = useRef(null);
  const [isGenerated, setIsGenerated] = useState(false);
  console.log(isGenerated);

  useEffect(() => {
    if (!isGenerated) {
      setIsGenerated(true);
      if (parentRef.current) {
        parentRef.current.innerHTML = ""; // Clear the wrapper element
      }

      // Create a new QR code instance
      const qrCode = new QRCodeStyling({
        width: 150,
        height: 150,
        data: data,
        image: "vend_qr.png", // Use the imageUrl prop for dynamic image if needed
        dotsOptions: {
          color: "white",
          type: "rounded",
        },
        backgroundOptions: {
          color: "black",
        },
        imageOptions: {
          crossOrigin: "anonymous",
          size: 100, // You can adjust this value to make the logo size bigger/smaller
        },
      });

      // Append the QR code to the ref element
      qrCode.append(qrCodeRef.current);

      // Also append the qrCodeRef's div to the parent wrapper
      if (parentRef.current) {
        parentRef.current.appendChild(qrCodeRef.current);
      }

      // Cleanup on component unmount
      return () => {
        if (parentRef.current) {
          parentRef.current.innerHTML = ""; // Cleanup the parent wrapper
        }
      };
    }
  }, [data]); // Recreate the QR code whenever 'data' or 'imageUrl' changes
  if (parentRef.current === null) {
    return <div ref={qrCodeRef} />;
  }
}

export default CustomQRCode;
