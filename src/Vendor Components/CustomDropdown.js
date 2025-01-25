import React, { useState } from 'react';

const CustomDropdown = ({ options, selectedValue, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelectOption = (option) => {
        onSelect(option);
        setIsOpen(false); 
    };

    return (
        <div style={{ position: 'relative' }}>
            <div
                onClick={handleToggleDropdown}
                style={{
                    position: 'relative',
                    width: '100%',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                }}
            >
                <span>{selectedValue || 'Select Platform'}</span>
                <span style={{ fontSize: '12px' }}>▼</span>
            </div>
            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: '0',
                        right: '0',
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        zIndex: '1000',
                        marginTop: '5px',
                    }}
                >
                    {options.map((platform) => (
                        <div
                            key={platform.value}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '8px',
                                cursor: 'pointer',
                                backgroundColor: '#fff',
                                borderBottom: '1px solid #ddd',
                            }}
                            onClick={() => handleSelectOption(platform)}
                        >
                            <img
                                src={platform.imageUrl}
                                alt={platform.name}
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    marginRight: '10px',
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;
