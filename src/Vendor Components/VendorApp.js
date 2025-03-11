import React, { useEffect, useState, useCallback } from "react";
import ManualSignUp from "./ManualSignUp";
import EmployeeLogin from "./EmployeeComponents/EmployeeLogin";
import {
  getIpAddress,
  getLocationMetadataFromIp,
  fetchDataWithAuth,
} from "./Shared";
import HeaderWrapper from "./HeaderWrapper";
import Home from "./EmployerComponents/Home";
import ProcessNewAccount from "./EmployerComponents/ProcessNewAccount";
import FirstTimeUserModal from "./EmployerComponents/FirstTimeUserModal";

const VendorApp = ({ setSelectedRoute }) => {
  const [createAccount, setCreateAccount] = useState(false);
  const [userMetadata, setUserMetadata] = useState(false);
  const [isNightMode, setIsNightMode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateVendorWrapper, setUpdateVendorWrapper] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [autoLogin, setAutoLogin] = useState({
    isLoggedIn: false,
    emailAddress: "",
    isAccountOwner: false,
  });
  const [sunriseSunset, setSunriseSunset] = useState({
    sunrise: null,
    sunset: null,
  });

  const handleAuthTokenUpdate = useCallback(() => {
    const storageKeys = Object.keys(localStorage);
    if (!storageKeys.includes("firstUse")) {
      localStorage.setItem("firstUse", true);
      setIsFirstTimeUser(true);
    } else {
      localStorage.setItem("firstUse", false);
      setIsFirstTimeUser(false);
    }
  }, []);

  /* 
  useEffect(() => {
    if (authToken) {
      localStorage.setItem("authToken", authToken);
    }
  }, [authToken]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setAuthToken(token);
    }
  }, []);
*/

  useEffect(() => {
    fetchDataWithAuth(setIsAuthenticated);
  }, [isFirstTimeUser]);

  useEffect(() => {
    fetchDataWithAuth(setIsAuthenticated);
  }, []);

  useEffect(() => {
    //THIS IS GOING TO HAVE TO BE UPDATED WHEN WE FIGURE OUT HOW TO HANDLE EMPLOYEES (NON ACCOUNT OWNERS)

    if (isAuthenticated.isLoggedIn) {
      setAutoLogin({
        isLoggedIn: true,
        emailAddress: isAuthenticated.user_id,
      });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!userMetadata) {
      const localGetIp = async () => {
        const ipInfos = await getIpAddress();
        if (ipInfos) {
          const userData = await getLocationMetadataFromIp(ipInfos);
          setUserMetadata({
            ipAddress: ipInfos,
            data: userData,
          });
        }
      };
      localGetIp();
    }
  }, [createAccount]);

  useEffect(() => {
    if (userMetadata.data && userMetadata.data.lat && userMetadata.data.lon) {
      const getSunriseSunset = async () => {
        try {
          const response = await fetch(
            `https://api.sunrise-sunset.org/json?lat=${userMetadata.data.lat}&lng=${userMetadata.data.lon}&formatted=0`
          );
          const data = await response.json();
          setSunriseSunset({
            sunrise: data.results.sunrise,
            sunset: data.results.sunset,
          });
        } catch (error) {
          console.error("Error fetching sunrise and sunset data:", error);
        }
      };
      if (sunriseSunset.sunrise === null) {
        getSunriseSunset();
      }
    }
  }, [userMetadata]);

  useEffect(() => {
    if (sunriseSunset.sunrise && sunriseSunset.sunset) {
      const checkTimeAndUpdate = () => {
        const currentTime = new Date().toISOString();
        const sunrise = new Date(sunriseSunset.sunrise);
        const sunset = new Date(sunriseSunset.sunset);
        if (
          currentTime > sunrise.toISOString() &&
          currentTime < sunset.toISOString()
        ) {
          setIsNightMode(false);
        } else {
          setIsNightMode(false);
        }
      };
      checkTimeAndUpdate();
      const intervalId = setInterval(checkTimeAndUpdate, 5 * 60 * 1000); // 5 minutes interval
      return () => clearInterval(intervalId);
    }
  }, [sunriseSunset]);

  useEffect(() => {
    if (isNightMode) {
      const vendorTitleWrapper = document.querySelector(
        ".vendor-title-wrapper"
      );
      if (vendorTitleWrapper) {
        //vendorTitleWrapper.style.filter = "invert(1)";
      }
    } else {
      const vendorTitleWrapper = document.querySelector(
        ".vendor-title-wrapper"
      );
      if (vendorTitleWrapper) {
        //vendorTitleWrapper.style.filter = "invert(0)";
      }
    }
  }, [updateVendorWrapper]);

  useEffect(() => {
    if (isNightMode) {
      //document.body.style.transition = "filter 0.5s ease-in-out";
      //document.body.style.filter = "invert(1)";

      setUpdateVendorWrapper(!updateVendorWrapper);
    } else {
      //document.body.style.filter = "invert(0)";
      setUpdateVendorWrapper(!updateVendorWrapper);
    }

    if (isNightMode !== null) {
      if (loading) {
        setLoading(false);
      }
    }
  }, [isNightMode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        sunriseSunset.sunrise === null ||
        sunriseSunset.sunrise === undefined
      ) {
        const now = new Date();
        const hours = now.getHours();
        if (hours > 7 && hours <= 19) {
          setIsNightMode(false);
        } else {
          setIsNightMode(false);
        }
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const containsVerificationHash = () => {
    const hash = window.location.hash;
    const cleanHash = hash.startsWith("#") ? hash.slice(1) : hash;
    const regex = /^[a-fA-F0-9]{64}$/;

    if (regex.test(cleanHash)) {
      return cleanHash;
    }

    return "";
  };

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
  } else if (autoLogin.isLoggedIn) {
    return (
      <div>
        <HeaderWrapper />
        {containsVerificationHash() && isFirstTimeUser && (
          <FirstTimeUserModal />
        )}
        <Home loginInfos={autoLogin} setSelectedRoute={setSelectedRoute} />
      </div>
    );
  } else if (containsVerificationHash()) {
    return (
      <div>
        <ProcessNewAccount
          hash={containsVerificationHash()}
          parentStateCallback={handleAuthTokenUpdate}
        />
        <HeaderWrapper />
        <EmployeeLogin setSelectedRoute={setSelectedRoute} />
      </div>
    );
  } else {
    return (
      <div>
        <HeaderWrapper />
        <div className="vendor-interface">
          {!createAccount && (
            <div className="vendor-login-wrapper">
              <div className="vendor-login-inputs">
                <EmployeeLogin setSelectedRoute={setSelectedRoute} />
              </div>
            </div>
          )}
          {createAccount && (
            <div>
              <ManualSignUp setSelectedRoute={setSelectedRoute} />
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default VendorApp;
