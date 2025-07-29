import React from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import ClientHome from "./ClientHome";

const SolanaWalletConnector = () => {
  const { connection } = useConnection();
  const {
    publicKey,
    connect,
    select,
    wallet,
    wallets,
    sendTransaction,
    signTransaction,
    signAllTransactions,
    signMessage,
    connected,
    connecting,
    disconnect,
  } = useWallet();

  // Get wallet balance
  const [balance, setBalance] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(false);
  const [isInMobileWallet, setIsInMobileWallet] = React.useState(false);
  const [mobileWalletType, setMobileWalletType] = React.useState(null);

  // Detect mobile device and wallet browser
  React.useEffect(() => {
    const checkEnvironment = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileRegex =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      const isMobileDevice = mobileRegex.test(userAgent);

      // Check if we're in a mobile wallet's browser
      const isPhantomMobile =
        userAgent.includes("phantom") || window.phantom?.solana;
      const isSolflareMobile =
        userAgent.includes("solflare") || window.solflare;
      const isTrustMobile = userAgent.includes("trust") || window.trustwallet;

      setIsMobile(isMobileDevice);
      setIsInMobileWallet(isPhantomMobile || isSolflareMobile || isTrustMobile);

      if (isPhantomMobile) setMobileWalletType("phantom");
      else if (isSolflareMobile) setMobileWalletType("solflare");
      else if (isTrustMobile) setMobileWalletType("trust");
    };

    checkEnvironment();

    // Also check after a short delay in case providers load asynchronously
    const timer = setTimeout(checkEnvironment, 1000);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (publicKey && connected) {
      connection
        .getBalance(publicKey)
        .then((lamports) => {
          setBalance(lamports / LAMPORTS_PER_SOL);
        })
        .catch((error) => {
          console.error("Failed to fetch balance:", error);
        });
    }
  }, [publicKey, connection, connected]);

  // Connect to mobile wallet using injected provider
  const connectMobileWallet = async () => {
    try {
      let provider = null;

      // Get the appropriate mobile wallet provider
      if (window.phantom?.solana) {
        provider = window.phantom.solana;
        console.log("Using Phantom mobile provider");
      } else if (window.solflare) {
        provider = window.solflare;
        console.log("Using Solflare mobile provider");
      } else if (window.trustwallet?.solana) {
        provider = window.trustwallet.solana;
        console.log("Using Trust Wallet mobile provider");
      } else if (window.solana) {
        // Generic solana provider
        provider = window.solana;
        console.log("Using generic Solana provider");
      }

      if (!provider) {
        throw new Error("No mobile wallet provider found");
      }

      // Connect using the mobile provider
      const response = await provider.connect();
      console.log("Mobile wallet connected:", response.publicKey.toString());

      // If the wallet adapter isn't automatically picking this up,
      // we might need to manually trigger the connection
      if (!connected) {
        // Try to find and select the corresponding wallet adapter
        const mobileWallet = wallets.find((w) =>
          w.adapter.name.toLowerCase().includes(mobileWalletType || "phantom")
        );

        if (mobileWallet) {
          select(mobileWallet.adapter.name);
          setTimeout(() => connect(), 500);
        }
      }

      return response;
    } catch (error) {
      console.error("Mobile wallet connection failed:", error);
      throw error;
    }
  };

  // Standard desktop wallet connection
  const connectDesktopWallet = async () => {
    try {
      // If no wallet is selected, try to select the first available wallet
      if (!wallet && wallets.length > 0) {
        select(wallets[0].adapter.name);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      if (!connect) {
        throw new Error("Connect function not available");
      }

      await connect();
    } catch (error) {
      if (error.name === "WalletNotSelectedError" && wallets.length > 0) {
        try {
          select(wallets[0].adapter.name);
          setTimeout(() => connect(), 100);
        } catch (selectError) {
          console.error("Failed to select wallet:", selectError);
          throw selectError;
        }
      } else {
        throw error;
      }
    }
  };

  // Main wallet connection handler
  const handleWalletAction = async () => {
    try {
      if (connected) {
        await disconnect();
        return;
      }

      console.log("Environment:", {
        isMobile,
        isInMobileWallet,
        mobileWalletType,
        hasPhantom: !!window.phantom?.solana,
        hasSolflare: !!window.solflare,
        hasGenericSolana: !!window.solana,
        userAgent: navigator.userAgent,
      });

      if (isMobile && isInMobileWallet) {
        console.log("Attempting mobile wallet connection...");
        await connectMobileWallet();
      } else {
        console.log("Attempting desktop wallet connection...");
        await connectDesktopWallet();
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);

      // Additional error handling for mobile
      if (
        isMobile &&
        error.message.includes("No mobile wallet provider found")
      ) {
        alert(
          "Please make sure you're opening this page within your wallet app (Phantom, Solflare, etc.)"
        );
      }
    }
  };

  // Send transaction example (works for both mobile and desktop)
  const sendSol = async () => {
    if (!publicKey || !connected) {
      console.error("Wallet not connected");
      return;
    }

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey("11111111111111111111111111111112"),
          lamports: LAMPORTS_PER_SOL * 0.01,
        })
      );

      let signature;

      // For mobile wallets, we might need to use the injected provider directly
      if (isInMobileWallet && window.phantom?.solana) {
        const { blockhash } = await connection.getRecentBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = publicKey;

        const signedTransaction = await window.phantom.solana.signTransaction(
          transaction
        );
        signature = await connection.sendRawTransaction(
          signedTransaction.serialize()
        );
      } else {
        // Use standard wallet adapter method
        signature = await sendTransaction(transaction, connection);
      }

      console.log("Transaction signature:", signature);
      await connection.confirmTransaction(signature, "confirmed");
      console.log("Transaction confirmed");
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  // Sign message example
  const handleSignMessage = async () => {
    if (!publicKey || !connected) {
      console.error("Wallet not connected");
      return;
    }

    try {
      const message = `Hello from ${publicKey.toString()}!`;
      const encodedMessage = new TextEncoder().encode(message);

      let signature;

      // For mobile wallets, use injected provider if available
      if (isInMobileWallet && window.phantom?.solana?.signMessage) {
        signature = await window.phantom.solana.signMessage(encodedMessage);
      } else if (signMessage) {
        signature = await signMessage(encodedMessage);
      } else {
        throw new Error("Sign message not supported");
      }

      console.log("Message signature:", signature);
    } catch (error) {
      console.error("Message signing failed:", error);
    }
  };

  if (!connected) {
    return (
      <div className="disconnected-wallet">
        <div className="wallet-info disconnected">
          <p>Please connect your wallet to continue</p>
          {isMobile && !isInMobileWallet && (
            <p
              style={{ fontSize: "12px", color: "#666", marginBottom: "10px" }}
            >
              On mobile, please scan the QR code with your wallet app to open
              this page within the wallet browser.
            </p>
          )}
          {isInMobileWallet && (
            <p
              style={{
                fontSize: "12px",
                color: "#28a745",
                marginBottom: "10px",
              }}
            >
              ✓ Detected {mobileWalletType} mobile wallet browser
            </p>
          )}
          <button
            className="button connect-button"
            onClick={handleWalletAction}
            disabled={connecting}
          >
            {connecting ? "Connecting..." : "Connect Wallet"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ClientHome />
      <div className="wallet-info">
        <p>Connected: {`${publicKey?.toString().substring(0, 4)}...${publicKey?.toString().substring(publicKey?.toString().length - 5, publicKey?.toString().length - 1)}`}</p>
        <p>Balance: {balance.toFixed(4)} SOL</p>
        {isInMobileWallet && (
          <p style={{ fontSize: "12px", color: "#28a745" }}>
            Connected via {mobileWalletType} mobile
          </p>
        )}
        <button className="button" onClick={handleWalletAction}>
          Disconnect
        </button>
      </div>
    </div>
  );
};

export default SolanaWalletConnector;

// Enhanced custom hook for wallet operations (mobile-compatible)
export const useWalletOperations = () => {
  const {
    publicKey,
    sendTransaction,
    signTransaction,
    signAllTransactions,
    signMessage,
    connected,
  } = useWallet();
  const { connection } = useConnection();

  const getBalance = async () => {
    if (!publicKey || !connected) return 0;
    try {
      const balance = await connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error("Failed to get balance:", error);
      return 0;
    }
  };

  const sendSolTransaction = async (toPubkey, amount) => {
    if (!publicKey || !connected) {
      throw new Error("Wallet not connected");
    }

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(toPubkey),
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      // Check if we're in mobile wallet and use appropriate method
      const isMobileWallet =
        window.phantom?.solana && /mobile/i.test(navigator.userAgent);

      if (isMobileWallet) {
        const { blockhash } = await connection.getRecentBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = publicKey;

        const signedTransaction = await window.phantom.solana.signTransaction(
          transaction
        );
        return await connection.sendRawTransaction(
          signedTransaction.serialize()
        );
      } else {
        if (!sendTransaction) {
          throw new Error("sendTransaction method not available");
        }
        return await sendTransaction(transaction, connection);
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      throw error;
    }
  };

  return {
    publicKey,
    connected,
    getBalance,
    sendSolTransaction,
    signTransaction,
    signAllTransactions,
    signMessage,
    connection,
  };
};
