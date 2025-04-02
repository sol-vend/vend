import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaDollarSign,
  FaEdit,
  FaMoneyBillAlt,
  FaPersonBooth,
  FaUser,
} from "react-icons/fa";
import Tooltip from "../Tooltip";
import FrontendDesigner from "./FrontendDesigner";
import EmployeeInterfaceDesigner from "./EmployeeInterfaceDesigner";
import {
  fetchDataWithAuth,
  handleUserLogout,
  modifyCookieExpiration,
} from "../Shared";
import SnapSlider from "./SnapSlider";
import SwipeIndicator from "../SwipeIndicator";
import EmployeeInterface from "../EmployeeComponents/EmployeeInterface";
import AppHome from "../../Home/AppHome";
import "./Home.css";

const Home = ({ loginInfos, setSelectedRoute }) => {
  const [userSettingsDropdownClicked, setUserSettingsDropdownClicked] =
    useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(
    window.innerWidth <= 768
  );
  const optionsRef = useRef(null);
  const userRef = useRef(null);
  const [isCustomizationSelected, setIsCustomizationSelected] = useState(false);
  const [loginInformation, setLoginInformation] = useState(false);
  const [bottomBannerMobileStyle, setBottomBannerMobileStyle] = useState("");
  const [scrollHeight, setScrollHeight] = useState(0);
  const [isLogout, setIsLogout] = useState(false);
  const elementRef = useRef(null);
  const navigate = useNavigate();
  const [selectedOptionCard, setSelectedOptionCard] = useState({
    name: "editPos",
    component: [
      <FrontendDesigner
        callback={setIsCustomizationSelected}
        isMobileDevice={isMobileDevice}
      />,
      <EmployeeInterfaceDesigner />,
    ],
    headerOpts: ["Customer Payment Setup", "Employee Interface Setup"],
    selectedIndex: 0,
    isHeader: true,
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobileDevice(true);
      } else {
        setIsMobileDevice(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (elementRef.current) {
      const observer = new ResizeObserver(() => {
        setScrollHeight(elementRef.current.scrollHeight);
      });
      observer.observe(elementRef.current);
      return () => {
        observer.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    const hasOverflow =
      document.documentElement.scrollHeight >
      document.documentElement.clientHeight;
    setBottomBannerMobileStyle(
      hasOverflow ? "home-home-bottom-banner" : "home-home-bottom-banner abs"
    );
  }, [scrollHeight]);

  useEffect(() => {
    console.log(isCustomizationSelected);
    setSelectedOptionCard((prevVals) => ({
      ...prevVals,
      headerOpts: isCustomizationSelected
        ? ["Customer Payment Setup", "Employee Interface Setup"]
        : ["Customer Payment Setup"],
      component: isCustomizationSelected
        ? [
            <FrontendDesigner
              callback={setIsCustomizationSelected}
              isMobileDevice={isMobileDevice}
            />,
            <EmployeeInterfaceDesigner />,
          ]
        : [
            <FrontendDesigner
              callback={setIsCustomizationSelected}
              isMobileDevice={isMobileDevice}
            />,
          ],
    }));
  }, [isCustomizationSelected]);

  const handleUserSettingsClick = () => {
    setUserSettingsDropdownClicked(true);
  };

  const handleLogOut = () => {
    handleUserLogout(setIsLogout);
  };

  const BottomBanner = () => {
    return (
      <div className={"home-home-bottom-banner"}>
        <div
          className={
            selectedOptionCard.name === "editPos"
              ? "option-card selected"
              : "option-card"
          }
          name="editPos"
          onClick={() =>
            setSelectedOptionCard({
              name: "editPos",
              component: [
                <FrontendDesigner
                  callback={setIsCustomizationSelected}
                  isMobileDevice={isMobileDevice}
                />,
                <EmployeeInterfaceDesigner />,
              ],
              headerOpts: [
                "Customer Payment Setup",
                "Employee Interface Setup",
              ],
              selectedIndex: 0,
              isHeader: true
            })
          }
        >
          <Tooltip
            message={"Modify POS system settings, layout, and products."}
          >
            <h3>
              <FaEdit />
            </h3>
          </Tooltip>
        </div>
        <div
          className={
            selectedOptionCard.name === "gotoPos"
              ? "option-card selected"
              : "option-card"
          }
          name="gotoPos"
          onClick={() =>
            setSelectedOptionCard({
              name: "gotoPos",
              component: [
                <>
                  <EmployeeInterface />
                  <BottomBanner />
                </>,
              ],
              headerOpts: ["Point of Sale"],
              selectedIndex: 0,
              isHeader: false
            })
          }
        >
          <Tooltip message={"Access the live POS interface for transactions."}>
            <h3>
              <FaMoneyBillAlt />
            </h3>
          </Tooltip>
        </div>
        <div
          className={
            selectedOptionCard.name === "manageEmployees"
              ? "option-card selected"
              : "option-card"
          }
          name="manageEmployees"
        >
          <Tooltip message={"Add or manage employee roles and permissions."}>
            <h3>
              <FaPersonBooth />
            </h3>
          </Tooltip>
        </div>
        {/*
        <div
          className={
            selectedOptionCard.name === "viewMetrics"
              ? "option-card selected"
              : "option-card"
          }
          name="viewMetrics"
          onClick={() => alert("View Infometrics")}
        >
          <Tooltip message={"View detailed analytics and sales data."}>
            <h3>View Infometrics</h3>
          </Tooltip>
        </div>
  */}
        <div
          className={
            selectedOptionCard.name === "configurePayment"
              ? "option-card selected"
              : "option-card"
          }
          name="configurePayment"
          onClick={() => alert("Manage Payment Options")}
        >
          <Tooltip message={"Configure available payment methods."}>
            <h3>
              <FaDollarSign />
            </h3>
          </Tooltip>
        </div>
      </div>
    );
  };

  const userSettingsOptions = [
    { text: "Log Out", handler: handleLogOut },
    { text: "Edit Account Information", handler: () => {} },
    { text: "Contact Support", handler: () => {} },
  ];

  const handleSelectionIncrement = () => {
    const maxIndex = selectedOptionCard.headerOpts.length - 1;
    if (selectedOptionCard.selectedIndex + 1 <= maxIndex) {
      setSelectedOptionCard((prev) => ({
        ...prev,
        selectedIndex: prev.selectedIndex + 1,
      }));
    }
  };

  const handleSelectionDecrement = () => {
    const minIndex = 0;
    if (selectedOptionCard.selectedIndex - 1 >= minIndex) {
      setSelectedOptionCard((prev) => ({
        ...prev,
        selectedIndex: prev.selectedIndex - 1,
      }));
    }
  };

  const handleClickOutside = (event) => {
    if (optionsRef.current && !optionsRef.current.contains(event.target)) {
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserSettingsDropdownClicked(false);
      }
    }
  };

  useEffect(() => {
    if (!loginInformation) {
      fetchDataWithAuth(setLoginInformation);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobileDevice(true);
      } else {
        setIsMobileDevice(false);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isLogout) {
    window.location.reload();
  } else {
    return (
      <>
        {isMobileDevice && (
          <>
            <BottomBanner />
          </>
        )}
        <div className="home-home-outer-wrapper" ref={elementRef}>
          <div
            className="user-settings-icon"
            onClick={handleUserSettingsClick}
            ref={userRef}
          >
            <FaUser size={20} />
            {userSettingsDropdownClicked && (
              <div id="user-settings-dropdown" ref={optionsRef}>
                {userSettingsOptions.map((opt) => (
                  <div onClick={opt.handler}>{opt.text}</div>
                ))}
              </div>
            )}
          </div>
          <div className="home-home-top-banner">
            {loginInformation && loginInformation.user_id && (
              <p
                style={{
                  position: "absolute",
                  top: isMobileDevice ? "120px" : "120px",
                  textAlign: "end",
                  fontSize: "0.75rem",
                  width: isMobileDevice ? "93vw" : "97vw",
                }}
              >
                {loginInformation.user_id
                  ? loginInformation.user_id.includes("@")
                    ? `@${loginInformation.user_id.split("@")[0]}`
                    : loginInfos.user_id
                  : ""}
              </p>
            )}
          </div>
          <div className="home-primary-content-wrapper">
            <div className="home-home-primary-content">
              {!isMobileDevice && (
                <div className="home-home-left-banner">
                  <div>
                    <div className="options-container">
                      <div
                        className={
                          selectedOptionCard.name === "editPos"
                            ? "option-card selected"
                            : "option-card"
                        }
                        name="editPos"
                        onClick={() =>
                          setSelectedOptionCard({
                            name: "editPos",
                            component: [
                              <FrontendDesigner
                                callback={setIsCustomizationSelected}
                                isMobileDevice={isMobileDevice}
                              />,
                              <EmployeeInterfaceDesigner />,
                            ],
                            headerOpts: [
                              "Customer Payment Setup",
                              "Employee Interface Setup",
                            ],
                            selectedIndex: 0,
                            isHeader:true,
                          })
                        }
                      >
                        <Tooltip
                          message={
                            "Modify POS system settings, layout, and products."
                          }
                        >
                          <h3>Edit Point of Sale Interface</h3>
                        </Tooltip>
                      </div>
                      <div
                        className={
                          selectedOptionCard.name === "gotoPos"
                            ? "option-card selected"
                            : "option-card"
                        }
                        name="gotoPos"
                        onClick={() =>
                          setSelectedOptionCard({
                            name: "gotoPos",
                            component: [
                              <>
                                <EmployeeInterface />
                                <BottomBanner />
                              </>,
                            ],
                            headerOpts: ["Point of Sale"],
                            selectedIndex: 0,
                            isHeader: false,
                          })
                        }
                      >
                        <Tooltip
                          message={
                            "Access the live POS interface for transactions."
                          }
                        >
                          <h3>Go to Point of Sale Interface</h3>
                        </Tooltip>
                      </div>
                      <div
                        className={
                          selectedOptionCard.name === "manageEmployees"
                            ? "option-card selected"
                            : "option-card"
                        }
                        name="manageEmployees"
                      >
                        <Tooltip
                          message={
                            "Add or manage employee roles and permissions."
                          }
                        >
                          <h3>Manage Employees</h3>
                        </Tooltip>
                      </div>
                      {/*
                      <div
                        className={
                          selectedOptionCard.name === "viewMetrics"
                            ? "option-card selected"
                            : "option-card"
                        }
                        name="viewMetrics"
                        onClick={() => alert("View Infometrics")}
                      >
                        <Tooltip
                          message={"View detailed analytics and sales data."}
                        >
                          <h3>View Infometrics</h3>
                        </Tooltip>
                      </div>
  */}
                      <div
                        className={
                          selectedOptionCard.name === "configurePayment"
                            ? "option-card selected"
                            : "option-card"
                        }
                        name="configurePayment"
                        onClick={() => alert("Manage Payment Options")}
                      >
                        <Tooltip
                          message={"Configure available payment methods."}
                        >
                          <h3>Manage Payment Options</h3>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="home-home-center-content">
                <div
                  className={
                    "home-home-center-header carousel-controls header-carousel swipeable"
                  }
                  style={{ overflowX: "hidden" }}
                >
                  {!isMobileDevice && selectedOptionCard.isHeader &&
                    document.querySelector(".home-home-center-header") && (
                      <>
                        <button
                          className="header-carousel-arrow header-carousel-left-arrow"
                          onClick={handleSelectionDecrement}
                        >
                          <SwipeIndicator
                            direction={"left"}
                            numArrows={5}
                            size={12}
                            minIndex={selectedOptionCard.selectedIndex === 0}
                          />
                        </button>
                          <h3 style={{ width: "250px" }}>
                            {
                              selectedOptionCard.headerOpts[
                                selectedOptionCard.selectedIndex
                              ]
                            }
                          </h3>
                        <button
                          className="header-carousel-arrow header-carousel-left-arrow right"
                          onClick={handleSelectionIncrement}
                        >
                          <SwipeIndicator
                            direction={"right"}
                            numArrows={5}
                            size={12}
                            maxIndex={
                              selectedOptionCard.selectedIndex ===
                              selectedOptionCard.headerOpts.length - 1
                            }
                          />
                        </button>
                      </>
                    )}
                  {isMobileDevice && selectedOptionCard.isHeader && (
                    <>
                      <button
                        className="header-carousel-arrow header-carousel-left-arrow"
                        onClick={handleSelectionIncrement}
                      >
                        <SwipeIndicator
                          direction={"left"}
                          numArrows={3}
                          size={10}
                        />
                      </button>
                      <h3 style={{ width: "250px" }}>
                        <SnapSlider
                          items={selectedOptionCard.headerOpts}
                          selectedIndex={selectedOptionCard.selectedIndex}
                          setSelectedIndex={setSelectedOptionCard}
                          objectHeight={50}
                          itemWidth={200}
                          gap={100}
                          isAccessed={true}
                          accessKey={"selectedIndex"}
                          additionalTranslation={250}
                        />
                      </h3>
                      <button
                        className="header-carousel-arrow header-carousel-left-arrow"
                        onClick={handleSelectionDecrement}
                      >
                        <SwipeIndicator
                          direction={"right"}
                          numArrows={3}
                          size={10}
                        />
                      </button>
                    </>
                  )}
                </div>
                {selectedOptionCard.component[selectedOptionCard.selectedIndex]}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default Home;
