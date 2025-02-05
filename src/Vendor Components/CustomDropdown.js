import React, { useState, useEffect, useRef } from 'react';

const CustomDropdown = ({ options, selectedValue, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);  

    const handleToggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelectOption = (option) => {
        onSelect(option);
        setIsOpen(false); 
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={dropdownRef} style={{ position: 'relative' }}>
            <div
                onClick={handleToggleDropdown}
                className='custom-dropdown-option-wrapper'
            >
                <span>{selectedValue || 'Platform'}</span>
                <span style={{ fontSize: '12px' }}>▼</span>
            </div>
            {isOpen && (
                <div
                    className='custom-dropdown-option-list'
                >
                    {options.map((platform) => (
                        <div
                            key={platform.value}
                            className='custom-dropdown-option-item'
                            onClick={() => handleSelectOption(platform)}
                        >
                            <img
                                src={platform.imageUrl}
                                alt={platform.name}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;

