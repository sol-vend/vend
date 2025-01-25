import React from 'react';

const CustomRadioButton = ({
    label,
    value,
    checked,
    onChange,
    color = "#007bff",  // Default color if not provided
    size = "20px"       // Default size for the radio button
}) => {

    return (
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginLeft: '10px', gap: '15px' }}>
            <input
                type="radio"
                value={value}
                checked={checked}
                onChange={onChange}
                style={{ display: 'none' }} // Hide the default radio button
            />
            <span
                style={{
                    boxShadow: "#2d4e8559 -4px 3px 20px 1px",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px"
                }}
            >
                <span
                    className="custom-radio-btn"
                    style={{
                        width: size,
                        height: size,
                        borderRadius: '50%',
                        border: `2px solid ${color}`,
                        backgroundColor: 'white',
                        display: 'inline-block',
                        position: 'relative',
                        transition: 'background-color 0.3s ease, border 0.3s ease',
                        cursor: 'pointer',
                        boxShadow: "inset #d8d7d7 -5px 5px 10px 1px"
                    }}
                >
                    {checked && (
                        <span
                            style={{
                                content: "",
                                position: 'absolute',
                                top: '4px',
                                left: '4px',
                                width: `calc(${size} - 8px)`,
                                height: `calc(${size} - 8px)`,
                                borderRadius: '20%',
                                background: "linear-gradient(45deg, #dc1fff, #0373fff2, transparent)"
                            }}
                        />
                    )}
                </span>
            </span>
            {label}
        </label>
    );
};

export default CustomRadioButton;
