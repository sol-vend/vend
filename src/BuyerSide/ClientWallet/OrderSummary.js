import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API_URL } from "../../Components/Shared";

function getTimestampedDate() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

const OrderSummary = ({ orderInfo, loading, error }) => {
  if (loading) return <p className="text-gray-500">Loading order...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const {
    businessName = "Unknown",
    destinationPublicKey = "",
    saleInformation = {},
    totalPrice = 0,
    finalPrice = 0,
  } = orderInfo || {};

  return (
    <div className="max-w-md mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="mb-3 text-gray-700 dark:text-gray-300">
        <div className="order-summary top-header">
          <p>Receipt</p>
          <p>{getTimestampedDate()}</p>
        </div>
        <div className="order-summary sub-header">
          <p>
            <span> To: </span>
            {businessName}
          </p>
          <p>
            <span>Via: </span>
            {`${destinationPublicKey.slice(0, 4)}...${destinationPublicKey.slice(Math.max(destinationPublicKey.length - 5, 0))}`}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">
          Your Purchase:
        </h3>
        <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300">
          {saleInformation.receipt &&
            Object.values(saleInformation.receipt).map((line, index) => (
              <li key={index}>{line}</li>
            ))}
        </ul>
      </div>

      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        <p>Merchant Price: ${parseFloat(totalPrice).toFixed(2)}</p>
        <p>Transaction Total: ${parseFloat(finalPrice).toFixed(2)}</p>
        
        <p style={{fontSize: '50%', fontStyle:'italic'}}>VEND charges a scaling tranaction fee. Some of these funds will be used to reward our vendors and users in the future. Want to learn more?</p>
      </div>
    </div>
  );
};

export default OrderSummary;