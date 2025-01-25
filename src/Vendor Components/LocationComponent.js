import React, { useState, useEffect } from "react";
import { getCityAndState } from "./Shared";

const LocationComponent = () => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [cityState, setCityState] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    setLocation({ latitude, longitude });
                },
                (error) => {
                    setError("Error fetching location: " + error.message);
                }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    }, []);

    useEffect(() => {
        const fetchCityState = async () => {
            if (location) {
                try {
                    const cityStateData = await getCityAndState(location.latitude, location.longitude);
                    setCityState(cityStateData);
                } catch (err) {
                    setError("Error fetching city and state: " + err.message);
                }
            }
        }
        fetchCityState();
    }, [location])

    return (
        <div>
            {error && <p>{error}</p>}
            {cityState ? (
                <p>
                    {`${cityState.city}, ${cityState.state}`}
                </p>
            ) : (
                <></>
            )}
        </div>
    );
};

export default LocationComponent;
