import '../App.css';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { API_URL } from './Shared';
import { useItems } from '../Contexts/ItemsContext';
import FetchImages from './FetchImages';

const JUP_SWAP_API_URL = 'https://quote-api.jup.ag/v6/quote'; // Jupiter API URL
const JUP_PRICE_API_URL = 'https://api.jup.ag/price/v2?ids=';
const PRICE_BUFFER_PREMIA = 0.05; // Percent increase in ask to ensure we clear minimum price
const ROUNDING_ORDER_MAG = 5;
const SOL_MINT_ADDRESS = 'So11111111111111111111111111111111111111112';
const SOL_IMG_URL = 'https://wsrv.nl/?w=128&h=128&default=1&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.png';

const WalletConnector = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null); // Store selected token here
  const [swapMinimum, setSwapMinimum] = useState(null);
  const [start, setStart] = useState(0); // For pagination
  const [limit, setLimit] = useState(10); // Number of tokens to fetch
  const [hasMoreTokens, setHasMoreTokens] = useState(true); // Flag to track if more tokens are available
  const [tokenImages, setTokenImages] = useState({}); // State to store token images
  const { selectedItem } = useItems(); // Get selectedItem from context

  const observer = useRef(); // Create a ref for the observer

  const connectWallet = async () => {
    if (window.solana) {
      const response = await window.solana.connect();
      setWalletAddress(response.publicKey.toString());
    } else {
      alert('Phantom wallet not found! Please install it.');
    }
  };

  const fetchTokens = async () => {
    if (!walletAddress || !hasMoreTokens) return; // Don't fetch if no more tokens

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/get_wallet_contents?wallet-address=${walletAddress}&start=${start}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const tokenAccounts = await response.json();
      setTokens(prevTokens => [...prevTokens, ...tokenAccounts]); // Append new tokens to existing state

      // Check if the number of tokens returned is less than the limit
      if (tokenAccounts.length < limit) {
        setHasMoreTokens(false); // No more tokens to load
      }
      console.log(tokenAccounts);
    } catch (error) {
      console.log('Error fetching token accounts:', error.message);
      alert('Failed to fetch tokens. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchTokens();
    }
  }, [walletAddress, start]); // Fetch tokens when walletAddress or start changes

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
              setSwapMinimum(null);
            }
          } else {
            console.error('No quote found for the selected token.');
            setSwapMinimum(null);
          }
        } catch (error) {
          console.error('Error fetching quote from Jupiter:', error.message);
          setSwapMinimum(null);
        }
      };

      fetchQuote();
    }
  }, [selectedItem, selectedToken]); // Add selectedItem and selectedToken as dependencies

  const handleTokenClick = (token) => {
    setSelectedToken(token); // Set the clicked token as the selected token
  };

  const lastTokenElementRef = useRef();

  useEffect(() => {
    const fetchTokenImages = async () => {
      const images = {};
      await Promise.all(tokens.map(async (token) => {
        if (token.metadata && token.metadata.data) {
          const uri = token.metadata.data.uri;
          console.log('Fetching image from URI:', uri); // Log the URI being fetched

          try {
            const response = await fetch(uri);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();

            // Check for the image key and store the URL
            if (data.image) {
              images[token.mint] = data.image; // Store image URL keyed by token mint
            } else {
              console.warn(`No image found for token mint ${token.mint}`);
            }
          } catch (error) {
            console.error('Error fetching image:', error.message);
          }
        }           
      }));
      images[SOL_MINT_ADDRESS] = SOL_IMG_URL;
      setTokenImages(images); // Update state with all token images
    };

    if (tokens.length > 0) {
      fetchTokenImages();
    }
  }, [tokens]); // Run effect when tokens change

  useEffect(() => {
    const options = {
      root: null, // Use the viewport as the root
      rootMargin: '0px',
      threshold: 1.0 // Trigger when the last token element is fully visible
    };

    const callback = (entries) => {
      if (entries[0].isIntersecting && !loading && hasMoreTokens) {
        setStart((prevStart) => prevStart + limit); // Increment start to load more tokens
      }
    };

    observer.current = new IntersectionObserver(callback, options);
    if (lastTokenElementRef.current) {
      observer.current.observe(lastTokenElementRef.current);
    }

    return () => {
      if (lastTokenElementRef.current) {
        observer.current.unobserve(lastTokenElementRef.current);
      }
    };
  }, [loading, tokens, hasMoreTokens]);

  return (
    <div>
      {/* Banner */}
      <div className="banner">
        <h1 className="site-title">Sol-Vend</h1>
        <button className="button connect-button" onClick={connectWallet}>
          {walletAddress ? `Connected: ${walletAddress}` : 'Connect Wallet'}
        </button>
      </div>

      {loading && <div>Loading tokens...</div>}

      {selectedToken && (
        swapMinimum == null ?
          <div className="swap-info">
            <h4>{selectedItem == null ? "Select Item" : "Quote Unavailable for token"}</h4>
          </div>
          :
          <div className="swap-info">
            <h4>Approve Swap of {Math.round(Math.pow(10, (ROUNDING_ORDER_MAG - 1)) * swapMinimum, ROUNDING_ORDER_MAG) / Math.pow(10, (ROUNDING_ORDER_MAG - 1))} {selectedToken.metadata?.data?.name || 'Solana'}</h4>
          </div>
      )}

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
              <span>Symbol: {Object.keys(token.metadata).includes('data') ? token.metadata.data.symbol : 'SOL'}</span>
              <span>Amount: {Math.round(Math.pow(10, (ROUNDING_ORDER_MAG - 1)) * token.uiAmount, ROUNDING_ORDER_MAG) / Math.pow(10, (ROUNDING_ORDER_MAG - 1))}</span>
              {/* Render image if available */}
              {tokenImages[token.mint] && (
                <img src={tokenImages[token.mint]} style={{ maxWidth: '50px', height: 'auto', marginLeft: '10px' }} />
              )}
            </div>
          ))}
          <div ref={lastTokenElementRef} /> {/* Sentinel element for infinite scroll */}
        </div>
      ) : (
        walletAddress && !loading && <div>No tokens found.</div>
      )}

    </div>
  );
}

export default WalletConnector;

//              <span>Token: {Object.keys(token.metadata).includes('data') ? token.metadata.data.name : 'Solana'}</span>