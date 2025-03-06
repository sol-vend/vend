import React, { useState, useEffect } from "react";
import { tryGetGeolocationFromStreetAddress } from "./Shared";

// List of state codes
const stateCodes = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

const AddressInput = ({ formData, setFormData, setExactLocation }) => {
  const [street, setStreet] = useState(formData.street || "");
  const [city, setCity] = useState(formData.city || "");
  const [state, setState] = useState(formData.state || "");
  const [tryReverseGeo, setTryReverseGeo] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);

  // Function to handle input changes
  const handleInputChange = (e, field) => {
    const value = e.target.value;

    console.log("street:", street);
    console.log("city:", city);
    console.log("state:", state);

    if (field === "street") {
      setStreet(value);
    } else if (field === "city") {
      setCity(value);
    } else if (field === "state") {
      setState(value);
    }
  };

  useEffect(() => {
    if (street && city && state) {
      console.log("setting the forms address...");
      setFormData({
        ...formData,
        businessLocation: {
          street: street,
          city: city,
          state: state,
        },
      });
      setTryReverseGeo(true);
    }
  }, [city, state, street]);

  useEffect(() => {
    if (tryReverseGeo) {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      console.log("Setting New timer after clearing old one.");
      const newTimer = setTimeout(() => {
        tryGetGeolocationFromStreetAddress(
          {
            street: street,
            city: city,
            state: state,
          },
          setExactLocation
        );
      }, 5000);
      setDebounceTimer(newTimer);
    }
  }, [tryReverseGeo]);

  return (
    <div className="vendor-input-group-styles">
      <label>Street Address:</label>
      <input
        type="text"
        name="street"
        value={street}
        onInput={(e) => handleInputChange(e, "street")}
        className="vendor-input-field-styles"
        placeholder="Street Address"
      />

      <label>City:</label>
      <input
        type="text"
        name="city"
        value={city}
        onInput={(e) => handleInputChange(e, "city")}
        className="vendor-input-field-styles"
        placeholder="City"
      />

      <label>State:</label>
      <select
        name="state"
        value={state}
        onChange={(e) => handleInputChange(e, "state")}
        className="vendor-input-field-styles"
      >
        <option value="">Select a state</option>
        {stateCodes.map((stateCode) => (
          <option key={stateCode} value={stateCode}>
            {stateCode}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AddressInput;
