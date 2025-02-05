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
        <div style={checked ? {border: "solid black 1px"} : {}} className='vendor-input-radio-button-wrapper'>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginLeft: '10px', gap: '15px' }}>
            <input
                type="radio"
                value={value}
                checked={checked}
                onChange={onChange}
                style={{ display: 'none' }} // Hide the default radio button
            />
            <span
                className='radio-button-outline-wrapper'
            >
                <span
                    className="radio-button-inline-wrapper"
                >
                    {checked && (
                        <span className='custom-radio-button-inner-span-checked'
                        />
                    )}
                </span>
            </span>
            {label}
        </label>
        </div>
    );
};

export default CustomRadioButton;
