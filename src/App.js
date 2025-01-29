import React, { useMemo } from 'react';
import { WalletProvider } from '@solana/wallet-adapter-react';
import WalletConnector from './Components/WalletConnector';
import { ItemsProvider } from './Contexts/ItemsContext';
import Items from './Components/Items';
import { ConnectionProvider } from '@solana/wallet-adapter-react'; // ConnectionProvider
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'; // Correct Phantom wallet adapter
import { clusterApiUrl } from '@solana/web3.js';
import { WalletModalProvider, WalletConnectButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';
import VendorApp from './Vendor Components/VendorApp'
import { CustomBodyBackground } from './Vendor Components/CustomBodyBackground';

const App = () => {
  const network = 'mainnet-beta';  // Or 'devnet', 'testnet' based on your needs
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  const hash = window.location.hash;
  if (window.location.pathname === "/vend/") {
    return (
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <ItemsProvider>
              <div className="App">
                <Items />
                <WalletConnector hash={hash} />
              </div>
            </ItemsProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    );
  } else {
    if (window.location.pathname === "/vend/vendor") {
      return (
        <div>
          <VendorApp />
          <CustomBodyBackground />
        </div>
      );
    }
  }
};

export default App;


