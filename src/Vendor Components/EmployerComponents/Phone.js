import React from "react";

const Phone = ({ children, marginBottom = 0 }) => {
    return (
        <div className='mobile-demo-wrapper' style={{marginBottom: `${marginBottom}px`}}>
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