import React from 'react';
import { WalletProvider } from './Contexts/WalletContext';  // Import WalletProvider
import WalletConnector from './Components/WalletConnector';
import { ItemsProvider } from './Contexts/ItemsContext';
import Items from './Components/Items';

const App = () => {
  return (
    <WalletProvider>  {/* Wrap the entire app with the WalletProvider */}
      <ItemsProvider>
        <div className="App">
          <h1>SolVend</h1>
          <Items />
          <WalletConnector /> {/* Your WalletConnector component */}
        </div>
      </ItemsProvider>
    </WalletProvider>
  );
};

export default App;
