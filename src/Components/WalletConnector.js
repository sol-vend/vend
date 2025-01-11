import React, { useEffect, useState, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';  // Import hooks
import { API_URL, JUP_PRICE_API_URL, PRICE_BUFFER_PREMIA, ROUNDING_ORDER_MAG, SOL_MINT_ADDRESS, SOL_IMG_URL, UNKNOWN_SPL_TOKEN_IMG } from './Shared';
import SwapButton from './SwapButton';  // Swap button component
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useItems } from '../Contexts/ItemsContext';

const WalletConnector = ({ hash }) => {
  const { publicKey, connected, connect, disconnect } = useWallet();
  const { selectedItem } = useItems();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [swapMinimum, setSwapMinimum] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [hasMoreTokens, setHasMoreTokens] = useState(true);
  const [tokenImages, setTokenImages] = useState({});
  const [startIndex, setStartIndex] = useState(0);
  const tokenFetchLimit = 3;
  const lastTokenElementRef = useRef();
  const retrievedMintAddresses = [];

  useEffect(() => {
    if (hasMoreTokens) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchTokens();
          }
        },
        {
          rootMargin: '100px',
        }
      );

      if (lastTokenElementRef.current) {
        observer.observe(lastTokenElementRef.current);
      }

      return () => observer.disconnect();
    }
  }, [lastTokenElementRef, tokens]);


  const handleTokenClick = (token) => {
    setSelectedToken(token);
  };

  const updateTokenBalance = async (updateMintAddress) => {
    console.log("Updating Token Balance...", updateMintAddress.mint);
    try {
      const response = await fetch(`${API_URL}/api/get_wallet_contents?wallet-address=${walletAddress}&mint-address=${updateMintAddress.mint}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const responseJson = await response.json();
      const tokenAccounts = responseJson.tokenAccounts;
      if (tokenAccounts && tokenAccounts.length > 1) {
        const updatedToken = tokenAccounts[1];
        if (updatedToken && updatedToken.mint) {
          const updatedTokens = tokens.map(token =>
            token.mint === updatedToken.mint ?
              { ...token, ...updatedToken } :
              token.mint === SOL_MINT_ADDRESS ?
                { ...token, ...tokenAccounts[0] } :
                token
          );
          if (!tokens.some(token => token.mint === updatedToken.mint)) {
            updatedTokens.push(updatedToken);
          }
          setTokens(updatedTokens);
        }
      }
    } catch (error) {
      console.error('Error fetching token accounts:', error.message);
    }
  };


  const fetchTokens = async () => {
    if (!walletAddress || !hasMoreTokens) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/get_wallet_contents?wallet-address=${walletAddress}&start=${startIndex}&limit=${tokenFetchLimit}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const responseJson = await response.json();
      const tokenAccounts = responseJson.tokenAccounts;
      let newTokenAccounts = []
      tokenAccounts.map((token, index) => {
        if (token.mint) {
          if (!retrievedMintAddresses.includes(token.mint)) {
            retrievedMintAddresses.push(token.mint);
            newTokenAccounts.push(token);
          }
        }
      })
      const lastTokenAccountIndex = responseJson.lastIndexRead + 1;
      const remainingTokens = responseJson.isRemainingTokens;
      setTokens(prevTokens => [...prevTokens, ...newTokenAccounts]);
      if (!remainingTokens) {
        setHasMoreTokens(false);
        setLoading(false);
      } else {
        setStartIndex(lastTokenAccountIndex);
      }
    } catch (error) {
      console.error('Error fetching token accounts:', error.message);
      fetchTokens();
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
        await connect();
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      console.log('Already connected!');
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnect();
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
  }, [walletAddress]);

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
              if (!Object.keys(tokenImages).includes(token.mint)) {
                if (!Object.keys(images).includes(token.mint)) {
                  images[token.mint] = data.image;
                }
              }
            }
          } catch (error) {
            console.error('Error fetching image:', error.message);
          }
        }
      }));
      images[SOL_MINT_ADDRESS] = SOL_IMG_URL;
      setTokenImages(prevImages => {
        return { ...prevImages, ...images }
      });
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
    if (address) {
      const visibleChars = 4
      return `${address.substring(0, visibleChars)}...${address.substring(address.length - visibleChars, address.length)}`
    }
    else {
      return ""
    }
  }

  return (
    <div>
      <div className='banner-wrapper'>
        <div className="banner">
          {!connected ? (
            <div>

              <WalletMultiButton style={{
                backgroundColor: "#DC1FFF",
                border: "none",
                padding: "10px 15px",
                color: "white",
                cursor: "pointer",
                borderRadius: "5px",
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
              <div className='connect-button-wrapper'>
                <button className="button connect-button" onClick={disconnectWallet}>
                  Disconnect Wallet
                </button>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                width: '75%'
              }}>
                <p className='connection-status'>Connected: {abbr(walletAddress)}</p>
              </div>
            </>
          )}
          <div className='banner-end'></div>
        </div>
      </div>

      {loading && <div className="spinner"></div>}

      {
        selectedToken && (
          swapMinimum == null ?
            <div className="swap-info">
              <h4>{selectedItem == null ? "Select Item" : ""}</h4>
            </div>
            :
            <div className="swap-info">
              <SwapButton
                inputMint={selectedToken}
                inputAmount={swapMinimum}
                slippageInBps={200}
                buttonDialog={`Swap for ${Math.round(Math.pow(10, (ROUNDING_ORDER_MAG - 1)) * swapMinimum, ROUNDING_ORDER_MAG) / Math.pow(10, (ROUNDING_ORDER_MAG - 1))} ${selectedToken.metadata?.data?.name || 'Solana'}`}
                hash={hash}
                updateTokenBalance={updateTokenBalance}
              />
            </div>
        )
      }

      {
        tokens.length > 0 ? (
          <div className='token-list-wrapper'>
            <div className="token-list">
              <div className='payment-method-wrapper'>
                <h3
                  style={{
                    textAlign: 'center',
                    textShadow: "-6px -1px 11pxrgba(227, 227, 227, 0.34)",
                    fontStyle: "italic",
                    color: "white"
                  }}
                >Payment Method</h3></div>
              {tokens
                .filter(token => token.dollarQuote !== null && token.dollarQuote.outAmount !== undefined)
                .sort((a, b) => (b.dollarQuote.outAmount || 0) - (a.dollarQuote.outAmount || 0))
                .map((token, index) => (
                  <div
                    className="token-item"
                    key={index}
                    onClick={() => handleTokenClick(token)}
                    style={{
                      cursor: 'pointer',
                      border: selectedToken && selectedToken.mint === token.mint ? '2px solid green' : 'none',
                      padding: '10px',
                      margin: '5px',
                      background: selectedToken && selectedToken.mint === token.mint ? '#ab9ff2' : 'linear-gradient(360deg, rgb(71, 71, 71), #5f5f5f)',
                      borderRadius: '10px',
                    }}
                  >
                    <div ref={lastTokenElementRef} />
                    <div className='token-container'>
                      <div>
                        {tokenImages[token.mint] ? (
                          <div className='token-image-wrapper'>
                            <img
                              src={tokenImages[token.mint]}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = UNKNOWN_SPL_TOKEN_IMG;
                              }}
                              alt="Token"
                            />
                          </div>
                        ) :
                          <div className='token-image-wrapper'>
                            <img
                              src={"https://img.freepik.com/free-vector/glowing-neon-question-mark-symbol-background-web-help-support_1017-53244.jpg?t=st=1736431105~exp=1736434705~hmac=0fec172326637f1f39ba8475d9b3642b5a5776716de2be04eba4d7570c112f02&w=740"}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = UNKNOWN_SPL_TOKEN_IMG;
                              }}
                              alt="Token"
                            />
                          </div>}
                      </div>
                      <div>
                        <span>{Object.keys(token.metadata).includes('data') ? token.metadata.data.symbol : 'SOL'}</span>
                        <span>{Math.round(Math.pow(10, (ROUNDING_ORDER_MAG - 1)) * token.uiAmount, ROUNDING_ORDER_MAG) / Math.pow(10, (ROUNDING_ORDER_MAG - 1))}</span>
                      </div>
                      <div>
                        <span>${Math.round(token.dollarQuote.outAmount / 1000) / 1000}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          connected && !loading && <div>No tokens found.</div>
        )
      }
    </div >
  );
};

export default WalletConnector;

