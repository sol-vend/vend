import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API_URL } from "../../Components/Shared";

const OrderSummary = () => {
  const [orderInfo, setOrderInfo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const hash =
    window.location.hash.split("#")[window.location.hash.split("#").length - 1];
  console.log(hash);
  useEffect(() => {
    const fetchOrderData = async () => {
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
        setOrderInfo(data);
      } catch (err) {
        setError(err.message || "Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [hash]);

  if (loading) return <p className="text-gray-500">Loading order...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const { businessName, destinationPublicKey, saleInformation, totalPrice } =
    orderInfo || {};

  return (
    <div className="max-w-md mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="mb-3 text-gray-700 dark:text-gray-300">
        <p>Receipt:</p>
        <p>Business: {businessName}</p>
        <p>
          Wallet:{" "}
          {`${destinationPublicKey.slice(0, 4)}...${destinationPublicKey.slice(
            destinationPublicKey.length - 5,
            destinationPublicKey.length - 1
          )}`}
        </p>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">
          Items:
        </h3>
        <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300">
          {saleInformation?.receipt &&
            Object.values(saleInformation.receipt).map((line, index) => (
              <li key={index}>{line}</li>
            ))}
        </ul>
      </div>

      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Total: ${parseFloat(totalPrice).toFixed(2)}
      </div>
    </div>
  );
};

export default OrderSummary;
