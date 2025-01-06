import React, { createContext, useState, useContext } from 'react';

const ItemsContext = createContext();

export const ItemsProvider = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const selectItem = (item) => {
    setSelectedItem(item);
  };

  return (
    <ItemsContext.Provider value={{ selectedItem, selectItem }}>
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = () => {
  return useContext(ItemsContext);
};
