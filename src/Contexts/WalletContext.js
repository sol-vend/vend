import React, { createContext, useState, useContext } from 'react';

const WalletContext = createContext();

export const useWalletContext = () => {
  return useContext(WalletContext);
};

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);  // State to hold wallet address

  return (
    <WalletContext.Provider value={{ walletAddress, setWalletAddress }}>
      {children}
    </WalletContext.Provider>
  );
};

