import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa'; // Assuming you want arrows

const ItemCarousel = ({ groups, currentGroupIndex, handleItemChange, handleAddItem }) => {
    console.log(groups);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [startTouchX, setStartTouchX] = useState(0); // Track touch start position
    const [isMobile, setIsMobile] = useState(false); // Detect if the device is mobile
    const [flippedDownLeader, setFlippedDownLeader] = useState(false);
    console.log(groups[currentGroupIndex]);
    // Detect mobile devices based on screen width
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768); // 768px is the breakpoint for mobile
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile); // Re-check on window resize

        return () => window.removeEventListener('resize', checkIfMobile); // Cleanup listener
    }, []);

    // Move to the next item
    const handleNext = () => {
        setSelectedIndex((prevIndex) => (prevIndex + 1) % groups[currentGroupIndex].items.length);
    };

    // Move to the previous item
    const handlePrev = () => {
        setSelectedIndex(
            (prevIndex) => (prevIndex - 1 + groups[currentGroupIndex].items.length) % groups[currentGroupIndex].items.length
        );
    };

    // Handle touch start (mobile)
    const handleTouchStart = (e) => {
        setStartTouchX(e.changedTouches[0].clientX);
        if (!flippedDownLeader) {
            setFlippedDownLeader(true);
        }
    };

    // Handle touch move (mobile)
    const handleTouchMove = (e) => {
        // Prevent default to avoid page scrolling
        e.preventDefault();
    };

    const handleTouchEnd = (e) => {
        const endTouchX = e.changedTouches[0].clientX; // End touch position
        if (startTouchX > endTouchX) {
            handleNext();
        } else if (startTouchX < endTouchX) {
            handlePrev();
        }
        if (flippedDownLeader) {
            setFlippedDownLeader(false);
        }
    };

    return (
        <>
            <div
                style={{
                    width: '100%', display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <div
                    style={{ width: '100%' }}
                >
                    <div className="item-carousel-wrapper"
                        style={{ width: '100%', position: 'relative' }}
                    >
                        <div
                            className={flippedDownLeader ? "item-carousel-items-wrapper invisible" : "item-carousel-items-wrapper"}
                            style={{ display: 'flex', height: '100%', width: '100%' }}
                            onTouchStart={isMobile ? handleTouchStart : undefined} // Only activate on mobile
                            onTouchMove={isMobile ? handleTouchMove : undefined} // Prevent default on mobile
                            onTouchEnd={isMobile ? handleTouchEnd : undefined} // Handle swipe on mobile
                        >
                            <div className="carousel-controls header-carousel">
                                <>
                                    {!isMobile && (
                                        <button onClick={handlePrev}>
                                            <FaArrowLeft size={20} />
                                        </button>
                                    )}
                                    <p>Items</p>
                                    {!isMobile && (
                                        <button onClick={handleNext}>
                                            <FaArrowRight size={20} />
                                        </button>
                                    )}
                                </>
                            </div>

                        </div>
                        <div className={flippedDownLeader ? 'wheel-leader-top visible' : 'wheel-leader-top'}></div>
                        <div
                            style={{
                                top: '-55px',
                                position: 'absolute',
                                zIndex: '-1',
                                borderColor:'#565454'
                            }}
                            className={flippedDownLeader ? 'wheel-leader-top visible' : 'wheel-leader-top'}></div>
                    </div>
                </div>
            </div>
            <div
                style={{ width: '100%', height: '100%' }}
            >
                <div>
                    {groups[currentGroupIndex].items.map((item, itemIndex) => {
                        const isSelected = itemIndex === selectedIndex;
                        return (
                            <div
                                style={{

                                }}
                            >
                                <div
                                    key={itemIndex}
                                    className="vendor-input-group-styles"
                                    style={{
                                        opacity: isSelected ? 1 : 0.2,
                                        transform: `translateX(${isSelected ? 0 : itemIndex < selectedIndex ? '-100px' : '100px'}) translateY(${isSelected ? "0" : "20px"})`,
                                        transition: 'transform 0.3s ease, opacity 0.3s ease',
                                        position: 'absolute',
                                        border: isSelected ? "solid black 4px" : "solid transparent 1px",
                                        zIndex: isSelected ? "1" : "0",
                                    }}
                                >
                                    <input
                                        className="vendor-input-field-styles"
                                        style={{ width: '10vw' }}
                                        type="text"
                                        disabled={!isSelected}
                                        placeholder="Item Name"
                                        value={item.name}
                                        onChange={(e) => handleItemChange(currentGroupIndex, itemIndex, 'name', e.target.value)}
                                    />
                                    <input
                                        className="vendor-input-field-styles"
                                        style={{ width: '10vw' }}
                                        type="number"
                                        placeholder="Price"
                                        value={item.price}
                                        onChange={(e) => handleItemChange(currentGroupIndex, itemIndex, 'price', e.target.value)}
                                    />
                                    <div className="vendor-show-hide-styles" onClick={isSelected ? () => (handleAddItem(currentGroupIndex), setSelectedIndex(selectedIndex + 1)) : () => { return null }}>
                                        <FaCheck />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default ItemCarousel;
