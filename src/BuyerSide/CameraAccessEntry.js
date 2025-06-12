import React, { useState } from "react";

const CameraAccessEntry = ({ children }) => {
  const [hasConsented, setHasConsented] = useState(false);
  const [permissionError, setPermissionError] = useState(null);

  const handleContinue = async () => {
    try {
      // Try to access the camera
      await navigator.mediaDevices.getUserMedia({ video: true });
      setHasConsented(true);
    } catch (err) {
      setPermissionError("Camera access is required to continue.");
      console.error("Camera permission error:", err);
    }
  };

  if (hasConsented) {
    return <>{children}</>; // 
  }

  return (
    <div className="camera-access-entry" style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Allow Camera Access</h2>
      <p>To continue, you’ll need to grant camera access so we can scan your QR code.</p>
      <button onClick={handleContinue} className="authorize-camera-button">
        Continue
      </button>
      {permissionError && (
        <p style={{ color: "red", marginTop: "1rem" }}>{permissionError}</p>
      )}
    </div>
  );
};

export default CameraAccessEntry;
