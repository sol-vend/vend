import React, { useState, useEffect, useRef } from "react";

const ClockSelection = ({ setTime, setIsTimeSelectionOpen, isTimeSelectionOpen }) => {
    const [selectedScrollTimes, setSelectedScrollTimes] = useState({
        hour: null,
        minute: null,
        amPm: null
    });
    const dropdownRef = useRef(null);

    const handleChange = (e) => {
        e.preventDefault();
        const name = e.target.getAttribute('name');
        const value = e.target.getAttribute('value');
        setSelectedScrollTimes((prevState) => ({
            ...prevState,
            [name]: value
        }));
        setTime((prevState) => {
            const updatedTime = { ...prevState, [name]: value };
            if (name === 'hour') {
                updatedTime.minute = '00';
            }
            return updatedTime;
        });
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside); // Cleanup
        };
    }, []);

    const handleClickOutside = (event) => {
        console.log(event);
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsTimeSelectionOpen(false); // Close the dropdown
        }
    };

    return (
        <div
            name="timeSelection"
            className="joint-time-selection-wrapper"
            ref={dropdownRef}
        >
            <div className="joint-time-selection-time" onMouseDown={(e) => e.stopPropagation()}>
                {Array.from({ length: 12 }).map((_, index) => (
                    <p
                        name="hour"
                        value={(index + 1).toString()}
                        onClick={handleChange}
                        onMouseDown={(e) => e.stopPropagation()}
                        className={selectedScrollTimes.hour === (index + 1).toString() ? 'clock-selection-selected' : ''}
                    >
                        {(index + 1).toString()}
                    </p>
                ))}
            </div>
            <div className="joint-time-selection-time" onMouseDown={(e) => e.stopPropagation()}>
                {Array.from({ length: 60 }).map((_, index) => (
                    <p
                        name="minute"
                        value={index.toString().padStart(2, '0')}
                        onClick={handleChange}
                        onMouseDown={(e) => e.stopPropagation()} // Prevent click propagation
                        className={selectedScrollTimes.minute === index.toString().padStart(2, '0') ? 'clock-selection-selected' : ''}
                    >
                        {index.toString().padStart(2, '0')}
                    </p>
                ))}
            </div>
            <div className="joint-time-selection-time" onMouseDown={(e) => e.stopPropagation()}>
                {['AM', 'PM'].map((_, index) => (
                    <p
                        name="amPm"
                        value={_}
                        onClick={handleChange}
                        onMouseDown={(e) => e.stopPropagation()}
                        className={selectedScrollTimes.amPm === _ ? 'clock-selection-selected' : ''}
                    >
                        {_}
                    </p>
                ))}
            </div>
        </div>
    )
}

export default ClockSelection;