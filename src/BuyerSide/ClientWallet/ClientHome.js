import React, { useState, useEffect } from "react";
import HeaderWrapper from "../../Vendor Components/HeaderWrapper";
import SolanaWalletConnector from "./SolanaWalletConnector";
import TokenList from "./TokenList";
import OrderSummary from "./OrderSummary";

const ClientHome = () => {
  return (
    <div>
      <HeaderWrapper />
      <div>
        <OrderSummary />
      </div>
      <SolanaWalletConnector>
        <TokenList />
      </SolanaWalletConnector>
    </div>
  );
};

export default ClientHome;
