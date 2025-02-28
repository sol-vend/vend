import React, { useState, useEffect } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { retrieveExistingData } from "../Shared";

const EmployeeInterface = () => {
  const [selectedItems, setSelectedItems] = useState({});
  const [miscellaneousItem, setMiscellaneousItem] = useState({
    name: "",
    price: "",
  });
  const [orderTotal, setOrderTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageDatas, setPageDatas] = useState(false);
  const [error, setError] = useState(false);
    const keysToQuery = [
    "businessId",
    "businessName",
    "vendorWalletAddress",
    "vendorPaymentNetwork",
    "interfaceSetup",
    "customerSetup",
    "approvedReadOnlyEmployees",
    "emailAddress",
  ];

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

  const handleItemSelect = (groupIndex, itemIndex) => {
    const itemId = `${groupIndex}-${itemIndex}`;
    setSelectedItems((prevItems) => {
      const newItems = { ...prevItems };
      if (newItems[itemId]) {
        delete newItems[itemId]; // Deselect
      } else {
        newItems[itemId] = 1; // Select with quantity 1
      }
      return newItems;
    });
  };

  const handleQuantityChange = (groupIndex, itemIndex, change) => {
    const itemId = `${groupIndex}-${itemIndex}`;
    setSelectedItems((prevItems) => {
      const newItems = { ...prevItems };
      if (newItems[itemId]) {
        newItems[itemId] += change;
        if (newItems[itemId] < 0) {
          newItems[itemId] = 0; // Prevent negative quantities
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
    return (
      <div className="user-interface">
        <div className="header">
          <h2>{pageDatas.businessId}</h2>
          <p>Business ID: {pageDatas.businessId}</p>
          {pageDatas.logo && <img src={pageDatas.logo} alt="Business Logo" />}
        </div>

        <div className="pages">
          {pageDatas.interfaceSetup && (
            <>
          {pageDatas.interfaceSetup.map((group, groupIndex) => (
            <div key={groupIndex} className="page">
              <h3>{group.groupName || `Page ${groupIndex + 1}`}</h3>
              <ul className="item-list">
                {group.items.map((item, itemIndex) => {
                  const itemId = `${groupIndex}-${itemIndex}`;
                  const isSelected = selectedItems[itemId] !== undefined;

                  return (
                    <li
                      key={itemIndex}
                      className={`item ${isSelected ? "selected" : ""}`}
                    >
                      <button
                        onClick={() => handleItemSelect(groupIndex, itemIndex)}
                      >
                        {item.name} - ${item.price}
                      </button>
                      {isSelected && (
                        <div className="quantity-controls">
                          <button
                            onClick={() =>
                              handleQuantityChange(groupIndex, itemIndex, -1)
                            }
                          >
                            <FaMinus />
                          </button>
                          <span>{selectedItems[itemId]}</span>
                          <button
                            onClick={() =>
                              handleQuantityChange(groupIndex, itemIndex, 1)
                            }
                          >
                            <FaPlus />
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
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
  }
};

export default EmployeeInterface;
