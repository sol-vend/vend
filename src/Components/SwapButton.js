import React, { useState, useEffect } from 'react';
import { Connection, VersionedTransaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import fetch from 'cross-fetch';
import { useWallet } from '@solana/wallet-adapter-react';
import { JITO_SOL_TOKEN_ACCT, JITO_SOL_ADDRESS, SETTLEMENT_PUBKEY, API_URL, RPC_API_URL } from './Shared';

const SwapButton = ({ inputMint, inputAmount, slippageInBps, buttonDialog, hash, updateTokenBalance }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [txLink, setTxLink] = useState(null);
  const [passcode, setPasscode] = useState(null);
  const connection = new Connection(RPC_API_URL);
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
            correctLastValidBlockHeight: true,
            asLegacyTransaction: false,
            allowOptimizedWrappedSolTokenAccount:true,
            dynamicComputeUnitLimit: true,
            dynamicSlippage: true,
            prioritizationFeeLamports: {
              priorityLevelWithMaxLamports: {
                maxLamports: 10000000,
                priorityLevel: "veryHigh"
              }
            }
          }),
        })
      ).json();

      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      const signedTransaction = await signTransaction(transaction);

      const rawTransaction = signedTransaction.serialize();
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2,
      });

      let attempt = 0;
      const maxAttempts = 60;
      const pollInterval = 2000;

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
            updateTokenBalance(inputMint);
            return;
          }

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

      pollForConfirmation();
    } catch (err) {
      setError('An error occurred during the transaction');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div className='connect-button-wrapper'>
          <button className="button connect-button" onClick={handleSwap} disabled={loading} style={{ maxWidth: 'fit-content' }}>
            {loading ? 'Processing... Please wait' : buttonDialog}
          </button>
        </div>
      </div>

      {loading && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="loading-dialog">
              <p>Transaction is being processed... This may take up to 60 seconds.</p>
              <div className="spinner"></div>
            </div>
          </div>
        </div>
      )}

      {passcode && !loading && (
        <div className='transaction-confirmed'>
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

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
    </div>
  );
};

export default SwapButton;

