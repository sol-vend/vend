import React, { useState, useEffect } from "react";
import HeaderWrapper from "../../Vendor Components/HeaderWrapper";
import SolanaWalletConnector from "./SolanaWalletConnector";
import TokenList from "./TokenList";
import OrderSummary from "./OrderSummary";
import { API_URL } from "../../Components/Shared";
import "./ClientHome.css";

function fixBase64Padding(str) {
  const padLength = (4 - (str.length % 4)) % 4;
  return str + "=".repeat(padLength);
}

function calculatePremium(amount) {
  if (amount <= 0) return 0;

  const minFee = 0.01;
  const maxFee = 0.1;

  const scaled = Math.min(Math.max(amount, 0.01), 100);
  const fee =
    maxFee - (Math.log10(scaled) / Math.log10(100)) * (maxFee - minFee);

  return fee;
}

const ClientHome = () => {
  const [orderInfo, setOrderInfo] = useState(null);
  const [vendorTokenMint, setVendorTokenMint] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      const windowHash = window.location.hash;
      const hash = fixBase64Padding(windowHash.slice(11)); // `#order=` is 7 chars + 4 for safety?
      if (!hash) {
        setError("Missing order information.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_URL}/api/decode_url`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ hash }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        if (data?.totalPrice) {
          data.finalPrice =
            data.totalPrice * (1 + calculatePremium(data.totalPrice));
        }
        setOrderInfo(data);
      } catch (err) {
        setError(err.message || "Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, []);

  useEffect(() => {
    setOrderInfo((prev) => ({ ...prev }));
  }, [loading]);

  useEffect(() => {
    console.log(orderInfo);
  }, [orderInfo])

  if (loading) {
    return <div>Loading order...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!orderInfo) {
    return null; // fallback — shouldn't happen
  }

  return (
    orderInfo.businessName && (
      <div>
        <HeaderWrapper />
        <div className="client-main-payment-wrapper">
          <OrderSummary orderInfo={orderInfo} setOrderInfo={setOrderInfo} />
          <TokenList
            orderInfo={orderInfo}
            destinationTokenMint={orderInfo?.paymentMint}
          />
        </div>
      </div>
    )
  );
};

export default ClientHome;
