import React, { useState } from 'react';
import Draggable from 'react-draggable'; // For drag and drop
import { ResizableBox } from 'react-resizable'; // For resizing
import 'react-resizable/css/styles.css';
import CustomCheckbox from '../CustomCheckbox';

// Component to handle customization of each element
const FrontendDesigner = () => {
    const [rotatedDisplay, setRotatedDisplay] = useState(false);
    const [interfacePreferences, setInterfacePreferences] = useState({
        businessName: 'Business Name',
        bannerText: 'Our Slogan',
        footerText: 'Thanks for your business!',
        background: '',
        isTipScreen: false
    })

    const handleTipChange = (index, e) => {
        const { name, value } = e.target;
        if (name === 'isTipScreen') {
            setInterfacePreferences((prevVals) => ({
                ...prevVals,
                [name]: e.target.checked
            }))
        }
    }

        const handleChange = (e) => {
            const { name, value } = e.target;
            setInterfacePreferences((prevVals) => ({
                ...prevVals,
                [name]: value
            }))
        }

        return (
            <div className='frontend-designer-wrapper'>
                <div className='frontend-options-wrapper'>
                    <div className='vendor-input-group-styles'>
                        <label>Business Name</label>
                        <input
                            type="text"
                            name="businessName"
                            value={interfacePreferences.businessName}
                            onChange={handleChange}
                            className='vendor-input-field-styles'
                            placeholder='Business Name'
                        />
                    </div>
                    <div className='vendor-input-group-styles'>
                        <label>Banner Text</label>
                        <input
                            type="text"
                            name="bannerText"
                            value={interfacePreferences.bannerText}
                            onChange={handleChange}
                            className='vendor-input-field-styles'
                            placeholder='Our Slogan'
                        />
                    </div>
                    <div className='vendor-input-group-styles'>
                        <label>Salutation</label>
                        <input
                            type="text"
                            name="footerText"
                            value={interfacePreferences.footerText}
                            onChange={handleChange}
                            className='vendor-input-field-styles'
                            placeholder='Thanks for your business!'
                        />
                    </div>
                    <div className='vendor-input-group-styles'>
                        <CustomCheckbox label={{ description: 'Allow Tipping?' }} checked={false} onChange={handleTipChange} name={'isTipScreen'} index={0}></CustomCheckbox>
                    </div>
                </div>

                <div className='mobile-demo-wrapper'>
                    <div className='phone-outline' style={{ position: 'absolute' }}>
                        <div className='screen-outline'>
                            <div className='speaker-outline'></div>
                            <div className='volume-up-button'></div>
                            <div className='volume-down-button'></div>
                            <div className='power-on-button'></div>
                            <div className='frontend-designer-bn'>
                                {interfacePreferences.businessName}
                            </div>
                            <div className='frontend-designer-slogan'>
                                {interfacePreferences.bannerText}
                            </div>
                            <div className='mobile-demo-qr'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="50%" height="20%" viewBox="0 0 24 24"><path d="M3 9h6V3H3zm1-5h4v4H4zm1 1h2v2H5zm10 4h6V3h-6zm1-5h4v4h-4zm1 1h2v2h-2zM3 21h6v-6H3zm1-5h4v4H4zm1 1h2v2H5zm15 2h1v2h-2v-3h1zm0-3h1v1h-1zm0-1v1h-1v-1zm-10 2h1v4h-1v-4zm-4-7v2H4v-1H3v-1h3zm4-3h1v1h-1zm3-3v2h-1V3h2v1zm-3 0h1v1h-1zm10 8h1v2h-2v-1h1zm-1-2v1h-2v2h-2v-1h1v-2h3zm-7 4h-1v-1h-1v-1h2v2zm6 2h1v1h-1zm2-5v1h-1v-1zm-9 3v1h-1v-1zm6 5h1v2h-2v-2zm-3 0h1v1h-1v1h-2v-1h1v-1zm0-1v-1h2v1zm0-5h1v3h-1v1h-1v1h-1v-2h-1v-1h3v-1h-1v-1zm-9 0v1H4v-1zm12 4h-1v-1h1zm1-2h-2v-1h2zM8 10h1v1H8v1h1v2H8v-1H7v1H6v-2h1v-2zm3 0V8h3v3h-2v-1h1V9h-1v1zm0-4h1v1h-1zm-1 4h1v1h-1zm3-3V6h1v1z" /><path fill="none" d="M0 0h24v24H0z" /></svg>
                            </div>
                            {interfacePreferences.isTipScreen &&
                                <div className='mobile-tip-option-demo'>
                                    <div style={{ display: 'block' }}>
                                        <p>Would you like to leave a tip?</p>
                                    </div>
                                    <div className='mobile-tip-option-span-wrapper'>
                                        <span>10%</span>
                                        <span>15%</span>
                                        <span>20%</span>
                                        <span>25%</span>
                                    </div>
                                </div>
                            }
                            <div className='frontend-designer-footer'>
                                {interfacePreferences.footerText}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    };

    export default FrontendDesigner;

