import React, { useState, useEffect } from 'react';
import { Connection, VersionedTransaction } from '@solana/web3.js';
import fetch from 'cross-fetch';
import { useWallet } from '@solana/wallet-adapter-react'; // Using the wallet adapter hook
import { SOL_MINT_ADDRESS } from './Shared';

const SwapButton = ({ inputMint, inputAmount, slippageInBps, buttonDialog }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [txLink, setTxLink] = useState(null);

  const connection = new Connection('https://light-attentive-lake.solana-mainnet.quiknode.pro/a9c005983fbb55c01832be27cda7d931f5558721');
  const { publicKey, signTransaction } = useWallet();  // Using useWallet hook to get publicKey and signTransaction
  const tokenFactor = inputMint.amount / inputMint.uiAmount;

  useEffect(() => {
    if (!publicKey) {
      console.log('Please connect your wallet!');
    }
  }, [publicKey]);

  const handleSwap = async () => {
    if (!publicKey) {
      setError('Wallet not connected!');
      return;
    }

    setLoading(true);
    setError(null);
    setTxLink(null);

    try {
      // Fetch the quote from Jupiter API
      const quoteResponse = await (
        await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${inputMint.mint}&outputMint=${SOL_MINT_ADDRESS}&amount=${Math.round(inputAmount * tokenFactor)}&slippageBps=${slippageInBps}`)
      ).json();

      const { swapTransaction } = await (
        await fetch('https://quote-api.jup.ag/v6/swap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quoteResponse,
            userPublicKey: publicKey.toString(),
            wrapAndUnwrapSol: true,
            dynamicComputeUnitLimit: true, // Set this to true to get the best optimized CU usage.
            dynamicSlippage: { // This will set an optimized slippage to ensure high success rate
              maxBps: 300 // Make sure to set a reasonable cap here to prevent MEV
            },
              prioritizationFeeLamports: {
              priorityLevelWithMaxLamports: {
                maxLamports: 1000000,
                priorityLevel: "veryHigh" // If you want to land transaction fast, set this to use `veryHigh`. You will pay on average higher priority fee.
              }
            }
          }),
        })
      ).json();

      // Deserialize the swap transaction
      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      // Sign the transaction using the wallet
      const signedTransaction = await signTransaction(transaction);

      // Get the latest blockhash
     const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

      //Serialize the transaction and send it
      const rawTransaction = signedTransaction.serialize();
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2,
      });
      console.log(txid)
      // Confirm the transaction
    
      await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature: txid,
      });

      // Generate the transaction link for Solscan
      
      setTxLink(`https://solscan.io/tx/${txid}`);
      console.log(`Transaction successful: ${txLink}`);

    } catch (err) {
      setError('An error occurred during the transaction');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button className="button connect-button" onClick={handleSwap} disabled={loading} style={{ maxWidth: 'fit-content' }}>
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
