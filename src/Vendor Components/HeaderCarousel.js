import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Arrow icons

const HeaderCarousel = ({ headerOpts, setState, name }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const handlePrev = () => {
        setSelectedIndex(prevIndex => prevIndex === 0 ? headerOpts.length - 1 : prevIndex - 1);
    };
    const handleNext = () => {
        setSelectedIndex(prevIndex => prevIndex === headerOpts.length - 1 ? 0 : prevIndex + 1);
    };

    const handleSwipe = (e) => {
        if (e.changedTouches[0].clientX > e.targetTouches[0].clientX) {
            handleNext(); 
        } else {
            handlePrev(); 
        }
    };

    useEffect(() => {
        setState((prevVal) => ({
            ...prevVal,
            [name]: selectedIndex
        }))
    }, [selectedIndex])

    return (
        <div className="header-carousel" onTouchEnd={handleSwipe}>
            <div className="header-carousel-content">
                <button onClick={handlePrev} className="header-carousel-arrow header-carousel-left-arrow">
                    <FaArrowLeft size={30} />
                </button>

                <div className="header-carousel-header">
                    <h2>{headerOpts[selectedIndex]}</h2>
                </div>

                <button onClick={handleNext} className="header-carousel-arrow header-carousel-right-arrow">
                    <FaArrowRight size={30} />
                </button>
            </div>
        </div>
    );
};

export default HeaderCarousel;
