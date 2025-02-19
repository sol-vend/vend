import React, { useState, useRef, useEffect } from 'react';

const SnapSlider = ({ 
  items, 
  selectedIndex, 
  setSelectedIndex,
  itemWidth = 100,
  gap = 20 
}) => {
  const containerRef = useRef(null);
  const [touchPosition, setTouchPosition] = useState(null);
  const [dragDistance, setDragDistance] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Calculate total width needed and center offset
  const getItemOffset = (index) => {
    if (!containerRef.current) return 0;
    const containerWidth = containerRef.current.offsetWidth;
    const centerOffset = (containerWidth / 2) - (itemWidth / 2);
    return centerOffset - (index * (itemWidth + gap));
  };

  // Handle touch start
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchPosition(touch.clientX);
    setDragDistance(0);
    if (!isActive){
        setIsActive(true);
    }
  };

  // Handle touch move (only prevent default when the user is actively dragging)
  const handleTouchMove = (e) => {
    if (touchPosition === null) return; // Only process if a swipe is in progress
    e.preventDefault(); // Prevent default when swipe action is ongoing

    const touch = e.touches[0];
    const currentPosition = touch.clientX;
    const movement = currentPosition - touchPosition;
    
    setDragDistance(movement);
  };

  // Handle touch end
  const handleTouchEnd = () => {
    if (touchPosition === null) return;

    // Determine direction and magnitude of swipe
    const swipeThreshold = itemWidth / 4;
    let indexChange = 0;

    if (Math.abs(dragDistance) >= swipeThreshold) {
      indexChange = dragDistance > 0 ? -1 : 1;
    }

    const newIndex = Math.max(0, Math.min(selectedIndex + indexChange, items.length - 1));
    setSelectedIndex(newIndex);

    // Reset touch state
    setTouchPosition(null);
    setDragDistance(0);
    setIsActive(false);
  };

  // Calculate current transform
  const getCurrentTransform = () => {
    const baseOffset = getItemOffset(selectedIndex);
    return baseOffset + (dragDistance || 0);
  };

  useEffect(() => {
    const containerElement = containerRef.current;

    // Use non-passive listeners for touch events (needed to prevent default on touchmove)
    const handleTouchStartNonPassive = (e) => handleTouchStart(e);
    const handleTouchMoveNonPassive = (e) => handleTouchMove(e);
    const handleTouchEndNonPassive = (e) => handleTouchEnd(e);

    // Adding event listeners with passive: false to prevent default behavior during swipe
    containerElement.addEventListener('touchstart', handleTouchStartNonPassive, { passive: false });
    containerElement.addEventListener('touchmove', handleTouchMoveNonPassive, { passive: false });
    containerElement.addEventListener('touchend', handleTouchEndNonPassive, { passive: false });

    return () => {
      containerElement.removeEventListener('touchstart', handleTouchStartNonPassive);
      containerElement.removeEventListener('touchmove', handleTouchMoveNonPassive);
      containerElement.removeEventListener('touchend', handleTouchEndNonPassive);
    };
  }, [touchPosition, dragDistance, selectedIndex]);

  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden w-full"
      style={{ transform: isActive ? 'scale(1.1)' :'scale(1.00)', height: `${itemWidth}px`}}
    >
      <div
        className="absolute flex items-center h-full touch-none select-none"
        style={{
          transform: `translateX(${getCurrentTransform()}px)`,
          transition: touchPosition === null ? 'transform 0.3s ease-out' : 'none',
          gap: `${gap}px`
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-center shrink-0"
            style={{
              width: `${itemWidth}px`,
              opacity: selectedIndex === index ? 1 : 0.5,
              transition: 'opacity 0.3s ease',
              fontSize:'14px'
            }}
          >
            <div 
              className={`text-center p-2 rounded ${
                selectedIndex === index ? 'bg-blue-100' : ''
              }`}
            >
              {item.name.length < 10 ? item.name : `${item.name.substring(0, 9)}...` || ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SnapSlider;
