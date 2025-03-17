import React, { useState, useMemo, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { WalletProvider } from "@solana/wallet-adapter-react";
import WalletConnector from "./Components/WalletConnector";
import { ItemsProvider } from "./Contexts/ItemsContext";
import Items from "./Components/Items";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import AppHome from "./Home/AppHome";
import { fetchDataWithAuth } from "./Vendor Components/Shared";

const App = () => {
  const network = "mainnet-beta";
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  const [checkAuthAfterLatent, setCheckAuthAfterLatent] = useState(true);

  const handleVisibilityChange = () => {
    console.log("Visibility Listener Triggered in App.js");
    fetchDataWithAuth(setCheckAuthAfterLatent);
  };

  const handleFocus = () => {
    console.log("Focus Listener Triggered in App.js");
    fetchDataWithAuth(setCheckAuthAfterLatent);
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  window.addEventListener("load", () => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setTimeout(() => {
        window.scrollTo(0, 1);
      }, 100);
    }
  });

  return (
    <Router>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <AppHome />
                  </>
                }
              />
              <Route
                path="/welcome/*"
                element={
                  <>
                    {console.log("autoroute")}
                    <AppHome autoRoute={true} />
                  </>
                }
              />
              <Route
                path="/payment/*"
                element={
                  <>
                    <div>work in progress...</div>
                  </>
                }
              />
            </Routes>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </Router>
  );
};

export default App;
