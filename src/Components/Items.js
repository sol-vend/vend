import React, { useState, useEffect } from 'react';
import { useItems } from '../Contexts/ItemsContext';
import { API_URL } from './Shared';

const Items = () => {
  const { selectedItem, selectItem } = useItems(); // Access selectedItem and selectItem from context
  const [hashValue, setHashValue] = useState('');
  const [itemAddress, setItemAddress] = useState(null); // Initialize as null for better checking
  let selectVendMessage = ""

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const hashWithoutHash = hash.substring(1);
      setHashValue(hashWithoutHash);
    } else {
      selectVendMessage = "Select the item you want to purchase and try again..."
    }
  }, []);

  useEffect(() => {
    const fetchSelectionAddress = async () => {
      if (hashValue) {
        try {
          const response = await fetch(`${API_URL}/api/get_selection_address`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "encrypted-data": hashValue }),
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const selectionAddress = await response.json();
          setItemAddress(selectionAddress);
        } catch (error) {
          console.error('Error:', error.message);
        }
      }
    };

    fetchSelectionAddress();
  }, [hashValue]); // Run effect when hashValue changes

  useEffect(() => {
    if (itemAddress) {
      selectItem(itemAddress["selected-item-details"]);
    }
  }, [itemAddress, selectItem]); // Add selectItem to dependencies

  return (
    selectedItem == null ? (
      <div>
        <h2>{selectVendMessage}</h2>
      </div>
    ) : (
      <div className="items-container">
        <h2>Selected Item</h2>
        <div className="items-list">

          <div
            key={selectedItem}
            className={`item selected-item`}
          >
            <h3>{selectedItem["Item Name"]}</h3>
            <p>Price: ${selectedItem["Item Price"]}</p>
          </div>

        </div>
      </div>
    )
  );
};

export default Items;
