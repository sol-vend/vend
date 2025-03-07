import React, { useState, useEffect, useCallback, useRef } from "react";
import debounce from "lodash.debounce";
import "react-resizable/css/styles.css";
import CustomCheckbox from "../CustomCheckbox";
import Phone from "./Phone";
import { retrieveExistingData, updateExistingData } from "../Shared";
import "./FrontendDesigner.css";
import Loading from "../../Loading";

// Component to handle customization of each element
const FrontendDesigner = ({ callback }) => {
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
        const customerSetup = ["customerSetup"];
        const currentGroups = await retrieveExistingData(customerSetup);

        if (currentGroups.response?.customerSetup && isMounted) {
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
    if (interfacePreferences.businessName.length > 0 && loading) {
      setLoading(false);
    }
    callback(interfacePreferences.isCustomized)
  },[interfacePreferences])

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
      background: "white",
      color: "black",
      cursor: "pointer",
    };
    const selectedStyles = {
      background: "#000000a3",
      color: "white",
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

  if (loading) {
    return (
      <>
        <Loading />
      </>
    );
  } else if (error) {
    console.log(error);
    return null; // Prevent further rendering after reload
  } else {
    return (
      <div className="frontend-designer-wrapper">
        {showCustomizationDetails && <Modal />}
        <div className="frontend-options-wrapper vendor-form-styles">
          <div className="vendor-input-group-styles">
            <label className="frontend-designer-label">
              Customization Options
            </label>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <div className="custom-checkbox-wrapper frontend-designer">
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
          <div className="vendor-input-group-styles">
            <label className="frontend-designer-label">Banner Text</label>
            <input
              type="text"
              name="bannerText"
              value={interfacePreferences.bannerText}
              onChange={handleChange}
              className="vendor-input-field-styles"
              placeholder="Our Slogan"
            />
          </div>
          <div className="vendor-input-group-styles">
            <label className="frontend-designer-label">Salutation</label>
            <input
              type="text"
              name="footerText"
              value={interfacePreferences.footerText}
              onChange={handleChange}
              className="vendor-input-field-styles"
              placeholder="Thanks for your business!"
            />
          </div>
          <div className="vendor-input-group-styles">
            <CustomCheckbox
              label={{ description: "Allow Tipping?" }}
              checked={interfacePreferences.isTipScreen}
              onChange={(e) => handleCheckChange(e, "isTipScreen")}
              name={"isTipScreen"}
              includeName={true}
            ></CustomCheckbox>
          </div>
        </div>

        <Phone>
          <div className="frontend-designer-bn">
            {interfacePreferences.businessName}
          </div>
          <div className="frontend-designer-slogan">
            {interfacePreferences.bannerText}
          </div>
          <div style={{ fontSize: "8px", marginTop: "5%" }}>
            <div
              ref={orderDeetsParentRef}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p
                style={{ fontSize: "8px" }}
                className="vendor-add-button-styles"
                onClick={() => setShowOrderDeets(!showOrderDeets)}
              >
                {!showOrderDeets ? "Show Order Details" : "Hide Order Details"}
              </p>
            </div>
            <>
              {showOrderDeets && (
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "75px",
                    zIndex: "10",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "5%",
                      background: "white",
                      borderRadius: "5px",
                      marginInline: "15%",
                      border: "solid black 1px",
                    }}
                    className="phone-abs-order-details"
                  >
                    <div style={{ textAlign: "left" }}>
                      <p>
                        <strong>Order Summary:</strong>
                      </p>
                      <p>{"(1) This: $5.00"}</p>
                      <p>{"(1) That: $7.00"}</p>
                      <p>{"(1) The Other: $9.50"}</p>
                    </div>
                  </div>
                </div>
              )}
            </>
            <p>
              <strong>Total: $21.50</strong>
            </p>
          </div>
          <div className="mobile-demo-qr">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30%"
              height="20%"
              viewBox="0 0 24 24"
            >
              <path d="M3 9h6V3H3zm1-5h4v4H4zm1 1h2v2H5zm10 4h6V3h-6zm1-5h4v4h-4zm1 1h2v2h-2zM3 21h6v-6H3zm1-5h4v4H4zm1 1h2v2H5zm15 2h1v2h-2v-3h1zm0-3h1v1h-1zm0-1v1h-1v-1zm-10 2h1v4h-1v-4zm-4-7v2H4v-1H3v-1h3zm4-3h1v1h-1zm3-3v2h-1V3h2v1zm-3 0h1v1h-1zm10 8h1v2h-2v-1h1zm-1-2v1h-2v2h-2v-1h1v-2h3zm-7 4h-1v-1h-1v-1h2v2zm6 2h1v1h-1zm2-5v1h-1v-1zm-9 3v1h-1v-1zm6 5h1v2h-2v-2zm-3 0h1v1h-1v1h-2v-1h1v-1zm0-1v-1h2v1zm0-5h1v3h-1v1h-1v1h-1v-2h-1v-1h3v-1h-1v-1zm-9 0v1H4v-1zm12 4h-1v-1h1zm1-2h-2v-1h2zM8 10h1v1H8v1h1v2H8v-1H7v1H6v-2h1v-2zm3 0V8h3v3h-2v-1h1V9h-1v1zm0-4h1v1h-1zm-1 4h1v1h-1zm3-3V6h1v1z" />
              <path fill="none" d="M0 0h24v24H0z" />
            </svg>
          </div>
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
          <div className="frontend-designer-footer">
            {interfacePreferences.footerText}
          </div>
        </Phone>
      </div>
    );
  }
};

export default FrontendDesigner;
