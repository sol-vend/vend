import React, { useState, useEffect } from "react";

const SideMenu = ({menuItems, optionsRef, handleMenuSelection}) => {
  return (
    <div className="menu-active-wrapper" ref={optionsRef}>
      <div className="menu-active-container">
        {Object.keys(menuItems).map((key, index) => (
          <div
            className="menu-item"
            key={key}
            onClick={() => handleMenuSelection(key, index)}
          >
            <p>{key}</p>
            <span>{menuItems[key].icon}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;
