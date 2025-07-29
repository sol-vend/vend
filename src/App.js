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
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

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

  // Enhanced PWA install prompt logic
  useEffect(() => {
    const handleLoad = () => {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        // Already in standalone mode (installed PWA)
        setTimeout(() => {
          window.scrollTo(0, 1);
        }, 100);
      } else {
        // Check if it's a mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
          // Show install prompt after a delay
          setTimeout(() => {
            setShowInstallPrompt(true);
          }, 3000); // Wait 3 seconds after page load
          
          // Auto-dismiss after 12 seconds
          setTimeout(() => {
            setShowInstallPrompt(false);
          }, 15000);
        }
      }
    };

    // Check if page is already loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

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
          {/* Mobile Install Prompt Banner */}
          {showInstallPrompt && (
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '12px 16px',
              textAlign: 'center',
              fontSize: '14px',
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10000,
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              animation: 'slideDown 0.3s ease-out'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <span>📱 Add this app to your home screen for the best experience!</span>
                <button 
                  onClick={() => setShowInstallPrompt(false)}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    minWidth: '24px'
                  }}
                  onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                  onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                >
                  ✕
                </button>
              </div>
            </div>
          )}

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

          {/* Add CSS for animation */}
          <style jsx>{`
            @keyframes slideDown {
              from {
                transform: translateY(-100%);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }

            /* Adjust body padding when install prompt is shown */
            ${showInstallPrompt ? `
              body {
                padding-top: 50px !important;
              }
            ` : ''}
          `}</style>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
//};

export default App;
