import React from "react";
import ImageDeck from "./ImageDeck";

const CustomRadioButton = ({
  label,
  value,
  checked,
  onChange,
  color = "#007bff", // Default color if not provided
  size = "20px", // Default size for the radio button
  imagePaths = null,
}) => {
  return (
    <div
      style={{
        border: checked && "solid black 1px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      className="vendor-input-radio-button-wrapper"
    >
      <label
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          marginLeft: "10px",
          gap: "15px",
          width: "50%",
        }}
      >
        <input
          type="radio"
          value={value}
          checked={checked}
          onChange={onChange}
          style={{ display: "none" }} // Hide the default radio button
        />
        <span className="radio-button-outline-wrapper">
          <span className="radio-button-inline-wrapper">
            {checked && (
              <span className="custom-radio-button-inner-span-checked" />
            )}
          </span>
        </span>
        {label}
      </label>
      {imagePaths && <ImageDeck imagePaths={imagePaths} />}
    </div>
  );
};

export default CustomRadioButton;
