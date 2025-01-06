import React, { useState, useEffect } from 'react';
import { Connection, VersionedTransaction, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import fetch from 'cross-fetch';
import { useWallet } from '@solana/wallet-adapter-react';
import { SOL_MINT_ADDRESS, JITO_SOL_TOKEN_ACCT, JITO_SOL_ADDRESS, SETTLEMENT_PUBKEY, API_URL } from './Shared';
import { useItems } from '../Contexts/ItemsContext';

const SwapButton = ({ inputMint, inputAmount, slippageInBps, buttonDialog, hash }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [txLink, setTxLink] = useState(null);
  const [passcode, setPasscode] = useState(null);

  const connection = new Connection('https://light-attentive-lake.solana-mainnet.quiknode.pro/a9c005983fbb55c01832be27cda7d931f5558721');
  const { publicKey, signTransaction } = useWallet();
  const tokenFactor = inputMint.amount / inputMint.uiAmount;

  const getStartingAccountBalance = async () => {
    try {
      const response = await fetch(`${API_URL}/api/get_balance`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

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
      const startBalance = await getStartingAccountBalance();
      console.log(startBalance);
      const quoteResponse = await (
        await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${inputMint.mint}&outputMint=${JITO_SOL_ADDRESS}&amount=${Math.round(inputAmount * tokenFactor)}&slippageBps=${slippageInBps}`)
      ).json();
      console.log(quoteResponse);

      const { swapTransaction } = await (
        await fetch('https://quote-api.jup.ag/v6/swap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quoteResponse,
            userPublicKey: publicKey.toString(),
            wrapAndUnwrapSol: true,
            useSharedAccounts: true,
            destinationTokenAccount: JITO_SOL_TOKEN_ACCT,
            dynamicComputeUnitLimit: true,
            dynamicSlippage: {
              maxBps: 300
            },
            prioritizationFeeLamports: {
              priorityLevelWithMaxLamports: {
                maxLamports: 100000,
                priorityLevel: "veryHigh"
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

      // Serialize the transaction and send it
      const rawTransaction = signedTransaction.serialize();
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2,
      });
      console.log(txid);

      // Poll for transaction confirmation
      let attempt = 0;
      const maxAttempts = 60;  // Set maximum number of retries
      const pollInterval = 2000; // 1 second

      const pollForConfirmation = async () => {
        try {
          const response = await fetch(`${API_URL}/api/confirm_transactions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              'transaction_hash': txid,
              'source_public_key': publicKey.toString(),
              'destination_public_key': SETTLEMENT_PUBKEY,
              'min_sol_price': (quoteResponse.otherAmountThreshold / LAMPORTS_PER_SOL).toString(),
              'encrypted_number': hash.substring(1),
              'start_balance': startBalance['start_balance']
            }),
          });

          const responseData = await response.json();
          if (response.ok) {
            setPasscode(responseData);
            setLoading(false);
            return;
          }

          // Retry logic
          if (attempt < maxAttempts) {
            attempt++;
            setTimeout(pollForConfirmation, pollInterval);
          } else {
            setError('Transaction confirmation failed after 15 attempts');
            setLoading(false);
          }
        } catch (error) {
          console.error('Error confirming transaction:', error.message);
          setError('Error confirming transaction');
          setLoading(false);
        }
      };

      // Start the polling loop
      pollForConfirmation();
    } catch (err) {
      setError('An error occurred during the transaction');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex',
        justifyContent:'center'
       }}>
        <div className='connect-button-wrapper'>
          <button className="button connect-button" onClick={handleSwap} disabled={loading} style={{ maxWidth: 'fit-content' }}>
            {loading ? 'Processing... Please wait' : buttonDialog}
          </button>
        </div>
      </div>
      {loading && (
        <div className="loading-dialog">
          <p>Transaction is being processed... This may take up to 60 seconds.</p>
          {/* You can also add a spinner here */}
          <div className="spinner"></div>
        </div>
      )}

      {passcode && !loading && (
        <div>
          <h3>Transaction Confirmed!</h3>
          <p>Your passcode is:</p>
          <strong>{passcode['passcode']}</strong>
        </div>
      )}

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

