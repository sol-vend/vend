/* eslint-env es2020 */
import React, { useState, useEffect } from "react";
import {
  Connection,
  LAMPORTS_PER_SOL,
  VersionedTransaction,
  TransactionMessage,
  Transaction,
  PublicKey,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  getAccount,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { API_URL } from "../../Components/Shared";
import "./ClientHome.css";
import "./walletbackground.svg";
import { useWallet } from "@solana/wallet-adapter-react";
import "./SolanaWalletConnector.css";
import { RPC_API_URL } from "../../Components/Shared";

const PAGE_SIZE = 2;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

// Jupiter API constants
const JUPITER_API_URL = "https://quote-api.jup.ag/v6";
const PYUSD_MINT = "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo"; // PayPal USD mint
const FEE_RECEIVER = "uT7ycytYVjvjhHp7yL726Zc8dasHQnpx2bCXvEyqiwe";

const TokenList = ({
  orderInfo,
  destinationTokenMint,
  useAtomicTransaction = false,
}) => {
  const {
    wallet,
    publicKey,
    connected: isConnected,
    sendTransaction,
  } = useWallet();
  const API_ENDPOINT = `${API_URL}/api/wallet`;
  const [tokens, setTokens] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalTokens, setTotalTokens] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [solBalance, setSolBalance] = useState(0);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [status, setStatus] = useState("");
  const [transactionSignature, setTransactionSignature] = useState("");
  const [tokenProgramId, setTokenProgramId] = useState(null);

  const outputTokenMint = orderInfo.paymentMint.address || PYUSD_MINT;

  // Initialize connection (adjust RPC endpoint as needed)
  const connection = new Connection(
    RPC_API_URL || "https://api.mainnet-beta.solana.com"
  );

  useEffect(() => {
    parseTokenProgramId();
  }, []);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const parseTokenProgramId = async () => {
    async function getTokenProgramIdFromMint(connection, mintAddress) {
      const mintPubkey = new PublicKey(mintAddress);
      const mintAccountInfo = await connection.getAccountInfo(mintPubkey);
      if (!mintAccountInfo) {
        throw new Error("Mint account not found");
      }

      const owner = mintAccountInfo.owner.toString();

      if (owner === TOKEN_PROGRAM_ID.toString()) {
        return TOKEN_PROGRAM_ID;
      }

      if (owner === TOKEN_2022_PROGRAM_ID.toString()) {
        return TOKEN_2022_PROGRAM_ID;
      }

      throw new Error("Unknown token program ID for mint");
    }
    let test = await getTokenProgramIdFromMint(connection, outputTokenMint);
    setTokenProgramId(test);
  };

  // Get Jupiter quote
  const getJupiterQuote = async (
    inputMint,
    outputMint,
    amount,
    slippageBps = 100 // Increased slippage tolerance
  ) => {
    try {
      const params = new URLSearchParams({
        inputMint,
        outputMint,
        amount: amount.toString(),
        slippageBps: slippageBps.toString(),
        onlyDirectRoutes: "false", // Allow more routing options
        asLegacyTransaction: "false", // Use versioned transactions
        maxAccounts: "64", // Limit accounts to prevent bloat
        minimizeSlippage: "true", // Optimize for better execution
        swapMode: "ExactIn", // Specify exact input mode
      });

      const response = await fetch(`${JUPITER_API_URL}/quote?${params}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Jupiter quote response error:", errorText);
        throw new Error(
          `Jupiter quote failed: ${response.statusText} - ${errorText}`
        );
      }

      const quote = await response.json();

      // Validate quote response
      if (!quote || !quote.outAmount) {
        throw new Error("Invalid quote response from Jupiter");
      }

      return quote;
    } catch (error) {
      console.error("Jupiter quote error:", error);
      throw error;
    }
  };

  // Get Jupiter swap transaction with destination token account specified
  const getJupiterSwapTransaction = async (
    quote,
    userPublicKey,
    destinationTokenAccount = null
  ) => {
    try {
      const requestBody = {
        quoteResponse: quote,
        userPublicKey: userPublicKey.toString(),
        wrapAndUnwrapSol: true,
        useSharedAccounts: true,
        computeUnitPriceMicroLamports: 1000000,
        dynamicComputeUnitLimit: true,
        skipUserAccountsRpcCalls: false,
      };

      // Add destination token account if provided (for atomic transactions)
      if (destinationTokenAccount) {
        requestBody.destinationTokenAccount =
          destinationTokenAccount.toString();
      }

      const response = await fetch(`${JUPITER_API_URL}/swap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Jupiter swap response error:", errorText);
        throw new Error(
          `Jupiter swap failed: ${response.statusText} - ${errorText}`
        );
      }

      const swapTransaction = await response.json();

      return swapTransaction.swapTransaction;
    } catch (error) {
      console.error("Jupiter swap transaction error:", error);
      throw error;
    }
  };

  const accountExists = async (accountAddress) => {
    try {
      const address =
        accountAddress instanceof PublicKey
          ? accountAddress
          : new PublicKey(accountAddress);
  
      // Try TOKEN_PROGRAM_ID first (more common)
      try {
        await getAccount(connection, address, "confirmed", TOKEN_PROGRAM_ID);
        console.log("account exists in TOKEN_PROGRAM_ID");
        return true;
      } catch (error) {
        // If not found in TOKEN_PROGRAM_ID, try TOKEN_2022_PROGRAM_ID
        try {
          await getAccount(connection, address, "confirmed", TOKEN_2022_PROGRAM_ID);
          console.log("account exists in TOKEN_2022_PROGRAM_ID");
          return true;
        } catch (error2) {
          console.log("account doesn't exist in either token program");
          return false;
        }
      }
    } catch (error) {
      console.log("error checking account existence:", error);
      return false;
    }
  };

  // APPROACH 1: Sequential Transactions (More Reliable)
  const executePaymentSequential = async () => {
    if (!wallet || !publicKey || selectedToken === null) {
      throw new Error("Wallet not connected or no token selected");
    }

    try {
      setStatus("Getting token information...");

      const selectedTokenData =
        selectedToken === "SOL"
          ? {
              symbol: "SOL",
              mint: "So11111111111111111111111111111111111111112",
              decimals: 9,
            }
          : tokens[selectedToken];

      const requiredUSDAmount = orderInfo.finalPrice;
      console.log(
        "Required USD Amount:",
        requiredUSDAmount,
        "Selected Token:",
        selectedTokenData
      );

      let inputAmount;
      if (selectedToken === "SOL") {
        const solPrice = await getSOLPrice();
        const requiredSOL = requiredUSDAmount / solPrice;
        inputAmount = Math.floor(requiredSOL * LAMPORTS_PER_SOL);
      } else {
        const requiredTokens = requiredUSDAmount / selectedTokenData.price;
        inputAmount = Math.floor(
          requiredTokens * Math.pow(10, selectedTokenData.decimals)
        );
      }

      setStatus("Getting swap quote...");
      const swapQuote = await getJupiterQuote(
        selectedTokenData.mint,
        outputTokenMint,
        inputAmount
      );

      setStatus("Preparing swap transaction...");
      const swapTxData = await getJupiterSwapTransaction(swapQuote, publicKey);

      setStatus("Executing swap...");
      const swapTx = VersionedTransaction.deserialize(
        Buffer.from(swapTxData, "base64")
      );
      const swapSignature = await sendTransaction(swapTx, connection, {
        skipPreflight: false,
        preflightCommitment: "processed",
        maxRetries: 3,
      });

      const confirmation = await connection.confirmTransaction(
        {
          signature: swapSignature,
          blockhash: swapTx.message.recentBlockhash,
          lastValidBlockHeight: (await connection.getBlockHeight()) + 150,
        },
        "confirmed"
      );

      if (confirmation.value.err) {
        throw new Error(
          `Swap failed: ${JSON.stringify(confirmation.value.err)}`
        );
      }

      setStatus("Calculating transfer amounts...");
      const totalOutputAmount = swapQuote.outAmount;
      const vendorProportion = orderInfo.totalPrice / orderInfo.finalPrice;
      const feeProportion =
        (orderInfo.finalPrice - orderInfo.totalPrice) / orderInfo.finalPrice;

      const vendorAmount = Math.floor(totalOutputAmount * vendorProportion);
      const feeAmount = Math.floor(totalOutputAmount * feeProportion);
      const actualFeeAmount = Math.min(
        feeAmount,
        totalOutputAmount - vendorAmount
      );

      console.log("Split calculation:");
      console.log("- Total Price (vendor):", orderInfo.totalPrice);
      console.log("- Final Price (total):", orderInfo.finalPrice);
      console.log("- Vendor Amount:", vendorAmount);
      console.log("- Fee Amount:", actualFeeAmount);

      if (actualFeeAmount <= 0) {
        throw new Error(
          "Invalid fee calculation - fee amount must be positive"
        );
      }

      setStatus("Executing transfers...");
      const transferSignature = await executeTransfers(
        vendorAmount,
        actualFeeAmount
      );

      return { swapSignature, transferSignature };
    } catch (error) {
      console.error("Sequential payment execution failed:", error);
      throw error;
    }
  };

  // APPROACH 2: Atomic Transaction (Experimental)
  const executePaymentAtomic = async () => {
    if (!wallet || !publicKey || selectedToken === null) {
      throw new Error("Wallet not connected or no token selected");
    }

    try {
      setStatus("Getting token information...");

      const selectedTokenData =
        selectedToken === "SOL"
          ? {
              symbol: "SOL",
              mint: "So11111111111111111111111111111111111111112",
              decimals: 9,
            }
          : tokens[selectedToken];

      const requiredUSDAmount = orderInfo.finalPrice;
      let inputAmount;

      if (selectedToken === "SOL") {
        const solPrice = await getSOLPrice();
        const requiredSOL = requiredUSDAmount / solPrice;
        inputAmount = Math.floor(requiredSOL * LAMPORTS_PER_SOL);
      } else {
        const requiredTokens = requiredUSDAmount / selectedTokenData.price;
        inputAmount = Math.floor(
          requiredTokens * Math.pow(10, selectedTokenData.decimals)
        );
      }

      setStatus("Preparing atomic transaction...");

      // Pre-calculate token accounts
      const userTokenAccount = await getAssociatedTokenAddress(
        new PublicKey(outputTokenMint),
        publicKey
      );

      const vendorTokenAccount = await getAssociatedTokenAddress(
        new PublicKey(outputTokenMint),
        new PublicKey(orderInfo.destinationPublicKey)
      );

      const feeReceiverTokenAccount = await getAssociatedTokenAddress(
        new PublicKey(outputTokenMint),
        new PublicKey(FEE_RECEIVER)
      );

      // Get Jupiter quote and transaction with user's token account as destination
      const swapQuote = await getJupiterQuote(
        selectedTokenData.mint,
        outputTokenMint,
        inputAmount
      );
      const swapTxData = await getJupiterSwapTransaction(
        swapQuote,
        publicKey,
        userTokenAccount
      );

      // Calculate amounts
      const totalOutputAmount = swapQuote.outAmount;
      const vendorProportion = orderInfo.totalPrice / orderInfo.finalPrice;
      const vendorAmount = Math.floor(totalOutputAmount * vendorProportion);
      const feeAmount = totalOutputAmount - vendorAmount;

      // Prepare additional instructions
      const additionalInstructions = [];

      // Create accounts if needed
      if (!(await accountExists(vendorTokenAccount))) {
        additionalInstructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            vendorTokenAccount,
            new PublicKey(orderInfo.destinationPublicKey),
            new PublicKey(outputTokenMint),
            tokenProgramId,
            ASSOCIATED_TOKEN_PROGRAM_ID
          )
        );
      }

      if (!(await accountExists(feeReceiverTokenAccount))) {
        additionalInstructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            feeReceiverTokenAccount,
            new PublicKey(FEE_RECEIVER),
            new PublicKey(outputTokenMint),
            tokenProgramId,
            ASSOCIATED_TOKEN_PROGRAM_ID
          )
        );
      }

      // Add transfer instructions
      additionalInstructions.push(
        createTransferInstruction(
          userTokenAccount,
          vendorTokenAccount,
          publicKey,
          BigInt(vendorAmount)
        )
      );

      additionalInstructions.push(
        createTransferInstruction(
          userTokenAccount,
          feeReceiverTokenAccount,
          publicKey,
          BigInt(feeAmount)
        )
      );

      // Combine Jupiter transaction with additional instructions
      const swapTx = VersionedTransaction.deserialize(
        Buffer.from(swapTxData, "base64")
      );
      const latestBlockhash = await connection.getLatestBlockhash();

      const messageV0 = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: [
          ...swapTx.message.compiledInstructions.map((ix) => ({
            programId: swapTx.message.staticAccountKeys[ix.programIdIndex],
            keys: ix.accounts.map((accountIndex) => ({
              pubkey: swapTx.message.staticAccountKeys[accountIndex],
              isSigner: swapTx.message.isAccountSigner(accountIndex),
              isWritable: swapTx.message.isAccountWritable(accountIndex),
            })),
            data: ix.data,
          })),
          ...additionalInstructions,
        ],
      }).compileToV0Message();

      const combinedTx = new VersionedTransaction(messageV0);

      setStatus("Executing atomic transaction...");
      const signature = await sendTransaction(combinedTx, connection, {
        skipPreflight: false,
        preflightCommitment: "processed",
        maxRetries: 3,
      });

      await connection.confirmTransaction(
        {
          signature,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        },
        "confirmed"
      );

      return { atomicSignature: signature };
    } catch (error) {
      console.error("Atomic payment execution failed:", error);
      throw error;
    }
  };

  // Main payment execution function
  const executePayment = async () => {
    if (useAtomicTransaction) {
      return await executePaymentAtomic();
    } else {
      console.log("sequentially...");
      return await executePaymentSequential();
    }
  };

  // Separate function to handle transfers after swap (for sequential approach)
  const executeTransfers = async (vendorAmount, feeAmount) => {
    try {
      console.log(
        "Starting transfers - Vendor:",
        vendorAmount,
        "Fee:",
        feeAmount
      );

      if (vendorAmount <= 0 || feeAmount <= 0) {
        throw new Error(
          `Invalid transfer amounts: vendor=${vendorAmount}, fee=${feeAmount}`
        );
      }

      const transaction = new Transaction();

      const userTokenAccount = await getAssociatedTokenAddress(
        new PublicKey(outputTokenMint),
        publicKey
      );

      const vendorTokenAccount = await getAssociatedTokenAddress(
        new PublicKey(outputTokenMint),
        new PublicKey(orderInfo.destinationPublicKey)
      );

      const feeReceiverTokenAccount = await getAssociatedTokenAddress(
        new PublicKey(outputTokenMint),
        new PublicKey(FEE_RECEIVER)
      );

      console.log("Token accounts:");
      console.log("- User:", userTokenAccount.toString());
      console.log("- Vendor:", vendorTokenAccount.toString());
      console.log("- Fee Receiver:", feeReceiverTokenAccount.toString());

      if (!(await accountExists(vendorTokenAccount))) {
        console.log("Creating vendor token account");
        transaction.add(
          createAssociatedTokenAccountInstruction(
            publicKey,
            vendorTokenAccount,
            new PublicKey(orderInfo.destinationPublicKey),
            new PublicKey(outputTokenMint)
          )
        );
      }
      /*
      if (!(await accountExists(feeReceiverTokenAccount))) {
        console.log('Creating fee receiver token account');
        transaction.add(
          createAssociatedTokenAccountInstruction(
            publicKey,
            feeReceiverTokenAccount,
            new PublicKey(FEE_RECEIVER),
            new PublicKey(outputTokenMint)
          )
        );
      }
*/
      console.log(feeReceiverTokenAccount);
      console.log(`Adding vendor transfer: ${vendorAmount} tokens`);
      transaction.add(
        createTransferInstruction(
          userTokenAccount,
          vendorTokenAccount,
          publicKey,
          vendorAmount
        )
      );

      console.log(`Adding fee transfer: ${feeAmount} tokens`);
      transaction.add(
        createTransferInstruction(
          userTokenAccount,
          feeReceiverTokenAccount,
          publicKey,
          feeAmount
        )
      );

      const signature = await sendTransaction(transaction, connection, {
        skipPreflight: false,
        preflightCommitment: "processed",
        maxRetries: 3,
      });

      await connection.confirmTransaction(signature, "confirmed");

      console.log("Transfers completed successfully:", signature);
      return signature;
    } catch (error) {
      console.error("Transfer execution failed:", error);
      throw error;
    }
  };

  // Helper function to get SOL price
  const getSOLPrice = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
      );
      const data = await response.json();
      return data.solana.usd;
    } catch (error) {
      console.error("Error fetching SOL price:", error);
      return 0;
    }
  };

  // Record payment in your backend
  const recordPayment = async (paymentData) => {
    try {
      await fetch(`${API_URL}/api/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });
    } catch (error) {
      console.error("Error recording payment:", error);
    }
  };

  // Show success notification
  const showSuccessNotification = (message) => {
    alert(message);
  };

  // Show error notification
  const showErrorNotification = (message) => {
    alert(message);
  };

  // Updated handlePayment function
  const handlePayment = async () => {
    if (!wallet || !publicKey || selectedToken === null) {
      console.error("Wallet not connected or no token selected");
      return;
    }

    setProcessingPayment(true);
    setError(null);
    setStatus("");

    try {
      setStatus("Preparing transaction...");

      const signatures = await executePayment();

      setStatus("Transaction successful!");
      setTransactionSignature(
        signatures.swapSignature || signatures.atomicSignature
      );

      showSuccessNotification(
        `Payment completed successfully! Transaction: ${
          signatures.swapSignature || signatures.atomicSignature
        }`
      );

      const selectedTokenData =
        selectedToken === "SOL" ? { symbol: "SOL" } : tokens[selectedToken];

      await recordPayment({
        signatures,
        fromToken: selectedTokenData.symbol,
        toToken: outputTokenMint,
        totalAmount: orderInfo.finalPrice,
        vendorAmount: orderInfo.totalPrice,
        feeAmount: orderInfo.finalPrice - orderInfo.totalPrice,
        orderId: orderInfo.id,
      });
    } catch (error) {
      console.error("Payment error:", error);
      setStatus("Transaction failed");
      setError(error.message);
      showErrorNotification("Payment failed. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  // useEffect and other functions remain the same...
  useEffect(() => {
    if (!isConnected || !publicKey) return;

    let isCancelled = false;
    const controller = new AbortController();
    const { signal } = controller;

    const fetchWithRetry = async (url, retries = MAX_RETRIES) => {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const res = await fetch(url, {
            headers: { "Content-Type": "application/json" },
            signal,
          });

          if (!res.ok) {
            throw new Error(`API error: ${res.status} ${res.statusText}`);
          }

          const data = await res.json();

          if (!data.tokens || data.tokens.length === 0) {
            throw new Error("Empty or invalid token data");
          }

          return data;
        } catch (err) {
          if (attempt === retries || err.name === "AbortError") {
            throw err;
          }
          console.warn(
            `Retry ${attempt}/${retries} failed. Retrying in ${RETRY_DELAY}ms...`
          );
          await sleep(RETRY_DELAY);
        }
      }
    };

    const fetchAllTokens = async () => {
      setLoading(true);
      setError(null);
      let page = 1;
      let allTokens = [];
      let total = Infinity;

      try {
        while (allTokens.length < total && !isCancelled) {
          const url = `${API_ENDPOINT}/${publicKey}?size=${PAGE_SIZE}&page=${page}`;
          const data = await fetchWithRetry(url);
          setSolBalance(data.sol_balance);
          total = data.total_tokens || 0;
          allTokens = [...allTokens, ...(data.tokens || [])];
          page++;
        }

        if (!isCancelled) {
          setTokens(allTokens);
          setTotalTokens(total);
        }
      } catch (err) {
        if (!isCancelled) {
          setError("There was an error");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchAllTokens();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [isConnected, publicKey]);

  return (
    <div className="mt-4">
      {loading && <p className="text-sm text-gray-500">Loading tokens...</p>}
      {error && <p className="text-sm text-red-500">Error: {error}</p>}
      {status && <p className="text-sm text-blue-500">Status: {status}</p>}

      <div className="token-list">
        <ul className="token-list-container">
          {solBalance > 0 && (
            <li
              className={`token-items ${
                selectedToken === "SOL" ? "selected" : ""
              }`}
              onClick={() => setSelectedToken("SOL")}
            >
              <img
                src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
                alt="SOL"
                className="token-logo"
              />
              <div className="token-info">
                <span className="token-symbol">SOL</span>
                <span className="token-value">
                  ${(solBalance * 100).toFixed(2)}
                </span>
              </div>
            </li>
          )}

          {tokens.length > 0
            ? tokens
                .sort((a, b) => b.usd_value - a.usd_value)
                .map((token, idx) => (
                  <li
                    key={idx}
                    className={`token-items ${
                      selectedToken === idx ? "selected" : ""
                    }`}
                    onClick={() => setSelectedToken(idx)}
                  >
                    <img
                      src={token.logoURI || "/placeholder.png"}
                      alt={token.symbol}
                      className="token-logo"
                    />
                    <div className="token-info">
                      <span className="token-symbol">
                        {token.symbol || "Unknown"}
                      </span>
                      <span className="token-value">
                        ${token.usd_value?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  </li>
                ))
            : !loading && (
                <li className="token-placeholder">No tokens found.</li>
              )}
        </ul>
      </div>

      {selectedToken !== null && (
        <div className="client-home-buy-wrapper">
          <button
            className="client-home-buy-button"
            onClick={handlePayment}
            disabled={
              processingPayment ||
              (selectedToken === "SOL"
                ? solBalance * 100 <= orderInfo.finalPrice
                : tokens[selectedToken]?.usd_value <= orderInfo.finalPrice)
            }
          >
            {processingPayment
              ? "Processing Payment..."
              : selectedToken === "SOL"
              ? solBalance * 100 > orderInfo.finalPrice
                ? "Buy with SOL"
                : "Insufficient SOL"
              : tokens[selectedToken]?.usd_value > orderInfo.finalPrice
              ? `Buy with ${tokens[selectedToken]?.name}`
              : `Insufficient ${tokens[selectedToken]?.name}`}
          </button>
        </div>
      )}

      {totalTokens !== null && (
        <p className="text-xs text-gray-400 mt-2">
          Total tokens: {tokens.length + (solBalance > 0 ? 1 : 0)} of{" "}
          {totalTokens + (solBalance > 0 ? 1 : 0)}
        </p>
      )}

      {transactionSignature && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <p className="text-green-800 font-medium">Payment Successful!</p>
          <p className="text-sm text-green-600 break-all">
            Transaction: {transactionSignature}
          </p>
          <div className="text-xs text-gray-600 mt-2">
            <div>Vendor Amount: ${orderInfo.totalPrice}</div>
            <div>
              Fee Amount: $
              {(orderInfo.finalPrice - orderInfo.totalPrice).toFixed(2)}
            </div>
          </div>
        </div>
      )}
      <p className="text-green-600">
        Wallet connected:{" "}
        {`${publicKey.toString().slice(0, 4)}...${publicKey
          .toString()
          .slice(Math.max(publicKey.toString().length - 5, 0))}`}
      </p>
    </div>
  );
};

export default TokenList;
