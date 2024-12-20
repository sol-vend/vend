import React, { createContext, useState, useContext } from 'react';

// Create the context with an initial value
const ItemsContext = createContext();

// Create a provider component
export const ItemsProvider = ({ children }) => {
  // State to manage the selected item
  const [selectedItem, setSelectedItem] = useState(null);

  // Function to set the selected item
  const selectItem = (item) => {
    setSelectedItem(item);
  };

  return (
    <ItemsContext.Provider value={{ selectedItem, selectItem }}>
      {children}
    </ItemsContext.Provider>
  );
};

// Custom hook to use the context
export const useItems = () => {
  return useContext(ItemsContext);
};
