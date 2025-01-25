import React, { useState, useEffect, useRef } from 'react';

const CustomDropdownInput = ({ options, displayKeys, imageKey, placeholderValue, setter }) => {
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);

    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    const handleInputChange = (e) => {
        const { value } = e.target;
        setInputValue(value);

        const filtered = options.filter(option =>
            displayKeys.some(key => option[key]?.toLowerCase().includes(value.toLowerCase()))
        );
        setFilteredOptions(filtered);
        setIsOpen(true);
    };

    const handleSelect = (option) => {
        setSelectedValue(option);
        setInputValue(option[displayKeys[0]]);
        setIsOpen(false);
    };

    useEffect(() => {
        setter(selectedValue);
    }, [selectedValue])

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <div
                style={{
                    display: 'flex',
                    gap: '10px'
                }}
            >
                <span
                    className='custom-dropdown-input-styles-wrapper'
                >
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        ref={inputRef}
                        onBlur={() => setTimeout(() => setIsOpen(false), 250)}
                        onFocus={() => setIsOpen(true)}
                        placeholder={placeholderValue}
                        className='custom-dropdown-input-styles'
                    />
                </span>
                <div
                    style={{
                        maxWidth: '5vw',
                        maxHeight: '5vw',
                    }}
                >
                    {selectedValue && selectedValue.logoURI &&
                        <div>
                            <img src={selectedValue.logoURI} alt={selectedValue.address} style={{ height: '40px' }} />
                        </div>
                    }
                </div>
            </div>
            {isOpen && filteredOptions.length > 0 && (
                <div
                    ref={dropdownRef}
                    className='custom-dropdown-dropdown-styles'
                >
                    {filteredOptions.map((option, index) => (
                        <div
                            key={index}
                            onClick={() => handleSelect(option)}
                            className='custom-dropdown-dropdown-option'
                        >
                            {option[imageKey] && (
                                <div>
                                    <img
                                        src={option[imageKey]}
                                        alt={option[displayKeys[0]]}
                                        style={{
                                            width: '30px',
                                            height: '30px',
                                            borderRadius: '50%',
                                            marginRight: '10px',
                                        }}
                                    />
                                </div>
                            )}
                            <span>{option[displayKeys[0]]}</span> {/* Display the selected key */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomDropdownInput;
