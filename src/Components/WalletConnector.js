import React, { useEffect, useState, useRef } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';  // Import hooks
import { API_URL, JUP_SWAP_API_URL, JUP_PRICE_API_URL, PRICE_BUFFER_PREMIA, ROUNDING_ORDER_MAG, SOL_MINT_ADDRESS, SOL_IMG_URL } from './Shared';
import SwapButton from './SwapButton';  // Swap button component
import { BaseWalletConnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useItems } from '../Contexts/ItemsContext';

const WalletConnector = () => {
  const { publicKey, connected, connect, disconnect, wallet } = useWallet();
  const { connection } = useConnection();  // Connection hook
  const { selectedItem } = useItems();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [swapMinimum, setSwapMinimum] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [hasMoreTokens, setHasMoreTokens] = useState(true);
  const [tokenImages, setTokenImages] = useState({});
  const lastTokenElementRef = useRef();
  // Log the wallet connection status
  useEffect(() => {
    console.log('Wallet connected:', connected);
    console.log('PublicKey:', publicKey);
  }, [connected, publicKey]);

  const handleTokenClick = (token) => {
    setSelectedToken(token);
  };

  const fetchTokens = async () => {
    if (!walletAddress || !hasMoreTokens) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/get_wallet_contents?wallet-address=${walletAddress}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const tokenAccounts = await response.json();
      setTokens(prevTokens => [...prevTokens, ...tokenAccounts]);

      if (tokenAccounts.length < 10) {
        setHasMoreTokens(false);
      }
    } catch (error) {
      console.error('Error fetching token accounts:', error.message);
    } finally {
      setLoading(false);
    }
  };
  const doConnectWallet = () => {
    setTimeout(() => { document.getElementsByClassName('wallet-adapter-button-start-icon')[0].parentElement.click() }, 250);
    setTimeout(connectWallet, 500);
  }

  const connectWallet = async () => {
    if (!connected) {
      console.log('Attempting to connect wallet...');
      try {
        await connect();  // Trigger the connection
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      console.log('Already connected!');
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnect();  // Disconnect the wallet
      setWalletAddress(null);
      setTokens([]);
      setSelectedToken(null);
      setSwapMinimum(null);
      window.location.reload()
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  useEffect(() => {
    if (publicKey) {
      setWalletAddress(publicKey.toString());
    }
  }, [publicKey]);

  useEffect(() => {
    if (walletAddress) {
      fetchTokens();
    }
  }, [walletAddress]); // Fetch tokens when walletAddress changes

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

  const abbr = (address) => {
    if (address){
    const visibleChars = 4
    return `${address.substring(0, visibleChars)}...${address.substring(address.length - visibleChars, address.length)}`
    }
    else{
      return ""
    }
  }

  return (
    <div>
      {/* Wallet Connection Section */}
      <div className="banner">
        {!connected ? (
          <div>
            <WalletMultiButton style={{
              backgroundColor: "#DC1FFF", /* Purple Dino */
              border: "none", /* Remove border */
              padding: "10px 15px", /* Button padding */
              color: "white", /* Button text color */
              cursor: "pointer", /* Pointer cursor on hover */
              borderRadius: "5px", /* Rounded corners */
              maxWidth: "12em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "inline-block",
            }}>
              <div onClick={doConnectWallet}>
                Connect Wallet
              </div>
            </WalletMultiButton>
          </div>
        ) : (
          <>
            <button className="button connect-button" onClick={disconnectWallet}>
              Disconnect Wallet
            </button>
            <p>Connected: {abbr(walletAddress)}</p>
          </>
        )}
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

export default WalletConnector;

