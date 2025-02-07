import React, { useEffect, useState, useRef } from 'react';
import LoginForm from './LoginForm';
import ManualSignUp from './ManualSignUp';
import EmployeeLogin from './EmployeeComponents/EmployeeLogin';
import { getIpAddress, getLocationMetadataFromIp } from './Shared';
import HeaderWrapper from './HeaderWrapper';

const VendorApp = () => {
    document.body.classList.add('vendor');
    const [createAccount, setCreateAccount] = useState(false);
    const [userMetadata, setUserMetadata] = useState(false);
    const [isNightMode, setIsNightMode] = useState(null);
    const [sunriseSunset, setSunriseSunset] = useState({
        sunrise: null,
        sunset: null
    });

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
        console.log(sunriseSunset);
        if (sunriseSunset.sunrise && sunriseSunset.sunset) {
            const checkTimeAndUpdate = () => {
                const currentTime = new Date().toISOString();
                const sunrise = new Date(sunriseSunset.sunrise);
                const sunset = new Date(sunriseSunset.sunset);
                if (currentTime > sunrise.toISOString() && currentTime < sunset.toISOString()) {
                    setIsNightMode(true);
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
            document.body.style.transition = "filter 5s ease-in-out";
            document.body.style.filter = "invert(1)";
        } else {
            document.body.style.filter = "invert(0)";
        }
    }, [isNightMode]);

    function getSecondHash() {
        const hash = window.location.hash;
        const hashes = hash.split('#');
        if (hashes.length > 2) {
            return hashes.slice(2).join('#');
        }
        return '';
    }

    if (getSecondHash()) {
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
                {isNightMode === null || !sunriseSunset.sunrise || !sunriseSunset.sunset ? (
                    <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', background: "rgb(0 0 0 / 75%)" }}>
                        <div className="modal">
                            <div className="loading-dialog">
                                <p>Loading...</p>
                                <div className="spinner" style={{ marginLeft: '15%' }}></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='vendor-interface'>
                        <HeaderWrapper />
                        {!createAccount && (
                            <div className='vendor-login-wrapper' style={{
                                marginTop: '5vw'
                            }}>
                                <div>
                                    <div className='vendor-login-inputs'>
                                        <LoginForm setCreateAccount={setCreateAccount} />
                                    </div>
                                </div>
                            </div>
                        )}
                        {createAccount && (
                            <ManualSignUp />
                        )}
                    </div>
                )}
            </div>
        )
    }
}

export default VendorApp;