import React from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

const SwipeIndicator = ({
  direction,
  numArrows,
  size,
  maxIndex = false,
  minIndex = false,
}) => {
  return (
    <div className="swipe-indicator-wrapper" style={{ display: "flex", opacity: minIndex || maxIndex ? "0.25" : "1", }}>
      {Array.from({ length: numArrows }).map((_, index) => (
        <div
          key={index}
          style={{
            opacity:
              direction === "right"
                ? 1 - index / numArrows
                : (index + 1) / numArrows,
            transform:
              direction === "right"
                ? `rotateY(${index * 10}deg) translateY(${index * -1}px)`
                : `rotateY(${(numArrows - (index + 1)) * -10}deg) translateY(${
                    (numArrows - (index + 1)) * -1
                  }px)`,
          }}
        >
          {direction === "left" && (
            <FaArrowLeft size={size - (numArrows - (index + 1))} />
          )}
          {direction === "right" && <FaArrowRight size={size - index} />}
          {direction === "up" && <FaArrowUp size={size} />}
          {direction === "down" && <FaArrowDown size={size} />}
        </div>
      ))}
    </div>
  );
};

export default SwipeIndicator;
