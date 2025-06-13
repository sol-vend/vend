import React, { useRef, useState, useEffect } from "react";
import jsQR from "jsqr";

const QRScanner = ({ onQRCodeScanned }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameras, setCameras] = useState([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const streamRef = useRef(null);
  const scannedRef = useRef(false);
  const [manualScanActive, setManualScanActive] = useState(false); // 🔹 new state

  useEffect(() => {
    const loadCamerasAndStartStream = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === "videoinput");
        setCameras(videoDevices);

        if (videoDevices.length > 0) {
          const rearCam = videoDevices.find((d) =>
            d.label.toLowerCase().includes("back")
          );
          const defaultCam = rearCam || videoDevices[0];
          setCurrentCameraIndex(videoDevices.indexOf(defaultCam));
          await startStream(defaultCam.deviceId);
        }
      } catch (err) {
        console.error("Error accessing cameras:", err);
      }
    };

    loadCamerasAndStartStream();
    return () => stopStream();
  }, []);

  const stopStream = () => {
    scannedRef.current = false;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const startStream = async (deviceId) => {
    stopStream();
    try {
      const constraints = {
        video: {
          deviceId: { exact: deviceId },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", true);
        await videoRef.current.play();
        scanLoop();
      }
    } catch (err) {
      console.error("Could not start stream:", err);
    }
  };

  const scanLoop = () => {
    if (!videoRef.current || !canvasRef.current || scannedRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const loop = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code?.data) {
          handleScannedCode(code.data.trim());
          return;
        }
      }
      requestAnimationFrame(loop);
    };

    loop();
  };

  const handleScannedCode = (data) => {
    scannedRef.current = true;
    console.log("Scanned:", data);
    if (onQRCodeScanned) onQRCodeScanned(data);
    else window.location.href = data;
    stopStream();
  };

  const handleToggleCamera = async () => {
    if (cameras.length > 1) {
      const nextIndex = (currentCameraIndex + 1) % cameras.length;
      setCurrentCameraIndex(nextIndex);
      await startStream(cameras[nextIndex].deviceId);
    }
  };

  // 🔹 Manual still-frame scan
  const handleTakePicture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth || !video.videoHeight) return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code?.data) {
      handleScannedCode(code.data.trim());
    } else {
      alert("No QR code found in image. Try again.");
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "50vw",
        maxWidth: "640px",
        margin: "auto",
        display: "flex",
        flexDirection: "column", // 🔹 Stack buttons vertically
        justifyContent: "center",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: "100%",
          height: "auto",
          borderRadius: "8px",
          backgroundColor: "black",
          objectFit: "cover",
        }}
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div style={{ display: "flex", gap: "8px" }}>
        {cameras.length > 1 && (
          <button
            onClick={handleToggleCamera}
            style={buttonStyle}
          >
            Switch Camera
          </button>
        )}

        <button
          onClick={handleTakePicture}
          style={buttonStyle}
        >
          Take Picture Instead
        </button>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: "8px 12px",
  backgroundColor: "#000",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default QRScanner;
