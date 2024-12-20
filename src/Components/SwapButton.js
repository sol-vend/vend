import React, { useState, useEffect } from 'react';
import { Connection, Transaction, VersionedTransaction } from '@solana/web3.js';
import fetch from 'cross-fetch';
import { useWallet } from '@solana/wallet-adapter-react'; // Using the wallet adapter hook
import { SOL_MINT_ADDRESS } from './Shared';

const SwapButton = ({ wallet, inputMint, inputAmount, slippageInBps, buttonDialog }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [txLink, setTxLink] = useState(null);

  const getTokenFactor = (token) => {
    const tokenFactor = token.amount / token.uiAmount;
    return tokenFactor;
  }

  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const { userWallet, signTransaction } = useWallet();
  const tokenFactor = getTokenFactor(inputMint);
  console.log(userWallet, signTransaction)
  useEffect(() => {
    if (!userWallet) {
      console.log('Please connect your wallet!');
    }
  }, [userWallet]);

  const handleSwap = async () => {
    if (!userWallet) {
      setError('Wallet not connected!');
      return;
    }

    setLoading(true);
    setError(null);
    setTxLink(null);

    try {
      const quoteResponse = await (
        await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${inputMint.mint}&outputMint=${SOL_MINT_ADDRESS}&amount=${Math.round(inputAmount * tokenFactor)}&slippageBps=${slippageInBps}`)
      ).json();

      const { swapTransaction } = await (
        await fetch('https://quote-api.jup.ag/v6/swap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quoteResponse,
            userPublicKey: wallet.publicKey.toString(),
            wrapAndUnwrapSol: true,
          }),
        })
      ).json();

      // Deserialize the swap transaction
      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      // Sign the transaction using wallet.signTransaction
      const signedTransaction = await userWallet.signTransaction(transaction);

      // Get the latest blockhash
      //const latestBlockHash = await connection.getRecentBlockhash();
      //console.log('Recent Blockhash:', latestBlockHash);

      // Serialize and send the transaction
      const rawTransaction = signedTransaction.serialize();
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2,
      });

      // Confirm the transaction
      /*
      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txid,
      });
      console.log(`https://solscan.io/tx/${txid}`);
      */
    } catch (err) {
      setError('An error occurred during the transaction');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button className={"button connect-button"} onClick={handleSwap} disabled={loading} style={{ maxWidth: "fit-content" }}>
        {loading ? 'Processing...' : buttonDialog}
      </button>

      {txLink && (
        <div>
          <p>Transaction successful! View it on Solscan:</p>
          <a href={txLink} target="_blank" rel="noopener noreferrer">
            {txLink}
          </a>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SwapButton;
