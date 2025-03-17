import React, { useState, useEffect, useRef, forwardRef } from "react";
import { FaPlus, FaMinus, FaCheckCircle, FaBackspace } from "react-icons/fa";
import { retrieveExistingData } from "../Shared";
import "./EmployeeInterface.css";
import "./NumericKeypad.css";
import Calculator from "./Calculator";
import CustomQRCode from "../EmployerComponents/CustomQRCode";
import axios from "axios";
import { API_URL } from "../../Components/Shared";

const InterfaceHeader = ({ pageDatas }) => {
  return (
    <div className="employee-interface-header">
      <h2>{pageDatas.businessName}</h2>
      {pageDatas.logo && <img src={pageDatas.logo.file} alt="Business Logo" />}
      <p>@{pageDatas.businessId}</p>
    </div>
  );
};

const QRComponent = ({
  pageDatas,
  orderTotal,
  isOrderDetailsShow,
  setIsOrderDetailsShow,
}) => {
  const [tipValue, setTipValue] = useState(0);
  const [doMakeQr, setDoMakeQr] = useState(false);
  const [finalTotalPrice, setFinalTotalPrice] = useState(0);
  const [hasAnimationRanOnce, setHasAnimationRanOnce] = useState(false);
  const orderDetailsRef = useRef(null);
  const [hasDetailsBeenClicked, setHasDetailsBeenClicked] = useState(false);
  const [isCustomTipOption, setIsCustomTipOption] = useState(false);
  const [finalQrData, setFinalQrData] = useState("");
  const qrWrapperRef = useRef(null);
  const animationRef = useRef(null);
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
    const urlBase = "https://phantom.app/ul/browse/";
    const datasToEncode = {
      baseLink: urlBase,
      totalPrice: finalTotalPrice,
      destinationPublicKey: pageDatas.vendorWalletAddess,
      businessName: pageDatas.businessName,
      saleInformation: "",
    };

    try {
      const response = await axios.post(
        `${API_URL}/api/get_url_safe_link`,
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

  const getQrDatas = () => {
    //const urlBase = "phantom.app/"
    //This is where it will get complicated.
    //I see the user scanning the qr code
    //1) Try to open in Phantom browser
    //2) Navigates directly to the vend -> payer interface if Phantom not detected
    //2a) Ask which wallet they would like to use for payment
    //2b) Have a list of available wallets, all the while keeping the important data from the qr in memory
    //2c) Finally, navigate to payer interface in vend in the selected wallet with the wallet connect object
    //3) Render the payer's available tokens and calculate the amount required to transact in the amount requested by the payee on select
    //4) Generate a swap link and a tx authorization.
    //5) Congratulate team
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
    setDoMakeQr(!doMakeQr);
  };

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
              <CustomQRCode
                data={`www.solvend.fun/${finalTotalPrice}`}
                parentRef={qrWrapperRef}
              />
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
                  {[
                    "1) Item 1 - $7.00",
                    "2) Item 2 - $3.00",
                    "3) Item 3 - $2.00",
                  ].map((value) => {
                    return <li>{value}</li>;
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
            {!doMakeQr ? "Confirm Total" : "Go Back"}
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

const NumericKeypad = ({
  onValueChange,
  onClose,
  initialValue = "",
  maxLength = 10,
}) => {
  const [displayValue, setDisplayValue] = useState(initialValue);

  const handleKeyPress = (key) => {
    if (
      displayValue.length >= maxLength &&
      key !== "backspace" &&
      key !== "clear"
    ) {
      return;
    }

    let newValue = displayValue;

    if (key === "backspace") {
      newValue = displayValue.slice(0, -1);
    } else if (key === "clear") {
      newValue = "";
    } else if (key === "." && !displayValue.includes(".")) {
      newValue = displayValue + key;
    } else if (key !== ".") {
      newValue = displayValue + key;
    } else if (key === "." && displayValue === "") {
      newValue = "0.";
    }

    setDisplayValue(newValue);
    if (onValueChange) {
      onValueChange(Number(newValue));
    }
  };

  const handleUpdateAndClose = () => {
    onClose((prev) => !prev);
  };

  return (
    <div className="numeric-keypad">
      {/* Display */}
      <div className="keypad-display">{displayValue || "0"}</div>

      {/* Keypad */}
      <div className="keypad-grid">
        {/* Row 1 */}
        <button
          className="keypad-button digit-button"
          onClick={() => handleKeyPress("7")}
        >
          7
        </button>
        <button
          className="keypad-button digit-button"
          onClick={() => handleKeyPress("8")}
        >
          8
        </button>
        <button
          className="keypad-button digit-button"
          onClick={() => handleKeyPress("9")}
        >
          9
        </button>

        {/* Row 2 */}
        <button
          className="keypad-button digit-button"
          onClick={() => handleKeyPress("4")}
        >
          4
        </button>
        <button
          className="keypad-button digit-button"
          onClick={() => handleKeyPress("5")}
        >
          5
        </button>
        <button
          className="keypad-button digit-button"
          onClick={() => handleKeyPress("6")}
        >
          6
        </button>

        {/* Row 3 */}
        <button
          className="keypad-button digit-button"
          onClick={() => handleKeyPress("1")}
        >
          1
        </button>
        <button
          className="keypad-button digit-button"
          onClick={() => handleKeyPress("2")}
        >
          2
        </button>
        <button
          className="keypad-button digit-button"
          onClick={() => handleKeyPress("3")}
        >
          3
        </button>

        {/* Row 4 */}
        <button
          className="keypad-button digit-button"
          onClick={() => handleKeyPress("0")}
        >
          0
        </button>
        <button
          className="keypad-button decimal-button"
          onClick={() => handleKeyPress(".")}
        >
          .
        </button>
        <button
          className="keypad-button backspace-button"
          onClick={() => handleKeyPress("backspace")}
        >
          ⌫
        </button>

        {/* Clear button */}
        <button
          className="keypad-button clear-button"
          onClick={() => handleKeyPress("clear")}
        >
          Clear
        </button>
        <button
          onClick={handleUpdateAndClose}
          className="keypad-button submit-button"
        >
          <FaCheckCircle />
        </button>
      </div>
    </div>
  );
};

const EmployeeInterface = () => {
  const [selectedItems, setSelectedItems] = useState({});
  const [miscellaneousItem, setMiscellaneousItem] = useState({
    name: "",
    price: "",
  });
  const [orderTotal, setOrderTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageDatas, setPageDatas] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [error, setError] = useState(false);
  const keysToQuery = [
    "customerSetup",
    "businessId",
    "businessName",
    "vendorWalletAddress",
    "vendorPaymentNetwork",
    "interfaceSetup",
    "customerSetup",
    "approvedReadOnlyEmployees",
    "emailAddress",
    "logo",
  ];
  const [generateQr, setGenerateQr] = useState(false);
  const [isOrderDetailsShow, setIsOrderDetailsShow] = useState(false);
  const [parentExpressions, setParentExpressions] = useState([]);
  const addTrailingZeroes = (inputValue) => {
    return `$${inputValue.toFixed(2)}`;
  };

  useEffect(() => {}, [isOrderDetailsShow]);

  const DisplayTotal = ({ orderTotal }) => {
    return (
      <div className="order-total-wrapper-container">
        <div className="order-total-wrapper">
          <div className={orderTotal !== "$0.00" ? "space-between" : "center"}>
            <h2></h2>
            <h2>Total Price: {orderTotal}</h2>
            <button
              onClick={() => setGenerateQr(true)}
              className={orderTotal !== "$0.00" ? "show-button" : ""}
            >
              <span>Generate QR Code</span>
              <FaCheckCircle />
            </button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const getPageDatas = async () => {
      try {
        const currentData = await retrieveExistingData(keysToQuery);
        console.log("Retrieved data:", currentData);

        if (currentData.response?.businessId) {
          setPageDatas(currentData.response);
          console.log(currentData.response);
        } else if (currentData.status === 500) {
          setError(true);
          console.error("Error retrieving data.");
        }
      } catch (getDataError) {
        setError(true);
        console.error("Error retrieving data:", getDataError);
      }
    };
    if (!pageDatas) {
      getPageDatas();
    }
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [pageDatas]);

  const handleItemSelect = (groupIndex, itemIndex, e) => {
    e.stopPropagation();
    const itemId = `${groupIndex}-${itemIndex}`;
    console.log(selectedItems);
    setSelectedItems((prevItems) => {
      const newItems = { ...prevItems };
      if (!newItems[itemId]) {
        newItems[itemId] = 1;
      }
      return newItems;
    });
  };

  const handleDeselectItem = (groupIndex, itemIndex) => {
    const itemId = `${groupIndex}-${itemIndex}`;
    setSelectedItems((prevItems) => {
      const newItems = { ...prevItems };
      if (newItems[itemId] === 0) {
        delete newItems[itemId];
      }
      return newItems;
    });
  };

  const handleQuantityChange = (groupIndex, itemIndex, change, e) => {
    e.stopPropagation();
    const itemId = `${groupIndex}-${itemIndex}`;
    setSelectedItems((prevItems) => {
      const newItems = { ...prevItems };
      if (newItems[itemId]) {
        newItems[itemId] += change;
        if (newItems[itemId] <= 0) {
          handleDeselectItem(groupIndex, itemIndex);
        }
      }
      return newItems;
    });
  };

  const handleMiscellaneousChange = (e) => {
    const { name, value } = e.target;
    setMiscellaneousItem((prevItem) => ({ ...prevItem, [name]: value }));
  };

  const handleAddToOrder = () => {
    if (miscellaneousItem.name && miscellaneousItem.price) {
      setOrderTotal(
        (prevTotal) => prevTotal + parseFloat(miscellaneousItem.price)
      );
      setMiscellaneousItem({ name: "", price: "" }); // Reset input fields
    }
  };

  const handleSubmitOrder = () => {
    // Calculate the total price of selected items
    let total = 0;
    for (const itemId in selectedItems) {
      if (selectedItems.hasOwnProperty(itemId)) {
        const [groupIndex, itemIndex] = itemId.split("-").map(Number);
        const item = pageDatas.interfaceSetup[groupIndex].items[itemIndex];
        total += parseFloat(item.price) * selectedItems[itemId];
      }
    }

    // Add miscellaneous item price, if any
    if (miscellaneousItem.price) {
      total += parseFloat(miscellaneousItem.price);
    }

    setOrderTotal(total);
    alert(`Order Submitted! Total: $${total.toFixed(2)}`);
    // Here you would typically send the order data to your backend
  };

  if (loading) {
    return (
      <div
        className="modal-overlay"
        style={{
          display: "flex",
          alignItems: "center",
          background: "rgb(0 0 0 / 75%)",
        }}
      >
        <div className="modal">
          <div className="loading-dialog">
            <p>Loading...</p>
            <div className="spinner" style={{ marginLeft: "15%" }}></div>
          </div>
        </div>
      </div>
    );
  } else {
    if (generateQr) {
      return (
        <QRComponent
          pageDatas={pageDatas}
          orderTotal={orderTotal}
          isOrderDetailsShow={isOrderDetailsShow}
          setIsOrderDetailsShow={setIsOrderDetailsShow}
        />
      );
    } else if (pageDatas.customSetup && pageDatas.customSetup.isCustomized) {
      return (
        <div className="user-interface">
          <InterfaceHeader pageDatas={pageDatas} />
          <div className="pages">
            {pageDatas.interfaceSetup && (
              <>
                <div key={pageIndex} className="page">
                  <h3>
                    {pageDatas.interfaceSetup[pageIndex].groupName ||
                      `Page ${pageIndex + 1}`}
                  </h3>
                  <ul className="item-list">
                    {pageDatas.interfaceSetup[pageIndex].items.map(
                      (item, itemIndex) => {
                        const itemId = `${pageIndex}-${itemIndex}`;
                        const isSelected = selectedItems[itemId] !== undefined;
                        if (item.name && item.name.length > 0) {
                          return (
                            <li
                              key={itemIndex}
                              className={`interface-item ${
                                isSelected ? "selected" : ""
                              }`}
                              onClick={(e) =>
                                handleItemSelect(pageIndex, itemIndex, e)
                              }
                            >
                              <div>
                                {item.name} - ${item.price}
                              </div>
                              {isSelected && (
                                <div className="quantity-controls">
                                  <div className="quantity-display">
                                    <p>{selectedItems[itemId]}</p>
                                  </div>
                                  <div className="add-subtract-controls">
                                    <div
                                      onClick={(e) =>
                                        handleQuantityChange(
                                          pageIndex,
                                          itemIndex,
                                          1,
                                          e
                                        )
                                      }
                                    >
                                      <FaPlus />
                                    </div>
                                    <div
                                      onClick={(e) =>
                                        handleQuantityChange(
                                          pageIndex,
                                          itemIndex,
                                          -1,
                                          e
                                        )
                                      }
                                    >
                                      <FaMinus />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </li>
                          );
                        }
                      }
                    )}
                  </ul>
                </div>
              </>
            )}
          </div>

          <div className="miscellaneous">
            <h3>Miscellaneous Item</h3>
            <input
              type="text"
              name="name"
              placeholder="Item Name"
              value={miscellaneousItem.name}
              onChange={handleMiscellaneousChange}
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={miscellaneousItem.price}
              onChange={handleMiscellaneousChange}
            />
            <button onClick={handleAddToOrder}>Add To Order</button>
          </div>

          <button className="submit-order" onClick={handleSubmitOrder}>
            Submit Order
          </button>

          <div className="order-summary">
            <h3>Order Total: ${orderTotal.toFixed(2)}</h3>
          </div>
        </div>
      );
    } else {
      return (
        <div className="user-interface">
          <InterfaceHeader pageDatas={pageDatas} />
          <Calculator
            setOrderTotal={setOrderTotal}
            setParentExpressions={setParentExpressions}
          />
          <DisplayTotal orderTotal={addTrailingZeroes(orderTotal)} />
        </div>
      );
    }
  }
};

export default EmployeeInterface;
