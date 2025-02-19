import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa';
import SwipeIndicator from '../SwipeIndicator';
import SnapSlider from './SnapSlider';

const ItemCarousel = ({ groups, currentGroupIndex, handleItemChange, handleAddItem, selectedIndex, setSelectedIndex}) => {
    const [transformValue, setTransformValue] = useState(0); // For scroll translation
    const [isMobile, setIsMobile] = useState(false); // Check if the device is mobile
    const defaultGap = 50; // Gap between items in the carousel (adjust this based on desired gap)
    const items = groups[currentGroupIndex].items;

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768); // Adjust based on screen width
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile); // Cleanup
    }, []);


    const handleNext = () => {
        setSelectedIndex((prevIndex) => Math.min(prevIndex + 1, items.length - 1));
    };

    const handlePrev = () => {
        setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const newItemHandler = (currentGroupIndex, selectedIndex) => {
        handleAddItem(currentGroupIndex);
        setSelectedIndex(selectedIndex + 1);
        setTransformValue((-1) * defaultGap);
    }

    /*   // Handle touch event listeners manually
       useEffect(() => {
           const itemCarouselWrapper = document.querySelector('.item-carousel-items-wrapper');
   
           if (itemCarouselWrapper) {
               // Attach touch event listeners
               itemCarouselWrapper.addEventListener('touchstart', handleTouchStart, { passive: false });
               itemCarouselWrapper.addEventListener('touchmove', handleTouchMove, { passive: false });
               itemCarouselWrapper.addEventListener('touchend', handleTouchEnd, { passive: false });
   
               // Cleanup event listeners on component unmount
               return () => {
                   itemCarouselWrapper.removeEventListener('touchstart', handleTouchStart);
                   itemCarouselWrapper.removeEventListener('touchmove', handleTouchMove);
                   itemCarouselWrapper.removeEventListener('touchend', handleTouchEnd);
               };
           }
       }, [startTouchX, endTouchX]); // Re-run effect when touch position changes
   */
    return (
        <>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '100%' }}>
                    <div className="item-carousel-wrapper" style={{ width: '100%', position: 'relative' }}>
                        <div
                            className="item-carousel-items-wrapper"
                            style={{ display: 'flex', height: '100%', width: '100%' }}
                        >
                            <div className="carousel-controls header-carousel">
                                <>

                                    <button className="header-carousel-arrow header-carousel-left-arrow" onClick={handlePrev}>
                                        <SwipeIndicator direction={'left'} numArrows={3} size={10} />
                                    </button>
                                    {isMobile && <SnapSlider items={items} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} itemWidth={50} gap={20} />}
                                    {!isMobile && <div>{items[selectedIndex].name === "" ? "Items" : items[selectedIndex].name}</div>}
                                    <button className="header-carousel-arrow header-carousel-right-arrow" onClick={handleNext}>
                                        <SwipeIndicator direction={'right'} numArrows={3} size={10} />
                                    </button>

                                </>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ width: '100%', height: '100%' }}>
                <div>
                    {groups[currentGroupIndex].items.map((item, itemIndex) => {
                        const isSelected = itemIndex === selectedIndex;
                        return (
                            <div key={itemIndex} style={{}}>
                                <div
                                    className="vendor-input-group-styles"
                                    style={{
                                        opacity: isSelected ? 1 : 0.1,
                                        transform: `translateX(${isSelected ? 0 : itemIndex < selectedIndex ? '-10px' : '10px'}) translateY(${isSelected ? "0" : "20px"})`,
                                        transition: 'transform 0.3s ease, opacity 0.3s ease',
                                        position: 'absolute',
                                        border: isSelected ? "solid black 4px" : "solid transparent 1px",
                                        zIndex: isSelected ? "1" : "0",
                                        background: isSelected ? 'linear-gradient(45deg, white, transparent)' : 'transparent',
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
                                    <div
                                        className="vendor-show-hide-styles"
                                        onClick={isSelected ? () => newItemHandler(currentGroupIndex, selectedIndex) : () => { return null }}
                                    >
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

