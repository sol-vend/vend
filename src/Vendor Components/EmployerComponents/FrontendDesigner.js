import React, { useState, useEffect, useCallback, useRef } from "react";
import debounce from "lodash.debounce";
import "react-resizable/css/styles.css";
import CustomCheckbox from "../CustomCheckbox";
import Phone from "./Phone";
import { retrieveExistingData, updateExistingData } from "../Shared";
import "./FrontendDesigner.css";
import Loading from "../../Loading";

const FrontendDesigner = ({ callback, isMobileDevice }) => {
  const debounceWaitTime = 2000;
  const [loading, setLoading] = useState(true);
  const [isStartup, setIsStartup] = useState(true);
  const [error, setError] = useState(false);
  const [showOrderDeets, setShowOrderDeets] = useState(false);
  const [showCustomizationDetails, setShowCustomizationDetails] =
    useState(false);
  const [interfacePreferences, setInterfacePreferences] = useState({
    businessName: "",
    bannerText: "Our Slogan",
    footerText: "Thanks for your business!",
    background: "",
    isTipScreen: false,
    isCustomized: false,
  });
  const orderDeetsParentRef = useRef(null);
  const qrWrapperRef = useRef(null);

  const updateDatabaseWithGroups = useCallback(
    debounce(async (prefs) => {
      try {
        const data = {
          customerSetup: prefs,
        };
        const response = await updateExistingData(data);

        if (response && response.status === 500) {
          // Check to make sure the status property is returned and loaded
          setError(true);
          console.error("Error updating database."); //Check here for loading
        }
      } catch (updateError) {
        setError(true);
        console.error("Error updating database:", updateError);
      }
    }, debounceWaitTime),
    []
  );

  useEffect(() => {
    let isMounted = true; // flag to track if the component is mounted
    const getCurrentGroups = async () => {
      try {
        const customerSetup = ["customerSetup", "businessName"];
        const currentGroups = await retrieveExistingData(customerSetup);
        if (currentGroups.response?.customerSetup && isMounted) {
          if (currentGroups.response?.customerSetup?.businessName === "") {
            currentGroups.response.customerSetup.businessName =
              currentGroups.response.businessName;
          }
          setInterfacePreferences(currentGroups.response.customerSetup);
        } else if (currentGroups.status === 500) {
          setError(true);
          console.error("Error retrieving data.");
        }
      } catch (getDataError) {
        if (isMounted) setError(true);
        console.error("Error retrieving data:", getDataError);
      }
    };
    getCurrentGroups();
    setIsStartup(false); // Set isStartup to false after the initial data load

    return () => {
      isMounted = false; // Cleanup the flag when component unmounts
    };
  }, []);

  useEffect(() => {
    if (!isStartup) {
      updateDatabaseWithGroups(interfacePreferences);
    }
  }, [interfacePreferences, updateDatabaseWithGroups, isStartup]);

  useEffect(() => {
    console.log(interfacePreferences);
    if (interfacePreferences.businessName.length > 0 && loading) {
      setLoading(false);
    }
    callback(interfacePreferences.isCustomized);
  }, [interfacePreferences]);

  useEffect(() => {
    if (interfacePreferences.isCustomized) {
      const classToSelect = ".header-carousel-arrow.header-carousel-left-arrow.right";
      console.log(document.querySelector(classToSelect))
      if (document.querySelector(classToSelect)) {
        const addRemoveClass = () => {
          if (
            document
              .querySelector(classToSelect)
              .classList.contains("customizable")
          ) {
            document
              .querySelector(classToSelect)
              .classList.remove("customizable");
          } else {
            document.querySelector(classToSelect).classList.add("customizable");
            setTimeout(
              () =>
                document
                  .querySelector(".header-carousel-arrow.header-carousel-left-arrow.right")
                  .classList.remove("customizable"),
              5000
            );
          }
        };
        addRemoveClass();
      }
    }
  }, [interfacePreferences.isCustomized]);

  const handleCheckChange = (e, name) => {
    const checked = e;
    setInterfacePreferences((prevVals) => ({
      ...prevVals,
      [name]: checked,
    }));
  };

  const handleTipSelectionDemo = (e) => {
    const options = [
      "tip-option-demo-1",
      "tip-option-demo-2",
      "tip-option-demo-3",
      "tip-option-demo-4",
    ];
    const { id } = e.target;
    const unselectedStyles = {
      background: "black",
      color: "white",
      cursor: "pointer",
      border: "solid white 0.5px",
      transform: "scale(1)",
    };
    const selectedStyles = {
      background: "white",
      color: "black",
      border: "solid gray 2.5px",
      transform: "scale(1.5)",
      cursor: "pointer",
    };
    console.log(id);
    options.map((option) =>
      id === option
        ? Object.assign(document.getElementById(option).style, selectedStyles)
        : Object.assign(document.getElementById(option).style, unselectedStyles)
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInterfacePreferences((prevVals) => ({
      ...prevVals,
      [name]: value,
    }));
  };

  const handleCustomizationDetails = () => {
    setShowCustomizationDetails(true);
  };

  const Modal = ({ onClose }) => {
    return (
      <div className="customization-details-modal-overlay-wrapper">
        <div
          className="customization-details-modal-overlay"
          onClick={onClose}
        ></div>
        <div
          className="customization-details-modal modal"
          onClick={(e) => e.stopPropagation()}
        >
          <h3>{"Vend Customization"}</h3>
          <p>
            {
              "In the section, you have the option to customize the interface with which your employees will interact. This can have a ton of benefits!"
            }
          </p>
          <ol className="alternating-colors">
            <li>
              <strong>Error Prevention: </strong> A customized interface can
              prevent errors caused by manually entering prices.
            </li>
            <li>
              <strong>Traffic: </strong>Customization can be leveraged to help
              drive more customers to your business by featuring popular items
              in our map section.
            </li>
            <li>
              <strong>Inventory: </strong> If your options are integrated, we
              will automatically track inventory, sales and usage.
            </li>
            <li>
              <strong>Suggestions: </strong> In the future, we can provide you
              metrics and suggestions that may help further boost your business.
            </li>
          </ol>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              className="vendor-add-button-styles"
              onClick={() => setShowCustomizationDetails(false)}
            >
              Close
            </div>
          </div>
        </div>
      </div>
    );
  };

  const OrderItemsExamples = () => {
    return (
      <div className="phone-abs-order-details">
        <div>
          <p>
            <strong>Order Summary:</strong>
          </p>
          <p>{"(1) This: $5.00"}</p>
          <p>{"(1) That: $7.00"}</p>
          <p>{"(1) The Other: $9.50"}</p>
        </div>
      </div>
    );
  };

  const FrontendDesignerPhone = () => {
    return (
      <Phone>
        <div>
          <div className="frontend-designer-bn">
            {interfacePreferences.businessName}
          </div>
          <div className="frontend-designer-slogan">
            {interfacePreferences.bannerText}
          </div>
        </div>
        <div>
          <div className="mobile-demo-qr" ref={qrWrapperRef}>
            <img src="vend-qr-demo.png" />
          </div>
        </div>
        <div>
          <div className="frontend-order-details-wrapper">
            <div
              ref={orderDeetsParentRef}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p
                className="vendor-add-button-styles"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "0px",
                }}
                onClick={() => setShowOrderDeets(!showOrderDeets)}
              >
                <span className="frontend-display-phone-price">$21.50</span>
                <span>
                  {!showOrderDeets
                    ? "Show Order Details"
                    : "Hide Order Details"}
                </span>
              </p>
            </div>
            <>
              <div
                className={`order-details-wrapper ${
                  showOrderDeets ? "show" : "hide"
                }`}
              >
                <OrderItemsExamples />
              </div>
            </>
          </div>
        </div>
        <div>
          {interfacePreferences.isTipScreen && (
            <div className="mobile-tip-option-demo">
              <div style={{ display: "block" }}>
                <p>Would you like to leave a tip?</p>
              </div>
              <div className="mobile-tip-option-span-wrapper">
                <span
                  id="tip-option-demo-1"
                  style={{ cursor: "pointer" }}
                  onClick={handleTipSelectionDemo}
                >
                  10%
                </span>
                <span
                  id="tip-option-demo-2"
                  style={{ cursor: "pointer" }}
                  onClick={handleTipSelectionDemo}
                >
                  15%
                </span>
                <span
                  id="tip-option-demo-3"
                  style={{ cursor: "pointer" }}
                  onClick={handleTipSelectionDemo}
                >
                  20%
                </span>
                <span
                  id="tip-option-demo-4"
                  style={{ cursor: "pointer" }}
                  onClick={handleTipSelectionDemo}
                >
                  25%
                </span>
              </div>
            </div>
          )}
        </div>
        <div>
          <div className="frontend-designer-footer">
            <p>{interfacePreferences.footerText}</p>
          </div>
        </div>
      </Phone>
    );
  };
  console.log(interfacePreferences);
  if (loading) {
    return (
      <>
        <Loading />
      </>
    );
  } else {
    console.log("isMobileDevice", isMobileDevice);
    return (
      <div
        className={
          isMobileDevice
            ? "mobile-frontend-designer-wrapper"
            : "frontend-designer-wrapper"
        }
      >
        {showCustomizationDetails && <Modal />}
        <div
          className={
            isMobileDevice
              ? "mobile-frontend-options-wrapper vendor-form-styles"
              : "frontend-options-wrapper vendor-form-styles"
          }
        >
          <div
            className={
              isMobileDevice
                ? "mobile-frontend-options-vendor-input-group-styles"
                : "frontend-options-vendor-input-group-styles"
            }
          >
            <label
              className={
                isMobileDevice
                  ? "mobile-frontend-designer-label-first"
                  : "frontend-designer-label"
              }
            >
              Customization Options
            </label>
            <div>
              <div
                className={
                  isMobileDevice
                    ? "mobile-custom-checkbox-wrapper frontend-designer"
                    : "custom-checkbox-wrapper frontend-designer"
                }
              >
                <CustomCheckbox
                  label={{
                    title: !interfacePreferences.isCustomized
                      ? "Quickstart"
                      : "Customized",
                  }}
                  checked={interfacePreferences.isCustomized}
                  onChange={(e) => handleCheckChange(e, "isCustomized")}
                  name={"isCustomized"}
                  includeName={true}
                />
                <p
                  className={
                    !interfacePreferences.isCustomized ? "" : "clickable"
                  }
                  onClick={
                    !interfacePreferences.isCustomized
                      ? () => null
                      : handleCustomizationDetails
                  }
                >
                  {!interfacePreferences.isCustomized
                    ? "Let's get going!"
                    : "Click for more details."}
                </p>
              </div>
            </div>
          </div>
          <div
            className={
              isMobileDevice
                ? "mobile-frontend-options-vendor-input-group-styles"
                : "frontend-options-vendor-input-group-styles"
            }
          >
            <label
              className={
                isMobileDevice
                  ? "mobile-frontend-designer-label"
                  : "frontend-designer-label"
              }
            >
              Banner Text
            </label>
            <input
              type="text"
              name="bannerText"
              value={interfacePreferences.bannerText}
              onChange={handleChange}
              className={
                isMobileDevice
                  ? "mobile-vendor-input-field-styles"
                  : "vendor-input-field-styles"
              }
              placeholder="Our Slogan"
            />
          </div>
          <div
            className={
              isMobileDevice
                ? "mobile-frontend-options-vendor-input-group-styles"
                : "frontend-options-vendor-input-group-styles"
            }
          >
            <label
              className={
                isMobileDevice
                  ? "mobile-frontend-designer-label"
                  : "frontend-designer-label"
              }
            >
              Salutation
            </label>
            <input
              type="text"
              name="footerText"
              value={interfacePreferences.footerText}
              onChange={handleChange}
              className={
                isMobileDevice
                  ? "mobile-vendor-input-field-styles"
                  : "vendor-input-field-styles"
              }
              placeholder="Thanks for your business!"
            />
          </div>
          <div
            className={
              isMobileDevice
                ? "mobile-custom-checkbox-wrapper frontend-designer"
                : "frontend-options-vendor-input-group-styles"
            }
          >
            <CustomCheckbox
              label={{
                title: interfacePreferences.isTipScreen
                  ? "Tipping enabled"
                  : "Tipping disabled",
              }}
              checked={interfacePreferences.isTipScreen}
              onChange={(e) => handleCheckChange(e, "isTipScreen")}
              name={"isTipScreen"}
              includeName={true}
            ></CustomCheckbox>
          </div>
        </div>
        <FrontendDesignerPhone />
      </div>
    );
  }
};

export default FrontendDesigner;
