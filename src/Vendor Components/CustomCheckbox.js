import React, { useState } from 'react';

const CustomCheckbox = ({ label, checked, onChange, name, index }) => {
    const [isChecked, setIsChecked] = useState(checked);

    const handleChange = (e) => {
        setIsChecked(e.target.checked);
        if (onChange) {
            if (index !== undefined) {
                onChange(index, e);
            } else {
                try {
                    onChange(e.target.checked);
                } catch {
                    
                }
            }
        }
    };

    return (
        <div className='custom-checkbox-wrapper'>
            <div>
                <label className="custom-checkbox-wrapper">
                    {label.title && <span className="checkbox-label">{label.title}</span>}

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
            </div>
            <div className='custom-checkbox-wrapper-paragraph-descriptor'>
                {label.description &&
                    <p>{label.description}</p>
                }
            </div>
        </div>
    );
};

export default CustomCheckbox;
