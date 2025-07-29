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
import PasswordResetFull from "./Vendor Components/EmployeeComponents/PasswordResetFull";
import HeaderWrapper from "./Vendor Components/HeaderWrapper";
import InitializePin from "./Vendor Components/EmployeeComponents/InitializePin";
import ManageEmployees from "./Vendor Components/EmployeeComponents/ManageEmployees";
import ClientHome from "./BuyerSide/ClientWallet/ClientHome";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import SolanaWalletConnector from "./BuyerSide/ClientWallet/SolanaWalletConnector";
import { RPC_API_URL } from "./Components/Shared";

const App = () => {
  const network = "mainnet-beta";
  const endpoint = useMemo(() => RPC_API_URL, []);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  const [checkAuthAfterLatent, setCheckAuthAfterLatent] = useState(true);
  const [doPromptLogin, setDoPromptLogin] = useState(false);
  const [isError, setIsError] = useState(null);

  const handleVisibilityChange = () => {
    console.log("Visibility Listener Triggered in App.js");
    setDoPromptLogin(fetchDataWithAuth(setCheckAuthAfterLatent), setIsError);
  };

  const handleFocus = () => {
    console.log("Focus Listener Triggered in App.js");
    setDoPromptLogin(fetchDataWithAuth(setCheckAuthAfterLatent), setIsError);
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

  useEffect(() => {
    console.log(doPromptLogin, "login screen");
  }, [doPromptLogin]);

  useEffect(() => {
    if (!isError) {
      console.log(isError);
    }
  }, [isError]);

  console.log(doPromptLogin);
  //  if (doPromptLogin) {
  //    return { doPromptLogin };
  //  } else {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>
          <Router>
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
                    <AppHome autoRoute={true} />
                  </>
                }
              />
              <Route
                path="/complete_signup/*"
                element={
                  <>
                    <HeaderWrapper />
                    <InitializePin
                      hash={window.location.hash.split("#").slice(-1)[0]}
                      isEmployerReset={false}
                    />
                  </>
                }
              />
              <Route
                path="/password_reset/*"
                element={
                  <>
                    <HeaderWrapper />
                    <PasswordResetFull
                      hash={window.location.hash.split("#").slice(-1)[0]}
                      isEmployerReset={true}
                    />
                  </>
                }
              />
              <Route
                path="/employee_password_reset/*"
                element={
                  <>
                    <HeaderWrapper />
                    <PasswordResetFull
                      hash={window.location.hash.split("#").slice(-1)[0]}
                      isEmployerReset={false}
                    />
                  </>
                }
              />
              <Route
                path="/payment/*"
                element={
                  <>
                    <div className="wallet-buttons" style={{ height: "0px" }}>
                      <WalletMultiButton />
                      <WalletDisconnectButton />
                    </div>
                    <SolanaWalletConnector />
                  </>
                }
              />
              <Route
                path="/employee"
                element={
                  <>
                    <ManageEmployees />
                  </>
                }
              />
            </Routes>
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
//};

export default App;
