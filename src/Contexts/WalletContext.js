import React, { createContext, useState } from 'react';

// Create WalletContext
export const WalletContext = createContext();

// WalletProvider component
export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);  // Store wallet data (null initially)

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

