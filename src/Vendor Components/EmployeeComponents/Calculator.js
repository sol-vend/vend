import React, { useState, useEffect } from "react";
import "./Calculator.css";

const ListExpressions = () => {};

const Calculator = ({ setOrderTotal }) => {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [expressionList, setExpressionList] = useState([]);
  const [expressionLists, setExpressionLists] = useState([]);
  const [currentExpressionIndex, setCurrentExpressionIndex] = useState(0);

  console.log(expressionLists);

  useEffect(() => {
    console.log(currentExpressionIndex);
    setExpressionLists((prev) => {
      let current = prev;
      console.log(expressionList);
      current.push(expressionList.slice(-2));
      return current;
    });
    setExpressionList([]);
  }, [currentExpressionIndex]);

  useEffect(() => {
    console.log(expression);
    setExpressionList((prev) => [...prev, expression]);
  }, [expression]);

  const handleClick = (value) => {
    if (display === "0" && value !== ".") {
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
      const result = eval(expression);
      setDisplay(result.toString());
      setExpression(result.toString());
      setOrderTotal(result);
      setExpressionList((prev) => [...prev, result.toString()]);
      setCurrentExpressionIndex((index) => index + 1);
    } catch (error) {
      setDisplay("Error");
    }
  };

  const clearDisplay = () => {
    setDisplay("0");
    setExpression("");
    setExpressionList([]);
  };

  const processExpression = (expressionLine) => {
    if (expressionLine.length > 1) {
      return expressionLine.join(" = ");
    } else {
      return null;
    }
  };

  const hasNonEmptyString = (array) => {
    try {
      for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
          if (typeof array[i][j] === "string" && array[i][j].length > 0) {
            return true; // Return true if a non-empty string is found
          }
        }
      }
      return false; // Return false if no non-empty string is found
    } catch {
      return false;
    }
  };

  const handleClearAll = () => {
    setDisplay("0");
    setExpressionList([]);
    setExpressionLists([]);
    setExpression("");
    setOrderTotal(0);
    setCurrentExpressionIndex(0);
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
          <button
            className="calculator-button equals"
            onClick={calculateResult}
          >
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
          height: hasNonEmptyString(expressionLists) ? "100%" : "0px",
        }}
        className="expression-list-wrapper"
      >
        <div className="expression-wrapper">
          <ul className="expression-wrapper-list-container">
            {expressionLists?.map((expression, index) => {
              let expressionValue = processExpression(expression);
              if (expressionValue) return <li>{expressionValue}</li>;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
