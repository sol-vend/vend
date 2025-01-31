import React, { useState, useEffect, useRef } from 'react';
import ClockSelection from './ClockSelection';

const ClockFace = ({ width, height, isOpen, setSelectedWeekdays, selectedWeekdays }) => {
    const [time, setTime] = useState({
        hour: null,
        minute: null,
        amPm: 'AM'
    });
    const [chooseTime, setChooseTime] = useState(true);
    const [hovered, setHovered] = useState(false);
    const [sameHours, setSameHours] = useState(true);
    const handleMouseEnter = () => setTimeout(() => setHovered(true), 250);
    const handleMouseLeave = () => setTimeout(() => setHovered(false), 500);
    const [currentSelectedWeekdays, setCurrentSelectedWeekdays] = useState([]);
    const [isTimeSelectionOpen, setIsTimeSelectionOpen] = useState(false);

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    const [clockFaceRotationAngle, setClockFaceRotationAngle] = useState({
        hour: (((parseInt(formattedDate.split(':')[0]) % 12) / 12) * 360),
        minute: ((parseInt(formattedDate.split(':')[1].split(' ')[0]) / 60) * 360),
    });

    const timeSelectionHandler = (e) => {
        e.stopPropagation();
        setIsTimeSelectionOpen(true);
    }

    const getRotationAngleForCurrentTime = () => {
        if (time.hour === null) {
            return {
                hour: (((parseInt(formattedDate.split(':')[0]) % 12) / 12) * 360),
                minute: ((parseInt(formattedDate.split(':')[1].split(' ')[0]) / 60) * 360),
            };
        } else {
            if (time.minute === null) {
                return {
                    hour: ((((time.hour % 12) + (1 / 12)) / 12) * 360),
                    minute: 0
                };
            } else {
                return {
                    hour: ((((time.hour % 12) + (1 / 12)) / 12) * 360),
                    minute: ((time.minute / 60) * 360)
                };
            }
        }
    };

    useEffect(() => {
        const arraysAreEqual = (arr1, arr2) => {
            if (arr1.length !== arr2.length) return false;
            return arr1.every((value, index) => value === arr2[index]);
        };
        let tempSelectedWeekdays = Object.keys(selectedWeekdays).filter((weekday) => selectedWeekdays[weekday].isSelected);
        if (!arraysAreEqual(currentSelectedWeekdays, tempSelectedWeekdays)) {
            setCurrentSelectedWeekdays(tempSelectedWeekdays);
        }
    }, [selectedWeekdays])

    useEffect(() => {
        setClockFaceRotationAngle(getRotationAngleForCurrentTime());
        const setTimesForDay = (key, timeValue) => {
            currentSelectedWeekdays.map((weekday) =>
                setSelectedWeekdays((prevResponse) => ({
                    ...prevResponse, // Spread the previous state to preserve other days' data
                    [weekday]: {
                        ...prevResponse[weekday], // Spread the existing day data
                        [key]: timeValue, // Set the open time
                    },
                })));
        };
        let minutes = time.minute === null ? 0 : time.minute;
        if (isOpen && time.hour !== null) {
            setTimesForDay('open', `${time.hour}:${minutes.length === 1 ? '0' + minutes : minutes} ${time.amPm}`)
        } else {
            setTimesForDay('close', `${time.hour}:${minutes.length === 1 ? '0' + minutes : minutes} ${time.amPm}`)
        }
    }, [time, currentSelectedWeekdays]);

    return (
        <div className="clock-face-wrapper">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 200 200"
                width={width}
                height={height}
                className="clock-face"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <defs>
                    <linearGradient id="openGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: 'lightgreen', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: 'lightblue', stopOpacity: 1 }} />
                    </linearGradient>
                    <linearGradient id="closeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: 'red', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: 'orange', stopOpacity: 1 }} />
                    </linearGradient>
                </defs>
                <circle
                    cx="100"
                    cy="100"
                    r="95"
                    fill={isOpen ? 'url(#openGrad)' : 'url(#closeGrad)'}
                    stroke="#B0B0B0"
                    strokeWidth="8"
                />
                {[...Array(12)].map((_, i) => {
                    const angle = (i * 30) * Math.PI / 180; // 30 degrees per hour
                    const x1 = 100 + 80 * Math.cos(angle);
                    const y1 = 100 + 80 * Math.sin(angle);
                    const x2 = 100 + 90 * Math.cos(angle);
                    const y2 = 100 + 90 * Math.sin(angle);
                    return (
                        <line
                            key={i}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="#B0B0B0"
                            strokeWidth="3"
                        />
                    );
                })}
                {[...Array(60)].map((_, i) => {
                    const angle = (i * 6) * Math.PI / 180; // 6 degrees per minute
                    const x1 = 100 + 90 * Math.cos(angle);
                    const y1 = 100 + 90 * Math.sin(angle);
                    const x2 = 100 + 95 * Math.cos(angle);
                    const y2 = 100 + 95 * Math.sin(angle);
                    return i % 5 === 0 ? (
                        <line
                            key={i}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="#A0D1B7"
                            strokeWidth="2"
                        />
                    ) : null;
                })}
                <path
                    d="M 100 100 L 100 40"
                    stroke="white"
                    strokeWidth="10"
                    strokeLinecap="round"
                    transform={`rotate(${clockFaceRotationAngle.hour} 100 100)`} // Hour hand rotation
                />
                <line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="20"
                    stroke="slateblue"
                    strokeWidth="5"
                    transform={`rotate(${clockFaceRotationAngle.minute} 100 100)`}
                />

                <circle cx="100" cy="100" r="10" fill="#A0D1B7" />
            </svg>
            <div
                className="joint-time-selection"
                onClick={timeSelectionHandler}
            >
                {Object.values(selectedWeekdays).some(day => day[isOpen ? 'open' : 'close']) &&
                    <p>{Object.values(selectedWeekdays).find(day => day[isOpen ? 'open' : 'close'])[isOpen ? 'open' : 'close'].includes('nul') ? 'Select Time' : Object.values(selectedWeekdays).find(day => day[isOpen ? 'open' : 'close'])[isOpen ? 'open' : 'close']}</p>
                }
                {!Object.values(selectedWeekdays).some(day => day[isOpen ? 'open' : 'close']) &&
                    <p>Select Time</p>
                }

                {isTimeSelectionOpen && (
                    <ClockSelection setTime={setTime} setIsTimeSelectionOpen={setIsTimeSelectionOpen} isTimeSelectionOpen={isTimeSelectionOpen} />
                )}
            </div>
        </div>
    );
};

export default ClockFace;