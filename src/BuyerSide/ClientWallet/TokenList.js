import React, { useState, useEffect } from "react";
import { API_URL } from "../../Components/Shared";

const PAGE_SIZE = 2;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

const TokenList = ({ wallet, isConnected, publicKey }) => {
  const API_ENDPOINT = `${API_URL}/api/wallet`;
  const [tokens, setTokens] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalTokens, setTotalTokens] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);

  useEffect(() => {
    if (!isConnected || !publicKey) return;

    let isCancelled = false;
    const controller = new AbortController();
    const { signal } = controller;

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const fetchWithRetry = async (url, retries = MAX_RETRIES) => {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const res = await fetch(url, {
            headers: { "Content-Type": "application/json" },
            signal,
          });

          if (!res.ok) {
            throw new Error(`API error: ${res.status} ${res.statusText}`);
          }

          const data = await res.json();

          // If tokens array is unexpectedly missing/empty, treat as retryable
          if (!data.tokens || data.tokens.length === 0) {
            throw new Error("Empty or invalid token data");
          }

          return data;
        } catch (err) {
          if (attempt === retries || err.name === "AbortError") {
            throw err;
          }
          console.warn(`Retry ${attempt}/${retries} failed. Retrying in ${RETRY_DELAY}ms...`);
          await sleep(RETRY_DELAY);
        }
      }
    };

    const fetchAllTokens = async () => {
      setLoading(true);
      setError(null);
      let page = 1;
      let allTokens = [];
      let total = Infinity;

      try {
        while (allTokens.length < total && !isCancelled) {
          const url = `${API_ENDPOINT}/${publicKey}?size=${PAGE_SIZE}&page=${page}`;
          const data = await fetchWithRetry(url);
          total = data.total_tokens || 0;
          allTokens = [...allTokens, ...(data.tokens || [])];
          page++;
        }

        if (!isCancelled) {
          setTokens(allTokens);
          setTotalTokens(total);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchAllTokens();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [isConnected, publicKey]);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold mb-2">Your Tokens</h3>

      {loading && <p className="text-sm text-gray-500">Loading tokens...</p>}

      <div className="token-list">
      <ul className="token-list-container">
        {tokens.length > 0 ? (
          tokens.sort((a,b) => b.usd_value - a.usd_value).map((token, idx) => (
            <li
              key={idx}
              className={`token-items ${selectedToken === idx ? "selected" : ""}`}
              onClick={() => setSelectedToken(idx)}
            >
              <img src={token.logoURI || "/placeholder.png"} alt={token.symbol} className="token-logo" />
              <div className="token-info">
                <span className="token-symbol">{token.symbol || "Unknown"}</span>
                <span className="token-value">
                  ${token.usd_value?.toFixed(2) || "0.00"}
                </span>
              </div>
            </li>
          ))
        ) : (
          <li className="token-placeholder">No tokens found.</li>
        )}
      </ul>
    </div>

      {totalTokens !== null && (
        <p className="text-xs text-gray-400 mt-2">
          Total tokens: {tokens.length} of {totalTokens}
        </p>
      )}
    </div>
  );
};

export default TokenList;
