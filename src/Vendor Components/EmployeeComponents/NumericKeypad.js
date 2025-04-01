import React, { useState, useEffect, useRef } from "react";
import { FaCheckCircle } from "react-icons/fa";

const NumericKeypad = ({
  onValueChange,
  onClose,
  initialValue = "",
  maxLength = 10,
}) => {
  const [displayValue, setDisplayValue] = useState(initialValue);

  const handleKeyPress = (key) => {
    if (
      displayValue.length >= maxLength &&
      key !== "backspace" &&
      key !== "clear"
    ) {
      return;
    }

    let newValue = displayValue;

    if (key === "backspace") {
      newValue = displayValue.slice(0, -1);
    } else if (key === "clear") {
      newValue = "";
    } else if (key === "." && !displayValue.includes(".")) {
      newValue = displayValue + key;
    } else if (key !== ".") {
      newValue = displayValue + key;
    } else if (key === "." && displayValue === "") {
      newValue = "0.";
    }

    setDisplayValue(newValue);
    if (onValueChange) {
      onValueChange(Number(newValue));
    }
  };

  const handleUpdateAndClose = () => {
    onClose((prev) => !prev);
  };

  return (
    <div className="numeric-keypad">
      {/* Display */}
      <div className="keypad-display">{displayValue || "0"}</div>

      {/* Keypad */}
      <div className="keypad-grid">
        {/* Row 1 */}
        <button
          className="keypad-button digit-button"
          onClick={() => handleKeyPress("7")}
        >
          7
        </button>
        <button
          className="keypad-button digit-button"
          onClick={() => handleKeyPress("8")}
        >
          8
        </button>
        <button
          className="keypad-button digit-button"
          onClick={() => handleKeyPress("9")}
        >
          9
        </button>

        {/* Row 2 */}
        <button
          className="keypad-button digit-button"
          onClick={() => handleKeyPress("4")}
        >
          4
        </button>
        <button
          className="keypad-button digit-button"
          onClick={() => handleKeyPress("5")}
        >
          5
        </button>
        <button
          className="keypad-button digit-button"
          onClick={() => handleKeyPress("6")}
        >
          6
        </button>

        {/* Row 3 */}
        <button
          className="keypad-button digit-button"
          onClick={() => handleKeyPress("1")}
        >
          1
        </button>
        <button
          className="keypad-button digit-button"
          onClick={() => handleKeyPress("2")}
        >
          2
        </button>
        <button
          className="keypad-button digit-button"
          onClick={() => handleKeyPress("3")}
        >
          3
        </button>

        {/* Row 4 */}
        <button
          className="keypad-button digit-button"
          onClick={() => handleKeyPress("0")}
        >
          0
        </button>
        <button
          className="keypad-button decimal-button"
          onClick={() => handleKeyPress(".")}
        >
          .
        </button>
        <button
          className="keypad-button backspace-button"
          onClick={() => handleKeyPress("backspace")}
        >
          ⌫
        </button>

        {/* Clear button */}
        <button
          className="keypad-button clear-button"
          onClick={() => handleKeyPress("clear")}
        >
          Clear
        </button>
        <button
          onClick={handleUpdateAndClose}
          className="keypad-button submit-button"
        >
          <FaCheckCircle />
        </button>
      </div>
    </div>
  );
};
 export default NumericKeypad;