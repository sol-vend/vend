import React, { useState } from 'react';

const Tooltip = ({ message, children, styles }) => {
    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    return (
        <div
            className="tooltip-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            {isHovered && <div className="tooltip" style={styles}>{message}</div>}
        </div>
    );
};

export default Tooltip;
