import React, { useState } from 'react';

const CustomCheckbox = ({ label, checked, onChange, name }) => {
    const [isChecked, setIsChecked] = useState(checked);

    const handleChange = (e) => {
        setIsChecked(e.target.checked);
        if (onChange) {
            onChange(e.target.checked);
        }
    };

    return (
        <label className="custom-checkbox-wrapper">
            {label && <span className="checkbox-label">{label}</span>}
            <input
                type="checkbox"
                checked={isChecked}
                name={name}
                onChange={handleChange}
                className="custom-checkbox-input"
            />
            <span className="custom-checkbox">
                <span className={`custom-checkbox-inner ${isChecked ? 'checked' : ''}`}></span>
            </span>
        </label>
    );
};

export default CustomCheckbox;
