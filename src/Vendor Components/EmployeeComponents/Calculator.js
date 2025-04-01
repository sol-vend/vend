import React, { useState, useEffect } from "react";
import "./Calculator.css";

const Calculator = ({
  setOrderTotal,
  setParentExpressions,
  startOrderTotal = 0,
  isChild = false,
}) => {
  const [display, setDisplay] = useState(startOrderTotal);
  const [expression, setExpression] = useState("");
  const [expressionList, setExpressionList] = useState([]);
  const [expressionLists, setExpressionLists] = useState([]);

  useEffect(() => {
    // Whenever expressionList changes, we update expressionLists.
    if (expressionList.length > 0) {
      setExpressionLists((prev) => [...prev, expressionList]);
      setExpressionList([]); // Reset expression list after it's added to the full history
    }
  }, [expressionList]);
  console.log(expressionLists);
  useEffect(() => {
    // Send the updated expressionLists to the parent when it changes
    setParentExpressions((prev) => ({
      ...prev,
      miscellaneous: expressionLists.map((list) => processExpression(list)),
    }));
  }, [expressionLists, setParentExpressions]);

  useEffect(() => {
    setExpressionList([]);
    setDisplay(startOrderTotal);
  }, [startOrderTotal]);

  const handleClick = (value) => {
    if (display === "0" && value !== ".") {
      setDisplay(value);
      setExpression(value);
    } else if (display == "0" || display == 0) {
      setDisplay(value);
      setExpression(value);
    } else {
      setDisplay(display + value);
      setExpression(expression + value);
    }
  };

  const handleOperation = (operator) => {
    setDisplay(operator);
    setExpression(expression + operator);
  };

  const calculateResult = () => {
    try {
      const result = eval(expression); // Eval to calculate the expression
      setDisplay(result);
      setExpression(result.toString());
      setOrderTotal(result); // Save to the parent state as the total
      // Add this calculation to the expressionList
      setExpressionList((prev) => [...prev, `${expression} = ${result}`]);
    } catch (error) {
      setDisplay("Error");
    }
  };

  const clearDisplay = () => {
    setDisplay(0);
    setExpression("");
    setExpressionList([]);
  };

  const processExpression = (expressionLine) => {
    return expressionLine.join(" "); // For readability, join the expressions
  };

  const handleClearAll = () => {
    setDisplay(startOrderTotal);
    setExpressionList([]);
    setExpressionLists([]);
    setExpression("");
    setOrderTotal(startOrderTotal);
  };

  return (
    <div className="calculator-container-wrapper">
      <div className="calculator-container">
        <div className="calculator-display">{display}</div>
        <div className="calculator-keypad">
          <button className="calculator-button clear" onClick={clearDisplay}>
            C
          </button>
          <button
            className="calculator-button number"
            onClick={() => handleClick("7")}
          >
            7
          </button>
          <button
            className="calculator-button number"
            onClick={() => handleClick("8")}
          >
            8
          </button>
          <button
            className="calculator-button number"
            onClick={() => handleClick("9")}
          >
            9
          </button>
          <button
            className="calculator-button operation"
            onClick={() => handleOperation("+")}
          >
            +
          </button>
          <button
            className="calculator-button number"
            onClick={() => handleClick("4")}
          >
            4
          </button>
          <button
            className="calculator-button number"
            onClick={() => handleClick("5")}
          >
            5
          </button>
          <button
            className="calculator-button number"
            onClick={() => handleClick("6")}
          >
            6
          </button>
          <button
            className="calculator-button operation"
            onClick={() => handleOperation("-")}
          >
            -
          </button>
          <button
            className="calculator-button number"
            onClick={() => handleClick("1")}
          >
            1
          </button>
          <button
            className="calculator-button number"
            onClick={() => handleClick("2")}
          >
            2
          </button>
          <button
            className="calculator-button number"
            onClick={() => handleClick("3")}
          >
            3
          </button>
          <button
            className="calculator-button operation"
            onClick={() => handleOperation("*")}
          >
            *
          </button>
          <button
            className="calculator-button number"
            onClick={() => handleClick("0")}
          >
            0
          </button>
          <button
            className="calculator-button number"
            onClick={() => handleClick(".")}
          >
            .
          </button>
          <button className="calculator-button equals" onClick={calculateResult}>
            =
          </button>
          <button
            className="calculator-button operation"
            onClick={() => handleOperation("/")}
          >
            /
          </button>
          <button className="calculator-button" disabled></button>
          <button className="calculator-button" disabled></button>
          <button className="calculator-button clear" onClick={handleClearAll}>
            DEL
          </button>
        </div>
      </div>
      <div
        style={{
          height: expressionLists.length > 0 ? "100%" : "0px",
        }}
        className="expression-list-wrapper"
      >
        <div className="expression-wrapper">
          <ul className="expression-wrapper-list-container">
            {expressionLists.map((expression, index) => {
              let expressionValue = processExpression(expression);
              return (
                <li key={index}>
                  {expressionValue}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
