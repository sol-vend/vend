import React, { useEffect, useState, useRef } from 'react';
import ManualSignUp from './ManualSignUp';
import EmployeeLogin from './EmployeeComponents/EmployeeLogin';
import { getIpAddress, getLocationMetadataFromIp, fetchDataWithAuth } from './Shared';
import HeaderWrapper from './HeaderWrapper';
import Home from './EmployerComponents/Home';

const VendorApp = () => {
    document.body.classList.add('vendor');
    const [createAccount, setCreateAccount] = useState(false);
    const [userMetadata, setUserMetadata] = useState(false);
    const [isNightMode, setIsNightMode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updateVendorWrapper, setUpdateVendorWrapper] = useState(false);
    const [authToken, setAuthToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [autoLogin, setAutoLogin] = useState(
        {
            isLoggedIn: false,
            emailAddress: '',
            isAccountOwner: false,
        }
    )
    const [sunriseSunset, setSunriseSunset] = useState({
        sunrise: null,
        sunset: null
    });

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            setAuthToken(token);
        }
    }, [])

    useEffect(() => {
        if (authToken !== null) {
            fetchDataWithAuth(setIsAuthenticated);
        }
    }, [authToken])

    useEffect(() => {
        //THIS IS GOING TO HAVE TO BE UPDATED WHEN WE FIGURE OUT HOW TO HANDLE EMPLOYEES (NON ACCOUNT OWNERS)
        console.log(isAuthenticated);
        if (isAuthenticated.isLoggedIn) {
            setAutoLogin({
                isLoggedIn: true,
                emailAddress: isAuthenticated.user_id,
            });
        }
    }, [isAuthenticated])

    useEffect(() => {
        if (!userMetadata) {
            const localGetIp = async () => {
                const ipInfos = await getIpAddress();
                if (ipInfos) {
                    const userData = await getLocationMetadataFromIp(ipInfos);
                    setUserMetadata({
                        ipAddress: ipInfos,
                        data: userData
                    })
                }
            }
            localGetIp();
        }
    }, [createAccount])

    useEffect(() => {
        if (userMetadata.data && userMetadata.data.lat && userMetadata.data.lon) {
            const getSunriseSunset = async () => {
                try {
                    const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${userMetadata.data.lat}&lng=${userMetadata.data.lon}&formatted=0`);
                    const data = await response.json();
                    setSunriseSunset({
                        sunrise: data.results.sunrise,
                        sunset: data.results.sunset
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
                if (currentTime > sunrise.toISOString() && currentTime < sunset.toISOString()) {
                    setIsNightMode(false);
                } else {
                    setIsNightMode(true);
                }
            };

            checkTimeAndUpdate();
            const intervalId = setInterval(checkTimeAndUpdate, 5 * 60 * 1000); // 5 minutes interval
            return () => clearInterval(intervalId);
        }
    }, [sunriseSunset]);

    useEffect(() => {
        if (isNightMode) {
            const vendorTitleWrapper = document.querySelector('.vendor-title-wrapper');
            if (vendorTitleWrapper) {
                vendorTitleWrapper.style.filter = "invert(1)";
            }
        } else {
            const vendorTitleWrapper = document.querySelector('.vendor-title-wrapper');
            if (vendorTitleWrapper) {
                vendorTitleWrapper.style.filter = "invert(0)";
            }
        }
    }, [updateVendorWrapper])

    useEffect(() => {
        if (isNightMode) {
            document.body.style.transition = "filter 0.5s ease-in-out";
            document.body.style.filter = "invert(1)";
            setUpdateVendorWrapper(!updateVendorWrapper);
        } else {
            document.body.style.filter = "invert(0)";
            setUpdateVendorWrapper(!updateVendorWrapper);
        }

        if (isNightMode !== null) {
            console.log('being changed...')
            if (loading) {
                setLoading(false);
            }
        }
    }, [isNightMode]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (sunriseSunset.sunrise === null || sunriseSunset.sunrise === undefined) {
                const now = new Date();
                const hours = now.getHours();
                if (hours > 7 && hours <= 19) {
                    setIsNightMode(false);
                } else {
                    setIsNightMode(true);
                }
            }
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    function getSecondHash() {
        const hash = window.location.hash;
        const hashes = hash.split('#');
        if (hashes.length > 2) {
            return hashes.slice(2).join('#');
        }
        return '';
    }
    if (loading) {
        return (
            <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', background: "rgb(0 0 0 / 75%)" }}>
                <div className="modal">
                    <div className="loading-dialog">
                        <p>Loading...</p>
                        <div className="spinner" style={{ marginLeft: '15%' }}></div>
                    </div>
                </div>
            </div>
        )
    } else if (autoLogin.isLoggedIn) {
        console.log(autoLogin);
        return (
            <div>
                <HeaderWrapper />
                <Home loginInfos={autoLogin} />
            </div>
        )
    }
    else if (getSecondHash()) {
        console.log("Redirect to login functions")
        return (
            <div>
                <HeaderWrapper />
                <EmployeeLogin />
            </div>
        )
    } else {
        return (
            <div>
                <div className='vendor-interface'>
                    <HeaderWrapper />
                    {!createAccount && (
                        <div className='vendor-login-wrapper' style={{
                            marginTop: '5vw'
                        }}>
                            <div>
                                <div className='vendor-login-inputs'>
                                    <EmployeeLogin />
                                </div>
                            </div>
                        </div>
                    )}
                    {createAccount && (
                        <div>
                            <HeaderWrapper />
                            <ManualSignUp />
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default VendorApp;