import React, { useMemo } from 'react';
import { WalletProvider } from '@solana/wallet-adapter-react';
import WalletConnector from './Components/WalletConnector';
import { ItemsProvider } from './Contexts/ItemsContext';
import Items from './Components/Items';
import { ConnectionProvider } from '@solana/wallet-adapter-react'; // ConnectionProvider
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'; // Correct Phantom wallet adapter
import { clusterApiUrl } from '@solana/web3.js';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Add React Router imports
import VendorApp from './Vendor Components/VendorApp';
import { CustomBodyBackground } from './Vendor Components/CustomBodyBackground';

const App = () => {
  const network = 'mainnet-beta';  // Or 'devnet', 'testnet' based on your needs
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <Router>  {/* Wrap the whole app in Router */}
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <Routes>  {/* Declare the routing structure here */}
              {/* Route for Vend path */}
              <Route path="/vend" element={
                <ItemsProvider>
                  <div className="App">
                    <Items />
                    <WalletConnector hash={window.location.hash} />
                  </div>
                </ItemsProvider>
              } />

              {/* Route for Vendor page */}
              <Route path="/vend/vendor" element={
                <div>
                  <VendorApp />
                  <CustomBodyBackground />
                </div>
              } />
            </Routes>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </Router>
  );
};

export default App;


