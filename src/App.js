import React, { useMemo, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from '@solana/wallet-adapter-react';
import WalletConnector from './Components/WalletConnector';
import { ItemsProvider } from './Contexts/ItemsContext';
import Items from './Components/Items';
import { ConnectionProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import VendorApp from './Vendor Components/VendorApp';
import { CustomBodyBackground } from './Vendor Components/CustomBodyBackground';
import AppHome from './Home/AppHome';

const App = () => {
  const network = 'mainnet-beta';
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  window.addEventListener('load', () => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
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
              <Route path="/" element={
                <>
                  <AppHome/>
                </>
              } />
              <Route path="/*" element={
                <>
                {console.log('autoroute')}
                  <AppHome autoRoute={true} />
                </>
              } />
              <Route path="/vend/*" element={
                <ItemsProvider>
                  <div className="App">
                    <Items />
                    <WalletConnector hash={window.location.hash} />
                  </div>
                </ItemsProvider>
              } />
              <Route path="/vendor/*" element={
                <>
                  <VendorApp />
                </>
              } />
            </Routes>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </Router>
  );
};

export default App;


