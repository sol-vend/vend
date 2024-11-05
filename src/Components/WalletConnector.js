import '../App.css';
import React, { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

const WalletConnector = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);  // Set loading to true while fetching tokens

    const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
    
    try {
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        new PublicKey(walletAddress),
        { programId: TOKEN_PROGRAM_ID }
      );
      
      console.log('Fetched token accounts:', tokenAccounts);  // Debug log

      // Map token data
      const tokenData = tokenAccounts.value.map(({ account }) => {
        const parsedInfo = account.data.parsed.info;
        return {
          mint: parsedInfo.mint,
          tokenAmount: parsedInfo.tokenAmount.uiAmount,
        };
      });

      if (tokenData.length === 0) {
        console.log('No tokens found in wallet!');
      }

      setTokens(tokenData);  // Update state with token data
    } catch (error) {
      console.error('Error fetching token accounts:', error);
      alert('Failed to fetch tokens. Please try again later.');
    } finally {
      setLoading(false);  // Set loading to false after fetching
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchTokens();  // Fetch tokens when wallet address changes
    }
  }, [walletAddress]);

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
          <h3>Your Tokens:</h3>
          {tokens.map((token, index) => (
            <div className="token-item" key={index}>
              <span>Token Mint: {token.mint}</span>
              <span>Amount: {token.tokenAmount}</span>
            </div>
          ))}
        </div>
      ) : (
        walletAddress && !loading && <div>No tokens found.</div>
      )}
    </div>
  );
};

export default WalletConnector;
