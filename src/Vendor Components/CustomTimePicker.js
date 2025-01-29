import React, { useState } from 'react';
import ClockFace from './ClockFace';

// Helper function to format time
const formatTime = (hour, minute) => {
    const formattedHour = hour < 10 ? `0${hour}` : hour;
    const formattedMinute = minute < 10 ? `0${minute}` : minute;
    return `${formattedHour}:${formattedMinute}`;
};

const CustomTimePicker = ({ onTimeChange }) => {
    const [hour, setHour] = useState(12); // Default to 12 hours
    const [minute, setMinute] = useState(0); // Default to 00 minutes

    const handleHourChange = (e) => {
        const newHour = parseInt(e.target.value, 10);
        if (newHour >= 0 && newHour <= 23) {
            setHour(newHour);
            onTimeChange(formatTime(newHour, minute)); // Notify parent component with the formatted time
        }
    };

    const handleMinuteChange = (e) => {
        const newMinute = parseInt(e.target.value, 10);
        if (newMinute >= 0 && newMinute <= 59) {
            setMinute(newMinute);
            onTimeChange(formatTime(hour, newMinute)); // Notify parent component with the formatted time
        }
    };

    return (
        <div className="custom-date-time-time-picker">
            <div className="custom-date-time-time-picker-container">
                <ClockFace isOpen={true} />
                <ClockFace isOpen={false} />
            </div>
        </div>
    );
};

export default CustomTimePicker;

