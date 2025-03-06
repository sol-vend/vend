import React, { useState } from "react";

const BusinessNameModal = ({ onClose, businessName }) => {
  // Generate suggestions based on the original business name
  const generateSuggestions = (baseName) => {
    const randomNumber = Math.floor(Math.random() * 1000);
    const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"];
    const streets = ["Main St", "Oak Ave", "Pine Blvd", "Broadway", "Maple Dr"];

    return [
      `${baseName}-${randomNumber}`, // Add a number
      `${baseName}, ${cities[Math.floor(Math.random() * cities.length)]}`, // Add a city name
      `${baseName} on ${streets[Math.floor(Math.random() * streets.length)]}`, // Add a street name
    ];
  };

  const suggestions = generateSuggestions(businessName);

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ width: "80%" }}>
        <h2>Business Name Conflict</h2>
        <p style={{color:'red'}}>
          It looks like we already provide our services to another business with
          the name <strong>{businessName}</strong>.
        </p>
        <p>
          That's okay, we can automatically generate a unique business ID for
          you if you need. We use your business ID to allow your authorized employees 
          to sign in to their account. If you'd like to keep your business name simple and
          memorable for your employees, you may want to adjust your business
          name to include some different details. Here are some ideas:
        </p>
        <div
          style={{
            display:'flex',
            justifyContent:'space-around',
            justifyItems:'stretch',
            alignItems:'center',
            paddingBottom:"5%"
          }}
        >
          <div>
            <p style={{ fontStyle: "italic", color: "#655cdf" }}>
              Add a number:{" "}
            </p>
            <strong style={{ fontStyle: "normal", color: "black" }}>
              {suggestions[0]}
            </strong>
          </div>
          <div>
            <p style={{ fontStyle: "italic", color: "#655cdf" }}>
              Add a city name:{" "}
            </p>
            <strong style={{ fontStyle: "normal", color: "black" }}>
                {suggestions[1]}
              </strong>
          </div>
          <div>
            <p style={{ fontStyle: "italic", color: "#655cdf" }}>
              Add a street name:{" "}
            </p>
            <strong style={{ fontStyle: "normal", color: "black" }}>
                {suggestions[2]}
              </strong>
          </div>
        </div>
        <p>
          You can choose to keep your original name or go with a unique ID for
          simplicity.
        </p>
        <button className="vendor-add-button-styles" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default BusinessNameModal;
