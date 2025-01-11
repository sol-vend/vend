import React, { useState, useEffect } from 'react';
import { useItems } from '../Contexts/ItemsContext';
import { API_URL } from './Shared';

const Items = () => {
  const { selectedItem, selectItem } = useItems();
  const [hashValue, setHashValue] = useState('');
  const [itemAddress, setItemAddress] = useState(null);
  const [urlCopied, setUrlCopied] = useState(false);
  const copySuccessText = "URL Copied";
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
  }, [hashValue]);

  useEffect(() => {
    if (itemAddress) {
      selectItem(itemAddress["selected-item-details"]);
    }
  }, [itemAddress, selectItem]);

  useEffect(() => {
    if (urlCopied){
      setTimeout(()=> {
        setUrlCopied(false)
      }, 5000);
    }
  }, [urlCopied])

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href).then(function () {
      setUrlCopied(true);
    }).catch(function (err) {
      console.error("Error copying text: ", err);
    });
  }

  return (
    selectedItem == null ? (
      <div>
        <h2>{selectVendMessage}</h2>
      </div>
    ) : (
      <div className="items-container">
        <div className="items-list">
          <div className='selected-item-wrapper'>
            <div
              key={selectedItem}
              className={`item selected-item`}
            >
              <h3>{selectedItem["Item Name"]}</h3>
              <p>Price: ${selectedItem["Item Price"]}</p>
            </div>
          </div>
        </div>
        <div className='copy-wrapper'>
          <button class="copy-btn" onClick={copyUrl}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M208 0L332.1 0c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9L448 336c0 26.5-21.5 48-48 48l-192 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48zM48 128l80 0 0 64-64 0 0 256 192 0 0-32 64 0 0 48c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 176c0-26.5 21.5-48 48-48z" /></svg>
          </button>
          {urlCopied && <div>{copySuccessText}</div>}
        </div>
      </div>
    )
  );
};

export default Items;
