import React, { useEffect } from 'react';
import { WalletProvider } from './Contexts/WalletContext';  // Import WalletProvider
import WalletConnector from './Components/WalletConnector';
import { ItemsProvider } from './Contexts/ItemsContext';
import Items from './Components/Items';

const App = () => {

  return (
    <WalletProvider>
      <ItemsProvider>
        <div className="App">
          <WalletConnector />
          <Items />
        </div>
      </ItemsProvider>
    </WalletProvider>
  );
};

export default App;
