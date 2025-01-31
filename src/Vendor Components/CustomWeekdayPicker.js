import React, { useState, useEffect } from 'react';
import CustomTimePicker from './CustomTimePicker';
import ClockFace from './ClockFace';

const CustomWeekdayPicker = ({ onWeekdayChange }) => {
    const [selectedWeekdays, setSelectedWeekdays] = useState({
        sunday: { label: 'Sun', isSelected: false, open: false, close: false },
        monday: { label: 'Mon', isSelected: false, open: false, close: false },
        tuesday: { label: 'Tue', isSelected: false, open: false, close: false },
        wednesday: { label: 'Weds', isSelected: false, open: false, close: false },
        thursday: { label: 'Thur', isSelected: false, open: false, close: false },
        friday: { label: 'Fri', isSelected: false, open: false, close: false },
        saturday: { label: 'Sat', isSelected: false, open: false, close: false },
    });
    console.log(selectedWeekdays);
    const handleDayChange = (day) => {
        setSelectedWeekdays((prevState) => ({
            ...prevState,
            [day]: {
                ...prevState[day],
                isSelected: !prevState[day].isSelected,
                open: prevState[day].isSelected ? false : prevState[day].open,
                close: prevState[day].isSelected ? false : prevState[day].close
            }
        }));
    }

    const handleApply = () => {
        onWeekdayChange(selectedWeekdays); // Notify parent component with selected weekdays
    };

    return (
        <div className="custom-date-time-weekday-picker">
            <div className="custom-date-time-weekdays">
                {Object.keys(selectedWeekdays).map((day) => (
                    <div
                        key={day}
                        className={selectedWeekdays[day].isSelected ? "custom-date-time-weekday-option date-time-selected" : "custom-date-time-weekday-option"}
                    >
                        <div
                            className={'custom-date-time-weekday-wrapper'}
                            onClick={() => handleDayChange(day)}
                        >
                            <p>{selectedWeekdays[day].label}</p>
                        </div>
                    </div>
                ))}
            </div>
            {Object.values(selectedWeekdays).some(day => day.isSelected) && (
                <>
                    <ClockFace height='70' width='70' isOpen={true} setSelectedWeekdays={setSelectedWeekdays} selectedWeekdays={selectedWeekdays} />
                    <ClockFace height='70' width='70' isOpen={false} setSelectedWeekdays={setSelectedWeekdays} selectedWeekdays={selectedWeekdays} />
                </>
            )}
        </div>
    );
};

export default CustomWeekdayPicker;

