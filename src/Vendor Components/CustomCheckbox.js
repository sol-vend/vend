import React, { useState, useRef, useEffect } from 'react';

const CustomCheckbox = ({ label, checked, onChange, name, index }) => {
    const [isChecked, setIsChecked] = useState(checked);
    const [translationDistance, setTranslationDistance] = useState(0);
    const [translationOffset, setTranslationOffset] = useState(0);
    const checkboxRef = useRef(null);
    const toggleRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsChecked(checked); // Sync local state with prop
      }, [checked]);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);


    useEffect(() => {
        if (checkboxRef.current && toggleRef.current) {
            const width = checkboxRef.current.offsetWidth;
            const toggleWidth = toggleRef.current.offsetWidth;
            setTranslationDistance(width - (toggleWidth + translationOffset));
        }
    }, [translationOffset]);

    useEffect(() => {
        if (isMobile){
            setTranslationOffset(2);
        } else{
            setTranslationOffset(4);
        }
    }, [isMobile])

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
        <div className='custom-checkbox-wrapper-wrapper'>
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
                    <span className="custom-checkbox" ref={checkboxRef}>
                        <span
                            className={`custom-checkbox-inner ${isChecked ? 'checked' : ''}`}
                            ref={toggleRef}
                            style={{
                                transform: isChecked ? `translateX(${translationDistance}px)` : 'none'
                            }}
                        ></span>
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
