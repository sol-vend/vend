import React, { useState, useEffect, useRef } from "react";
import {
  FaPlus,
  FaMinus,
  FaCheckCircle,
  FaSyncAlt,
  FaArrowLeft,
  FaArrowRight,
  FaCalculator,
} from "react-icons/fa";
import { retrieveExistingData } from "../Shared";
import "./EmployeeInterface.css";
import "./NumericKeypad.css";
import Calculator from "./Calculator";
import QRComponent from "./QRComponent";

const InterfaceHeader = ({ pageDatas }) => {
  return (
    <div className="employee-interface-header">
      <h2>{pageDatas.businessName}</h2>
      {pageDatas.logo && <img src={pageDatas.logo.file} alt="Business Logo" />}
      <p>@{pageDatas.businessId}</p>
    </div>
  );
};

const EmployeeInterface = () => {
  const [selectedItems, setSelectedItems] = useState({});
  const [receiptDetails, setReceiptDetails] = useState({});
  const [lastSelectedItemId, setLastSelectedItemId] = useState(null);
  const [orderTotal, setOrderTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageDatas, setPageDatas] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [showCalculator, setShowCalculator] = useState(false);
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
  const [parentExpressions, setParentExpressions] = useState({
    receipt: [],
    miscellaneous: [],
  });
  const [childCalculatorOrderTotal, setChildCalculatorOrderTotal] = useState(0);

  const handleOrderRestart = () => {
    setPageIndex(0);
    setSelectedItems({});
    setShowCalculator(false);
    setOrderTotal(0);
    setGenerateQr(false);
    setIsOrderDetailsShow(false);
    setParentExpressions({
      receipt: [],
      miscellaneous: [],
    });
    setChildCalculatorOrderTotal(0);
    setReceiptDetails({});
    setLastSelectedItemId(null);
  };

  const addTrailingZeroes = (inputValue) => {
    return `$${inputValue.toFixed(2)}`;
  };

  const addMiscToTotal = () => {
    setOrderTotal((prev) => prev + childCalculatorOrderTotal);
    setChildCalculatorOrderTotal(0);
  };

  const DisplayTotal = ({ orderTotal, isChild }) => {
    return (
      <div className="order-total-wrapper-container">
        <div className="order-total-wrapper">
          <div className={orderTotal !== "$0.00" ? "space-between" : "center"}>
            {!isChild && <h2></h2>}
            <h2>
              {!isChild
                ? `Total Price: ${orderTotal}`
                : `Misc. Items: $${childCalculatorOrderTotal.toFixed(2)}`}
            </h2>
            {!isChild ? (
              <button
                onClick={() => setGenerateQr(true)}
                className={orderTotal !== "$0.00" ? "show-button" : ""}
              >
                <span>Ready for Customer Payment</span>
                <FaCheckCircle />
              </button>
            ) : (
              <button
                onClick={addMiscToTotal}
                className={childCalculatorOrderTotal !== 0 ? "show-button" : ""}
              >
                <span>Add to Price Total</span>
                <FaCheckCircle />
              </button>
            )}
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
    if (pageDatas && pageDatas.businessId) {
      setLoading(false);
    }
  }, [pageDatas]);

  useEffect(() => {
    handleOrderTotal();
  }, [selectedItems]);

  const handleItemSelect = (groupIndex, itemIndex, e) => {
    e.stopPropagation();
    const itemId = `${groupIndex}-${itemIndex}`;

    // If a different item was previously selected, reset its selection state
    if (lastSelectedItemId && lastSelectedItemId !== itemId) {
      setLastSelectedItemId(itemId);
    } else {
      // If clicking the same item, toggle its selection
      setLastSelectedItemId(itemId);
    }

    // Ensure quantity is maintained or initialized
    setSelectedItems((prevItems) => {
      const newItems = { ...prevItems };
      if (!newItems[itemId]) {
        newItems[itemId] = 1; // Initialize quantity to 1 if not existing
      }
      return newItems;
    });
  };

  const handleQuantityChange = (groupIndex, itemIndex, change, e) => {
    e.stopPropagation();
    const itemId = `${groupIndex}-${itemIndex}`;
    setSelectedItems((prevItems) => {
      const newItems = { ...prevItems };
      if (newItems[itemId] !== undefined) {
        newItems[itemId] += change;
        if (newItems[itemId] <= 0) {
          delete newItems[itemId];
          if (itemId === lastSelectedItemId) {
            setLastSelectedItemId(null);
          }
        }
      }
      return newItems;
    });
  };

  useEffect(() => {
    Object.keys(selectedItems).map((itemId) => {
      const groupIndex = Number(itemId.split("-")[0]);
      const itemIndex = Number(itemId.split("-")[1]);
      const pageName = pageDatas.interfaceSetup[groupIndex].groupName;
      const itemName =
        pageDatas.interfaceSetup[groupIndex].items[itemIndex].name;
      const itemPrice =
        pageDatas.interfaceSetup[groupIndex].items[itemIndex].price;
      const itemQuantity = selectedItems[itemId];
      setReceiptDetails((prev) => ({
        ...prev,
        [itemId]: `${pageName}: ${itemName} (${itemQuantity}) @ $${itemPrice}`,
      }));
    });
  }, [selectedItems]);

  useEffect(() => {
    setParentExpressions((prev) => ({
      ...prev,
      receipt: receiptDetails,
    }));
  }, [receiptDetails]);

  /*const handleAddToOrder = () => {
    if (miscellaneousItem.name && miscellaneousItem.price) {
      setOrderTotal(
        (prevTotal) => prevTotal + parseFloat(miscellaneousItem.price)
      );
      setMiscellaneousItem({ name: "", price: "" }); // Reset input fields
    }
  };
*/
  const handleOrderTotal = () => {
    // Calculate the total price of selected items
    let total = 0;
    for (const itemId in selectedItems) {
      if (selectedItems.hasOwnProperty(itemId)) {
        const [groupIndex, itemIndex] = itemId.split("-").map(Number);
        const item = pageDatas.interfaceSetup[groupIndex].items[itemIndex];
        total += parseFloat(item.price) * selectedItems[itemId];
      }
    }
    setOrderTotal(total);
    // Here you would typically send the order data to your backend
  };

  const handleSubmitOrder = () => {
    if (!generateQr) {
      setGenerateQr(true);
    }
  };

  const handlePageDecrement = () => {
    if (showCalculator) {
      setShowCalculator(false);
      setPageIndex(pageDatas.interfaceSetup.length - 1);
    } else if (pageIndex > 0) {
      setPageIndex((prev) => (prev -= 1));
    }
  };

  const handlePageIncrement = () => {
    if (pageIndex + 1 <= pageDatas.interfaceSetup.length - 1) {
      setPageIndex((prev) => (prev += 1));
    } else if (pageIndex + 1 === pageDatas.interfaceSetup.length) {
      setShowCalculator(true);
    }
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
          setGoBack={setGenerateQr}
          parentExpressions={parentExpressions}
        />
      );
    } else if (
      pageDatas.customerSetup &&
      pageDatas.customerSetup.isCustomized
    ) {
      return (
        <>
          <div className="user-interface">
            <InterfaceHeader pageDatas={pageDatas} />
            <div className="user-interface-page-container-wrapper">
              <nav className="user-interface-page-container">
                <div className="pages">
                  {pageDatas.interfaceSetup && (
                    <>
                      <div key={pageIndex} className="page">
                        <div className="page-header-wrapper">
                          <div
                            onClick={handlePageDecrement}
                            className={`employee-interface-increment-decrement${
                              pageIndex === 0 ? " disabled" : ""
                            }`}
                            style={
                              pageIndex > 0 ? { opacity: 1 } : { opacity: 0 }
                            }
                          >
                            <FaArrowLeft size={"2em"} color="white" />
                          </div>

                          <h3>
                            {!showCalculator
                              ? pageDatas.interfaceSetup[pageIndex].groupName ||
                                `Page ${pageIndex + 1}`
                              : "Miscellaneous"}
                          </h3>
                          <div
                            onClick={handlePageIncrement}
                            className={`employee-interface-increment-decrement${
                              showCalculator ? " disabled" : ""
                            }`}
                          >
                            {pageIndex < pageDatas.interfaceSetup.length - 1 ? (
                              <FaArrowRight
                                size={"2em"}
                                color="white"
                                style={
                                  pageIndex <
                                  pageDatas.interfaceSetup.length - 1
                                    ? { opacity: 1 }
                                    : { opacity: 0 }
                                }
                              />
                            ) : (
                              <FaCalculator
                                size={"2em"}
                                color="white"
                                style={{ opacity: 1 }}
                              />
                            )}
                          </div>
                        </div>
                        {!showCalculator ? (
                          <div className="item-list">
                            {pageDatas.interfaceSetup[pageIndex].items.map(
                              (item, itemIndex) => {
                                const itemId = `${pageIndex}-${itemIndex}`;
                                const isSelected =
                                  lastSelectedItemId === itemId;
                                const quantity = selectedItems[itemId] || 0;

                                if (item.name && item.name.length > 0) {
                                  return (
                                    <div
                                      key={itemIndex}
                                      className={`interface-item group-phone-display-button ${
                                        isSelected ? "selected" : ""
                                      }`}
                                      onClick={(e) =>
                                        handleItemSelect(
                                          pageIndex,
                                          itemIndex,
                                          e
                                        )
                                      }
                                    >
                                      <p>{item.name}</p>
                                      {isSelected && (
                                        <div className="quantity-controls">
                                          <div className="quantity-display">
                                            <p>{quantity}</p>
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
                                    </div>
                                  );
                                }
                              }
                            )}
                          </div>
                        ) : (
                          <div className="user-interface">
                            <Calculator
                              setOrderTotal={setChildCalculatorOrderTotal}
                              setParentExpressions={setParentExpressions}
                              startOrderTotal={childCalculatorOrderTotal}
                              isChild={true}
                            />
                            <DisplayTotal orderTotal={0} isChild={true} />{" "}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </nav>
            </div>
            <div className="interface-order-summary-wrapper-fixed">
              <div className="interface-order-summary-wrapper">
                <button className="submit-order" onClick={handleSubmitOrder}>
                  Submit Order
                </button>
                <div className="order-summary">
                  <h3>Order Total: ${orderTotal.toFixed(2)}</h3>
                </div>
                <button
                  onClick={handleOrderRestart}
                  className="submit-order clear"
                >
                  Restart Order
                </button>
              </div>
              {Object.keys(receiptDetails).length > 0 && (
                <div className="interface-order-summary-wrapper receipt">
                  {Object.keys(receiptDetails).map((itemAddress) => {
                    return <p>{receiptDetails[itemAddress]}</p>;
                  })}
                </div>
              )}
            </div>
          </div>
        </>
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
