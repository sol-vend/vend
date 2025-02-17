import React from "react";

const Phone = ({ children }) => {
    return (
        <div className='mobile-demo-wrapper'>
            <div className='phone-outline' style={{ position: 'absolute' }}>
                <div className='screen-outline'>
                    <div className='speaker-outline'></div>
                    <div className='volume-up-button'></div>
                    <div className='volume-down-button'></div>
                    <div className='power-on-button'></div>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Phone;