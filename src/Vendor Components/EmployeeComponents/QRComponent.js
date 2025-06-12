import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_URL } from "../../Components/Shared";
import { FaSyncAlt } from "react-icons/fa";
import NumericKeypad from "./NumericKeypad";
import CustomQRCode from "../EmployerComponents/CustomQRCode";
import { nanoid } from "nanoid";

const QRComponent = ({
  pageDatas,
  orderTotal,
  isOrderDetailsShow,
  setIsOrderDetailsShow,
  setGoBack,
  parentExpressions = undefined,
}) => {
  const [tipValue, setTipValue] = useState(0);
  const [doMakeQr, setDoMakeQr] = useState(false);
  const [finalTotalPrice, setFinalTotalPrice] = useState(0);
  const [hasAnimationRanOnce, setHasAnimationRanOnce] = useState(false);
  const orderDetailsRef = useRef(null);
  const [hasDetailsBeenClicked, setHasDetailsBeenClicked] = useState(false);
  const [isCustomTipOption, setIsCustomTipOption] = useState(false);
  const [finalQrData, setFinalQrData] = useState("");
  const [qrPayload, setQrPayload] = useState("");
  const qrWrapperRef = useRef(null);
  const animationRef = useRef(null);
  const deeplinkBase = "https://phantom.app/ul/browse/";
  const handleTipSelection = (index) => {
    const map = {
      0: 0.1,
      1: 0.15,
      2: 0.2,
    };
    if (index < 3) {
      setTipValue(orderTotal * map[index]);
    }
  };

  useEffect(() => {
    if (!hasAnimationRanOnce) {
      if (animationRef.current) {
        if (
          animationRef.current.classList.contains("customer-facing-qr-header")
        ) {
          animationRef.current.classList.remove("customer-facing-qr-header");
          animationRef.current.classList.add("customer-facing-qr-header-still");
        }
      }
    }
  }, []);

  useEffect(() => {
    console.log(orderTotal + tipValue);
    setFinalTotalPrice(orderTotal + tipValue);
  }, [tipValue]);

  const handleCustomTipOption = () => {
    setIsCustomTipOption(!isCustomTipOption);
  };

  const handleCustomTipInput = (customTipInput) => {
    console.log(customTipInput);
    setTipValue(customTipInput);
  };

  const buildQrDeeplink = async (pageDatas) => {
    const datasToEncode = {
      totalPrice: finalTotalPrice,
      destinationPublicKey: pageDatas.vendorWalletAddress,
      businessName: pageDatas.businessName,
      businessId: pageDatas.businessId,
      saleInformation: parentExpressions || "",
    };
    try {
      const response = await axios.post(
        `${API_URL}/api/get_url_safe_link_encode`,
        datasToEncode,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setFinalQrData(response.data);
    } catch (error) {
      console.error("Error:", error);
      return error;
    }
  };

  const handleShowOrderDetails = () => {
    setIsOrderDetailsShow(!isOrderDetailsShow);
    if (!hasDetailsBeenClicked) {
      setHasDetailsBeenClicked(true);
    }
    const isCurrentlyShown = orderDetailsRef.current.classList.contains(
      "customer-facing-order-details-abs-show"
    );
    if (isCurrentlyShown) {
      orderDetailsRef.current.classList.remove(
        "customer-facing-order-details-abs-show"
      );
      orderDetailsRef.current.classList.add(
        "customer-facing-order-details-abs"
      );
    } else {
      if (
        !orderDetailsRef.current.classList.contains(
          "customer-facing-order-details-abs"
        )
      ) {
        orderDetailsRef.current.classList.add(
          "customer-facing-order-details-abs"
        );
        void orderDetailsRef.current.offsetWidth;
      }
      setTimeout(() => {
        orderDetailsRef.current.classList.add(
          "customer-facing-order-details-abs-show"
        );
      }, 10);
    }
  };

  const handleConfirmOrder = () => {
    buildQrDeeplink(pageDatas);
  };

  useEffect(() => {
    if (!finalQrData) return;

    const sendToMongo = async () => {
      const generatedId = nanoid();

      const payload = {
        id: generatedId,
        payload: `${deeplinkBase}${encodeURIComponent(
          `https://solvend.fun/#/payment/#${finalQrData.hash}`
        )}?ref=${encodeURIComponent("https://solvend.fun")}`,
      };

      try {
        const res = await fetch(`${API_URL}/api/helper_link_initializor`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to save QR data");

        const result = await res.json();
        console.log("Saved to MongoDB:", result);
        setQrPayload(payload);
        setDoMakeQr((prev) => !prev);
      } catch (err) {
        console.error("QR data post error:", err);
      }
    };
    sendToMongo();
  }, [finalQrData]);

  return (
    <div className="customer-facing-wrapper">
      <div className="customer-facing-wrapper-header">
        {pageDatas?.logo?.file && <img src={`${pageDatas.logo.file}`}></img>}
        <div>
          <h1>{pageDatas?.businessName || "Business Name"}</h1>
          <p>{pageDatas?.customerSetup?.bannerText || "Customer Slogan"}!</p>
        </div>
        <p>{`@${pageDatas?.businessId}` || "Business ID"}</p>
      </div>
      <div className="customer-facing-back-button-wrapper">
        <button onClick={() => setGoBack((prev) => !prev)}>
          <FaSyncAlt />
        </button>
      </div>
      <div className="customer-facing-body-wrapper">
        <div className="customer-facing-wrapper-container">
          <div className="customer-facing-qr-header-wrapper">
            <h3 ref={animationRef} className="customer-facing-qr-header">
              {doMakeQr ? "SCAN TO PAY" : "PRESS CONFIRM TOTAL TO GENERATE QR"}
            </h3>
          </div>
          <div className="customer-facing-qr-wrapper">
            <div
              ref={qrWrapperRef}
              style={doMakeQr ? { opacity: "1" } : { opacity: "0" }}
            >
              {
                <CustomQRCode
                  data={`${API_URL}/api/helper_link_finder/${qrPayload.id}`}
                  parentRef={qrWrapperRef}
                />
              }
            </div>
          </div>
          <div className="customer-facing-order-details-wrapper">
            <div
              onClick={handleShowOrderDetails}
              className="customer-facing-order-details-container"
            >{`Total: $${(orderTotal + tipValue).toFixed(2)}`}</div>
            <div
              className="customer-facing-order-details-rel"
              style={isOrderDetailsShow ? { zIndex: "10" } : { zIndex: "-10" }}
            >
              <div
                ref={orderDetailsRef}
                className={
                  hasDetailsBeenClicked
                    ? "customer-facing-order-details-abs"
                    : "customer-facing-order-details-abs-startup"
                }
              >
                <ul>
                  {console.log(parentExpressions)}
                  {parentExpressions.receipt &&
                    Object.keys(parentExpressions.receipt).map((key) => {
                      return <li>{parentExpressions.receipt[key]}</li>;
                    })}
                  {parentExpressions.miscellaneous &&
                    parentExpressions.miscellaneous.length > 0 && (
                      <span>Miscellaneous:</span>
                    )}
                  {parentExpressions.miscellaneous &&
                    Object.keys(parentExpressions.miscellaneous).map((key) => {
                      return <li>{parentExpressions.miscellaneous[key]}</li>;
                    })}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="customer-facing-footer-wrapper">
          {pageDatas?.customerSetup?.isTipScreen && (
            <div className="customer-facing-tip-options-wrapper">
              <div className="customer-facing-tip-options-label-container">
                <p className="customer-facing-tip-options-label">Tip Options</p>
              </div>
              <div className="customer-facing-tip-options-container">
                {Object.keys(pageDatas?.customerSetup).includes(
                  "customTipOptions"
                )
                  ? pageDatas.customTipOptions.map((tipOption, index) => (
                      <div className="tip-option-wrapper">
                        <p onClick={() => handleTipSelection(index)}>
                          {tipOption}
                        </p>
                      </div>
                    ))
                  : ["10%", "15%", "20%", "Custom"].map((tipOption, index) => {
                      if (tipOption === "Custom") {
                        return (
                          <>
                            <div className="tip-option-wrapper custom closed">
                              <p onClick={() => handleCustomTipOption()}>
                                Custom
                              </p>
                            </div>
                            {isCustomTipOption && (
                              <div className="custom-tip-option-wrapper">
                                <NumericKeypad
                                  onValueChange={handleCustomTipInput}
                                  onClose={handleCustomTipOption}
                                />
                              </div>
                            )}
                          </>
                        );
                      } else {
                        return (
                          <div className="tip-option-wrapper">
                            <p onClick={() => handleTipSelection(index)}>
                              {tipOption}
                            </p>
                          </div>
                        );
                      }
                    })}
              </div>
            </div>
          )}
        </div>
        <div className="customer-facing-price-confirmation-wrapper">
          <div
            onClick={handleConfirmOrder}
            className="customer-facing-confirm-total-button"
          >
            {!doMakeQr ? "Confirm Total" : "Change Tip?"}
          </div>
        </div>
        <div className="customer-facing-salutation-wrapper">
          <p>
            {pageDatas?.customerSetup?.footerText || "Thank you for visiting!"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRComponent;
