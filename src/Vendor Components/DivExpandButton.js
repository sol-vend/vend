import React, { useState } from 'react';
import { showHideStyles } from './ManualSignUpStyles';

const DivExpandButton = ({ onClick, children }) => {
    const [isPressed, setIsPressed] = useState(false);

    const handleMouseDown = () => {
        setIsPressed(true);
    };

    const handleMouseUp = () => {
        setIsPressed(false);
    };

    const handleMouseLeave = () => {
        setIsPressed(false);  // Ensure the effect is removed if the mouse leaves the button
    };

    const buttonStyles = {
        transform: isPressed ? 'scale(0.95)' : 'scale(1)',  // Shrink when pressed
        boxShadow: isPressed ? 'none' : '0px 4px 6px rgba(0, 0, 0, 0.1)',  // Remove shadow when pressed
        borderColor: isPressed ? 'black' : 'none',
        transition: 'transform 0.1s ease, box-shadow 0.1s ease, border-color 0.1s ease',  // Smooth transition
    }

    return (
        <div
            style={{ ...showHideStyles, ...buttonStyles }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
export default DivExpandButton;