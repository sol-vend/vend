import React from 'react';
import { useItems } from '../Contexts/ItemsContext';

const Items = () => {
  const { selectedItem, selectItem } = useItems(); // Access selectedItem and selectItem from context

  const items = [
    { name: 'T-Shirt', price: 19.99 },
    { name: 'Hat', price: 9.99 },
    { name: 'Chips', price: 2.49 },
    { name: 'Cigars', price: 14.99 },
    { name: 'Mug', price: 12.00 },
  ];

  // Handle item click to select the item
  const handleClick = (item) => {
    selectItem(item); // Set the clicked item as the selected item
  };

  return (
    <div className="items-container">
      <h2>Items for Sale</h2>
      <div className="items-list">
        {items.map((item, index) => (
          <div
            key={index}
            className={`item ${selectedItem?.name === item.name ? 'selected-item' : ''}`} // Add 'selected-item' class if it's the selected item
            onClick={() => handleClick(item)}  // Handle item click
          >
            <h3>{item.name}</h3>
            <p>Price: ${item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Items;
