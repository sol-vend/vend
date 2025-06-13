import { connected } from "process";
import React, { useState, useEffect } from "react";
import "./SolanaWalletConnector.css";

const SolanaWalletConnector = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkWallet = () => {
      if (window.solana && window.solana.isPhantom) {
        setWallet(window.solana);
      } else {
        setError(
          "Phantom wallet not found. Please install Phantom wallet extension."
        );
      }
    };

    // Check immediately
    checkWallet();

    // Also check after a short delay in case wallet loads later
    const timer = setTimeout(checkWallet, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Connect to wallet
  const connectWallet = async () => {
    if (!wallet) {
      setError("No wallet found");
      return;
    }

    setIsConnecting(true);
    setError("");

    try {
      const response = await wallet.connect();
      setIsConnected(true);
    } catch (err) {
      setError("Failed to connect wallet: " + err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    if (wallet && isConnected) {
      try {
        await wallet.disconnect();
        setIsConnected(false);
      } catch (err) {
        setError("Failed to disconnect: " + err.message);
      }
    }
  };

  // Sign and send transaction
  const signAndSendTransaction = async (transaction) => {
    if (!wallet || !isConnected) {
      throw new Error("Wallet not connected");
    }

    try {
      // Sign the transaction
      const signedTransaction = await wallet.signTransaction(transaction);

      // You can also use signAndSendTransaction for one-step process
      // const signature = await wallet.signAndSendTransaction(transaction);

      return signedTransaction;
    } catch (err) {
      throw new Error("Transaction failed: " + err.message);
    }
  };

  // Sign multiple transactions
  const signAllTransactions = async (transactions) => {
    if (!wallet || !isConnected) {
      throw new Error("Wallet not connected");
    }

    try {
      const signedTransactions = await wallet.signAllTransactions(transactions);
      return signedTransactions;
    } catch (err) {
      throw new Error("Signing multiple transactions failed: " + err.message);
    }
  };

  // Sign message (for authentication/verification)
  const signMessage = async (message) => {
    if (!wallet || !isConnected) {
      throw new Error("Wallet not connected");
    }

    try {
      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await wallet.signMessage(encodedMessage, "utf8");
      return signedMessage;
    } catch (err) {
      throw new Error("Message signing failed: " + err.message);
    }
  };

  // Get wallet address for display
  const getWalletAddress = () => {
    if (wallet && isConnected && wallet.publicKey) {
      const address = wallet.publicKey.toString();
      return `${address.slice(0, 4)}...${address.slice(-4)}`;
    }
    return "";
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Solana Wallet</h2>
      </div>

      {/* Wallet Status */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <span
            className={`text-sm font-semibold ${
              isConnected ? "text-green-600" : "text-gray-500"
            }`}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
        {isConnected && (
          <div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm font-medium text-gray-700">
                Address:
              </span>
              <span className="text-sm font-mono text-blue-600">
                {getWalletAddress()}
              </span>
            </div>
            <div>
              {console.log("rendering token list div")}
              {React.Children.map(children, (child) =>
                React.cloneElement(child, {
                  wallet,
                  isConnected,
                  publicKey: wallet?.publicKey?.toString(),
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Connect/Disconnect Button */}
      <div className="mb-4">
        {!isConnected ? (
          <button
            onClick={connectWallet}
            disabled={isConnecting || !wallet}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
              isConnecting || !wallet
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
            }`}
          >
            {isConnecting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Connecting...
              </div>
            ) : (
              "Connect Wallet"
            )}
          </button>
        ) : (
          <button
            onClick={disconnectWallet}
            className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 transition-colors"
          >
            Disconnect Wallet
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Instructions */}
      {!connected && (
        <div className="text-xs text-gray-500 text-center">
          <p>Make sure you have Phantom wallet installed and unlocked.</p>
        </div>
      )}
    </div>
  );
};

// Export wallet methods for external use
export const useWalletMethods = (walletInstance, isConnected) => {
  const signAndSendTransaction = async (transaction) => {
    if (!walletInstance || !isConnected) {
      throw new Error("Wallet not connected");
    }
    return await walletInstance.signTransaction(transaction);
  };

  const signAllTransactions = async (transactions) => {
    if (!walletInstance || !isConnected) {
      throw new Error("Wallet not connected");
    }
    return await walletInstance.signAllTransactions(transactions);
  };

  const signMessage = async (message) => {
    if (!walletInstance || !isConnected) {
      throw new Error("Wallet not connected");
    }
    const encodedMessage = new TextEncoder().encode(message);
    return await walletInstance.signMessage(encodedMessage, "utf8");
  };

  return {
    signAndSendTransaction,
    signAllTransactions,
    signMessage,
    wallet: walletInstance,
    publicKey: walletInstance?.publicKey,
    isConnected,
  };
};

export default SolanaWalletConnector;
