import React, { useMemo } from 'react';
import { WalletProvider } from '@solana/wallet-adapter-react'; 
import WalletConnector from './Components/WalletConnector';
import { ItemsProvider } from './Contexts/ItemsContext';
import Items from './Components/Items';
import { ConnectionProvider } from '@solana/wallet-adapter-react'; // ConnectionProvider
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'; // Correct Phantom wallet adapter
import { clusterApiUrl } from '@solana/web3.js';
import { WalletModalProvider, WalletConnectButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';

const App = () => {
  const network = 'mainnet-beta';  // Or 'devnet', 'testnet' based on your needs
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  const hash = window.location.hash;

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <ItemsProvider>
            <div className="App">
              <WalletConnector hash={hash}/>
              <Items />
            </div>
          </ItemsProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;


