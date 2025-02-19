import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Arrow icons
import SwipeIndicator from './SwipeIndicator';

const HeaderCarousel = ({ headerOpts, setState, name, isMobileDevice }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [startTouchX, setStartTouchX] = useState(0); // To track touch start position
    const [translateX, setTranslateX] = useState(0); // For swipe translation
    let startX = 0; // To track the initial position for swipe logic

    // Handle the touch move event to update the translation while swiping
    const handleTouchMove = (e) => {
        const currentX = e.changedTouches[0].clientX;
        const deltaX = currentX - startX;

        // Update the translateX value to move the carousel content with the swipe
        setTranslateX(deltaX);
    };

    // Handle the touch end event to finalize the swipe and move to the next/prev item
    const handleTouchEnd = () => {
        if (translateX > 100) {
            handlePrev(); // Swiped right
        } else if (translateX < -100) {
            handleNext(); // Swiped left
        }

        // Reset the translation back to 0 with smooth transition
        setTranslateX(0);
    };

    const handlePrev = () => {
        setSelectedIndex(prevIndex => prevIndex === 0 ? headerOpts.length - 1 : prevIndex - 1);
    };

    const handleNext = () => {
        setSelectedIndex(prevIndex => prevIndex === headerOpts.length - 1 ? 0 : prevIndex + 1);
    };

    const handleTouchStart = (e) => {
        // Record the initial touch position when touch starts
        setStartTouchX(e.changedTouches[0].clientX);
        startX = e.changedTouches[0].clientX;
    };

    useEffect(() => {
        setState((prevVal) => ({
            ...prevVal,
            [name]: selectedIndex
        }));
    }, [selectedIndex, setState, name]);

    return (
        <div
            className="header-carousel swipable"
            style={{ transform: `translateX(${translateX}px)`, transition: 'transform 0.2s ease' }}
            onTouchStart={handleTouchStart} // Track the start of the touch
            onTouchMove={handleTouchMove} // Update the translateX during touch move
            onTouchEnd={handleTouchEnd}   // Handle the swipe logic on touch end
        >
            <div className="header-carousel-content">
                <button onClick={handlePrev} className="header-carousel-arrow header-carousel-left-arrow">
                    {isMobileDevice && <SwipeIndicator direction={'left'} numArrows={5} size={12} />}
                    {!isMobileDevice && <SwipeIndicator direction={'left'} numArrows={1} size={12} />}
                </button>

                <div className="header-carousel-header">
                    <h2>{headerOpts[selectedIndex]}</h2>
                </div>

                <button onClick={handleNext} className="header-carousel-arrow header-carousel-right-arrow">
                    {isMobileDevice && <SwipeIndicator direction={'right'} numArrows={5} size={12} />}
                    {!isMobileDevice && <SwipeIndicator direction={'right'} numArrows={1} size={12} />}
                </button>
            </div>
        </div>
    );
};

export default HeaderCarousel;

