import React, { useState } from 'react';
import './Calculator.css'

const Calculator = ({setOrderTotal}) => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');

  const handleClick = (value) => {
    if (display === '0' && value !== '.') {
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
      setOrderTotal((prev) => prev + result);
    } catch (error) {
      setDisplay('Error');
    }
  };

  const clearDisplay = () => {
    setDisplay('0');
    setExpression('');
    setOrderTotal(0);
  };

  return (
    <div className="calculator-container">
      <div className="calculator-display">{display}</div>
      <div className="calculator-keypad">
        <button className="calculator-button clear" onClick={clearDisplay}>C</button>
        <button className="calculator-button number" onClick={() => handleClick('7')}>7</button>
        <button className="calculator-button number" onClick={() => handleClick('8')}>8</button>
        <button className="calculator-button number" onClick={() => handleClick('9')}>9</button>
        <button className="calculator-button operation" onClick={() => handleOperation('+')}>+</button>
        <button className="calculator-button number" onClick={() => handleClick('4')}>4</button>
        <button className="calculator-button number" onClick={() => handleClick('5')}>5</button>
        <button className="calculator-button number" onClick={() => handleClick('6')}>6</button>
        <button className="calculator-button operation" onClick={() => handleOperation('-')}>-</button>
        <button className="calculator-button number" onClick={() => handleClick('1')}>1</button>
        <button className="calculator-button number" onClick={() => handleClick('2')}>2</button>
        <button className="calculator-button number" onClick={() => handleClick('3')}>3</button>
        <button className="calculator-button operation" onClick={() => handleOperation('*')}>*</button>
        <button className="calculator-button number" onClick={() => handleClick('0')}>0</button>
        <button className="calculator-button number" onClick={() => handleClick('.')}>.</button>
        <button className="calculator-button equals" onClick={calculateResult}>=</button>
        <button className="calculator-button operation" onClick={() => handleOperation('/')}>/</button>
      </div>
    </div>
  );
};

export default Calculator;
