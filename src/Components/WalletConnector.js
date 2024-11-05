import '../App.css';
import React, { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';

const WalletConnector = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [tokens, setTokens] = useState([]);

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

    const connection = new Connection('https://api.mainnet-beta.solana.com');

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      new PublicKey(walletAddress),
      { programId: TOKEN_PROGRAM_ID }
    );

    const tokenData = tokenAccounts.value.map(({ account }) => {
      const parsedInfo = account.data.parsed.info;
      return {
        mint: parsedInfo.mint,
        tokenAmount: parsedInfo.tokenAmount.uiAmount,
      };
    });

    setTokens(tokenData);
  };

  useEffect(() => {
    if (walletAddress) {
      fetchTokens();
    }
  }, [walletAddress]);

  return (
    <div>
      <div className="container">
      <button className="button" onClick={connectWallet}>
        {walletAddress ? 'Connected: ' + walletAddress : 'Connect?'}
      </button>
      </div>
      {tokens.length > 0 && (
        <div className="token-list">
          <h3>Your Tokens:</h3>
          {tokens.map((token, index) => (
            <div className="token-item" key={index}>
              <span>Token Mint: {token.mint}</span>
              <span>Amount: {token.tokenAmount}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WalletConnector;

