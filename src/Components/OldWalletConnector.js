import React, { useContext, useEffect, useState, useRef, useMemo } from 'react';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter, SolletWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { API_URL, JUP_SWAP_API_URL, JUP_PRICE_API_URL, PRICE_BUFFER_PREMIA, ROUNDING_ORDER_MAG, SOL_MINT_ADDRESS, SOL_IMG_URL } from './Shared';
import { useItems } from '../Contexts/ItemsContext';
import SwapButton from './SwapButton';

// Setup wallet network and wallet adapters
const network = 'mainnet-beta'; // You can change this to 'devnet' or 'testnet'
const endpoint = useMemo(() => clusterApiUrl(network), [network]);

const wallets = useMemo(() => [
  new PhantomWalletAdapter(),
  new SolletWalletAdapter({ network }),
], [network]);

const WalletConnector = () => {
  const { publicKey, connect, disconnect, connected } = useWallet(); // Access wallet connection
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [swapMinimum, setSwapMinimum] = useState(null);
  const { selectedItem } = useItems();
  const [tokenImages, setTokenImages] = useState({});
  const [start, setStart] = useState(0); // For pagination
  const [limit, setLimit] = useState(10);
  const [hasMoreTokens, setHasMoreTokens] = useState(true);
  const observer = useRef();

  // Function to fetch tokens
  const fetchTokens = async () => {
    if (!publicKey || !hasMoreTokens) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/get_wallet_contents?wallet-address=${publicKey.toString()}&start=${start}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const tokenAccounts = await response.json();
      setTokens(prevTokens => [...prevTokens, ...tokenAccounts]);

      if (tokenAccounts.length < limit) {
        setHasMoreTokens(false); // No more tokens to load
      }
    } catch (error) {
      console.log('Error fetching token accounts:', error.message);
      alert('Failed to fetch tokens. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (publicKey) {
      fetchTokens();
    }
  }, [publicKey, start]); // Fetch tokens when publicKey or start changes

  const handleTokenClick = (token) => {
    setSelectedToken(token);
  };

  useEffect(() => {
    const fetchTokenImages = async () => {
      const images = {};
      await Promise.all(tokens.map(async (token) => {
        if (token.metadata && token.metadata.data) {
          const uri = token.metadata.data.uri;
          try {
            const response = await fetch(uri);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data.image) {
              images[token.mint] = data.image;
            }
          } catch (error) {
            console.error('Error fetching image:', error.message);
          }
        }
      }));
      images[SOL_MINT_ADDRESS] = SOL_IMG_URL;
      setTokenImages(images);
    };

    if (tokens.length > 0) {
      fetchTokenImages();
    }
  }, [tokens]);

  const lastTokenElementRef = useRef();

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0
    };

    const callback = (entries) => {
      if (entries[0].isIntersecting && !loading && hasMoreTokens) {
        setStart((prevStart) => prevStart + limit);
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

  // Fetch quote for swap based on selected token and selected item
  useEffect(() => {
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
              setSwapMinimum((selectedItem["Item Price"] * (1 + PRICE_BUFFER_PREMIA)) / price);
            } else {
              setSwapMinimum(null);
            }
          } else {
            setSwapMinimum(null);
          }
        } catch (error) {
          setSwapMinimum(null);
        }
      };

      fetchQuote();
    }
  }, [selectedItem, selectedToken]);

  return (
    <div>
      <div className="banner">
        <h1 className="site-title">Sol-Vend</h1>
        <button className="button connect-button" onClick={connected ? disconnect : connect}>
          {connected ? `Connected: ${publicKey.toString()}` : 'Connect Wallet'}
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
            <SwapButton 
              wallet={{ publicKey, connected }} 
              inputMint={selectedToken} 
              inputAmount={swapMinimum} 
              slippageInBps={50} 
              buttonDialog={`Swap for ${Math.round(Math.pow(10, (ROUNDING_ORDER_MAG - 1)) * swapMinimum, ROUNDING_ORDER_MAG) / Math.pow(10, (ROUNDING_ORDER_MAG - 1))} ${selectedToken.metadata?.data?.name || 'Solana'}`} 
            />
          </div>
      )}

      {tokens.length > 0 ? (
        <div className="token-list">
          <h3>Select Payment Method:</h3>
          {tokens.map((token, index) => (
            <div
              className="token-item"
              key={index}
              onClick={() => handleTokenClick(token)}
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
              {tokenImages[token.mint] && (
                <img src={tokenImages[token.mint]} style={{ maxWidth: '50px', height: 'auto', marginLeft: '10px' }} />
              )}
            </div>
          ))}
          <div ref={lastTokenElementRef} />
        </div>
      ) : (
        connected && !loading && <div>No tokens found.</div>
      )}
    </div>
  );
};


