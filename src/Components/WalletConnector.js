import '../App.css';
import React, { useContext, useEffect, useState } from 'react';
import { API_URL } from './Shared';
import { useItems } from '../Contexts/ItemsContext';

const JUP_SWAP_API_URL = 'https://quote-api.jup.ag/v6/quote'; // Jupiter API URL
const JUP_PRICE_API_URL = 'https://api.jup.ag/price/v2?ids='
const PRICE_BUFFER_PREMIA = 0.05;  // Percent increase in ask to ensure we clear minimum price

const WalletConnector = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null); // Store selected token here
  const [swapMinimum, setSwapMinimum] = useState(null);
  const { selectedItem } = useItems(); // Get selectedItem from context

  const connectWallet = async () => {
    if (window.solana) {
      const response = await window.solana.connect();
      setWalletAddress(response.publicKey.toString());
    } else {
      alert('Phantom wallet not found! Please install it.');
    }
  };

  const fetchTokens = async () => {
    if (!walletAddress) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/get_wallet_contents?wallet-address=${walletAddress}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const tokenAccounts = await response.json();
      setTokens(tokenAccounts); // Update state with token data
    } catch (error) {
      console.error('Error fetching token accounts:', error.message);
      alert('Failed to fetch tokens. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchTokens();
    }
  }, [walletAddress]);

  useEffect(() => {
    // Only fetch the quote and calculate swap minimum if selectedItem changes
    if (selectedItem && selectedToken) {
      const mintAddress = selectedToken.mint;

      const fetchQuote = async () => {
        try {
          const response = await fetch(`${JUP_PRICE_API_URL}${mintAddress},So11111111111111111111111111111111111111112`);
          const data = await response.json();
          if (data.data) {
            const quote = data.data; 
            const price = quote[mintAddress]?.price;
            if (price) {
              setSwapMinimum((selectedItem.price * (1 + PRICE_BUFFER_PREMIA)) / price);
            } else {
              console.error('Price data for token not found.');
            }
          } else {
            console.error('No quote found for the selected token.');
          }
        } catch (error) {
          console.error('Error fetching quote from Jupiter:', error.message);
        }
      };

      fetchQuote();
    }
  }, [selectedItem, selectedToken]); // Add selectedItem and selectedToken as dependencies

  const handleTokenClick = (token) => {
    setSelectedToken(token);  // Set the clicked token as the selected token
  };

  return (
    <div>
      <div className="container">
        <button className="button" onClick={connectWallet}>
          {walletAddress ? `Connected: ${walletAddress}` : 'Connect Wallet'}
        </button>
      </div>

      {loading && <div>Loading tokens...</div>}

      {tokens.length > 0 ? (
        <div className="token-list">
          <h3>Select Payment Method:</h3>
          {tokens.map((token, index) => (
            <div
              className="token-item"
              key={index}
              onClick={() => handleTokenClick(token)} // Add onClick to handle token selection
              style={{
                cursor: 'pointer',
                border: selectedToken && selectedToken.mint === token.mint ? '2px solid green' : 'none',
                padding: '10px',
                margin: '5px',
                backgroundColor: selectedToken && selectedToken.mint === token.mint ? '#e0f7e0' : '#f5f5f5',
              }}
            >
              <span>Token: {Object.keys(token.metadata).includes('data') ? token.metadata.data.name : 'Solana'}</span>
              <span>Symbol: {Object.keys(token.metadata).includes('data') ? token.metadata.data.symbol : 'SOL'}</span>
              <span>Amount: {token.uiAmount}</span>
            </div>
          ))}
        </div>
      ) : (
        walletAddress && !loading && <div>No tokens found.</div>
      )}

      {selectedToken && (
        <div className="swap-info">
          <h4>Approve Swap of {swapMinimum} {selectedToken.metadata?.data?.name || 'Solana'}</h4>
        </div>
      )}
    </div>
  );
};

export default WalletConnector;
