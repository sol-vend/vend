import React, { useState, useEffect } from 'react';

const PasswordToggle = ({ parentSetPasswordVisibility }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(prevState => !prevState);
    };

    useEffect(() => {
        parentSetPasswordVisibility(passwordVisible);
    }, [passwordVisible])

    return (
        <div className="password-toggle-container">
            <button
                type="button"
                className="password-toggle-btn"
                onClick={togglePasswordVisibility}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                >
                    <path
                        d="M12 5c4.14 0 7.7 2.69 9.06 6.42-1.36 3.73-4.92 6.42-9.06 6.42-4.14 0-7.7-2.69-9.06-6.42C4.3 7.69 7.86 5 12 5zM12 7c-3.16 0-5.83 1.96-6.95 4.7 1.12 2.73 3.79 4.7 6.95 4.7s5.83-1.96 6.95-4.7C17.83 8.96 15.16 7 12 7zM12 8c2.35 0 4.52 1.5 5.35 3.65-1.03 1.79-3.08 3.15-5.35 3.15-2.35 0-4.52-1.5-5.35-3.65 1.03-1.79 3.08-3.15 5.35-3.15z"
                    />
                    {passwordVisible ? null : (
                        <path
                            d="M4 4l16 16"
                            stroke="#000"
                            strokeWidth="2"
                        />
                    )}
                </svg>
            </button>
        </div>
    );
};

export default PasswordToggle;
