import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../Components/Shared";
import { handleResponseRefreshToken } from "../../Vendor Components/Shared";

const ProcessNewAccount = ({ children, hash, parentStateCallback }) => {
    console.log(parentStateCallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tokenInfos, setTokenInfos] = useState(false);

  useEffect(() => {
    if (loading && !error) {
      const confirmAccount = async () => {
        try {
          const apiUrl = `${API_URL}/api/verify_account`;
          const postData = {
            accountVerificationHash: hash,
          };

          const response = await axios.post(apiUrl, postData, {
            headers: {
              "Content-Type": "application/json", // Set Content-Type to JSON if you're sending JSON data
            },
          });
          console.log("Response:", response.data);
          setTokenInfos(response.data);
        } catch (error) {
          setError(error);
        }
      };
      confirmAccount();
    }
  }, []);

  useEffect(() => {
    console.log(tokenInfos);
    if (tokenInfos.authToken) {
      parentStateCallback(tokenInfos.authToken);
    }
  }, [tokenInfos]);

  if (loading) {
    return (
      <div
        className="modal-overlay"
        style={{
          display: "flex",
          alignItems: "center",
          background: "rgb(0 0 0 / 75%)",
        }}
      >
        <div className="modal">
          <div className="loading-dialog">
            <p>Loading...</p>
            <div className="spinner" style={{ marginLeft: "15%" }}></div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <>
        {error && <div>{error.error}</div>} {!error && <>{children}</>}
      </>
    );
  }
};

export default ProcessNewAccount;
