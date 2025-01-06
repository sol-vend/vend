import React, { createContext, useState } from 'react';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null); 

  const connectWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        const response = await window.solana.connect();
        const newWallet = {
          publicKey: response.publicKey.toString(),
          connected: true,
        };
        setWallet(newWallet);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      alert("Phantom wallet not found! Please install it.");
    }
  };

  return (
    <WalletContext.Provider value={{ wallet, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

