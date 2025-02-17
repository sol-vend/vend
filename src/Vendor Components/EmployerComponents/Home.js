import React, { useState, useEffect, useRef } from 'react';
import { FaUser } from 'react-icons/fa';
import Tooltip from '../Tooltip';
import FrontendDesigner from './FrontendDesigner';
import HeaderCarousel from '../HeaderCarousel';
import EmployeeInterfaceDesigner from './EmployeeInterfaceDesigner';
import { fetchDataWithAuth } from '../Shared';

const Home = ({ loginInfos }) => {
    const [userSettingsDropdownClicked, setUserSettingsDropdownClicked] = useState(false);
    const [isMobileDevice, setIsMobileDevice] = useState(window.innerWidth <= 768);
    const [selectedOptionCard, setSelectedOptionCard] = useState({ name: 'editPos', component: [<FrontendDesigner />, <EmployeeInterfaceDesigner />], headerOpts: ['What My Customers See', 'What My Employees Use'], selectedIndex: 0 })
    const optionsRef = useRef(null);
    const userRef = useRef(null);
    const [loginInformation, setLoginInformation] = useState(false);
    const [bottomBannerMobileStyle, setBottomBannerMobileStyle] = useState('');
    const [scrollHeight, setScrollHeight] = useState(0);
    const elementRef = useRef(null);
  
    // Observer to track scrollHeight
    useEffect(() => {
      if (elementRef.current) {
        const observer = new ResizeObserver(() => {
          setScrollHeight(elementRef.current.scrollHeight);
        });
        observer.observe(elementRef.current);
        return () => {
          observer.disconnect();
        };
      }
    }, []);
  
    // Toggle bottom banner class based on scrollHeight
    useEffect(() => {
        console.log('scroll...')
        // Check for Y overflow
        const hasOverflow = document.documentElement.scrollHeight > document.documentElement.clientHeight;
        setBottomBannerMobileStyle(hasOverflow ? 'home-home-bottom-banner' : 'home-home-bottom-banner abs');
    }, [scrollHeight]);

    const handleUserSettingsClick = () => {
        setUserSettingsDropdownClicked(true);
    }

    const handleLogOut = () => {
        localStorage.setItem('authToken', '')
    }

    const userSettingsOptions = [
        { text: "Log Out", handler: handleLogOut },
        { text: "Edit Account Information", handler: () => { } },
        { text: "Contact Support", handler: () => { } }
    ]

    const handleClickOutside = (event) => {
        if (optionsRef.current && !optionsRef.current.contains(event.target)) {
            if (userRef.current && !userRef.current.contains(event.target)) {
                setUserSettingsDropdownClicked(false);
            }
        }
    };

    useEffect(() => {
        if (!loginInformation) {
            fetchDataWithAuth(setLoginInformation);
        }
    }, [])

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setIsMobileDevice(true);
            } else {
                setIsMobileDevice(false);
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className='home-home-outer-wrapper' ref={elementRef}>
            <div className="user-settings-icon" onClick={handleUserSettingsClick} ref={userRef}>
                <FaUser size={20} />
                {userSettingsDropdownClicked &&
                    <div id="user-settings-dropdown" ref={optionsRef}>
                        {userSettingsOptions.map((opt) =>
                            <div
                                onClick={opt.handler}
                            >
                                {opt.text}
                            </div>
                        )}
                    </div>
                }
            </div>
            <div className='home-home-top-banner'>
                <h1>Manager</h1>
                {loginInformation && loginInformation.user_id &&
                    <p>{loginInformation.user_id ? loginInformation.user_id.includes('@') ? loginInformation.user_id.split('@')[0] : loginInfos.user_id : ""}</p>
                }
            </div>
            <div style={{ position: 'relative' }}>
                <div className='home-home-primary-content'>
                    {!isMobileDevice &&
                        <div className='home-home-left-banner'>
                            <div>
                                <div className="options-container">
                                    <div className={selectedOptionCard.name === "editPos" ? "option-card selected" : "option-card"} name="editPos" onClick={() => alert('Edit POS Interface')}>
                                        <Tooltip message={"Modify POS system settings, layout, and products."}>
                                            <h3>Edit Point of Sale Interface</h3>
                                        </Tooltip>
                                    </div>
                                    <div className={selectedOptionCard.name === "gotoPos" ? "option-card selected" : "option-card"} name="gotoPos" onClick={() => alert('Go to POS Interface')}>
                                        <Tooltip message={"Access the live POS interface for transactions."}>
                                            <h3>Go to Point of Sale Interface</h3>
                                        </Tooltip>
                                    </div>
                                    <div className={selectedOptionCard.name === "manageEmployees" ? "option-card selected" : "option-card"} name="manageEmployees" >
                                        <Tooltip message={"Add or manage employee roles and permissions."}>
                                            <h3>Manage Employees</h3>
                                        </Tooltip>
                                    </div>
                                    <div className={selectedOptionCard.name === "viewMetrics" ? "option-card selected" : "option-card"} name="viewMetrics" onClick={() => alert('View Infometrics')}>
                                        <Tooltip message={"View detailed analytics and sales data."}>
                                            <h3>View Infometrics</h3>
                                        </Tooltip>
                                    </div>
                                    <div className={selectedOptionCard.name === "configurePayment" ? "option-card selected" : "option-card"} name="configurePayment" onClick={() => alert('Manage Payment Options')}>
                                        <Tooltip message={"Configure available payment methods."}>
                                            <h3>Manage Payment Options</h3>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    <div className='home-home-center-content'>
                        <HeaderCarousel headerOpts={selectedOptionCard.headerOpts} setState={setSelectedOptionCard} name={'selectedIndex'}>
                            <h2>
                                {selectedOptionCard.headerOpts[selectedOptionCard.selectedIndex]}
                            </h2>
                        </HeaderCarousel>
                        {selectedOptionCard.component[selectedOptionCard.selectedIndex]}
                    </div>
                </div>
            </div>
            <div>
                {isMobileDevice &&
                    <div className={bottomBannerMobileStyle}>
                        <div className={selectedOptionCard.name === "editPos" ? "option-card selected" : "option-card"} name="editPos" onClick={() => alert('Edit POS Interface')}>
                            <Tooltip message={"Modify POS system settings, layout, and products."}>
                                <h3>Edit Point of Sale Interface</h3>
                            </Tooltip>
                        </div>
                        <div className={selectedOptionCard.name === "gotoPos" ? "option-card selected" : "option-card"} name="gotoPos" onClick={() => alert('Go to POS Interface')}>
                            <Tooltip message={"Access the live POS interface for transactions."}>
                                <h3>Go to Point of Sale Interface</h3>
                            </Tooltip>
                        </div>
                        <div className={selectedOptionCard.name === "manageEmployees" ? "option-card selected" : "option-card"} name="manageEmployees" >
                            <Tooltip message={"Add or manage employee roles and permissions."}>
                                <h3>Manage Employees</h3>
                            </Tooltip>
                        </div>
                        <div className={selectedOptionCard.name === "viewMetrics" ? "option-card selected" : "option-card"} name="viewMetrics" onClick={() => alert('View Infometrics')}>
                            <Tooltip message={"View detailed analytics and sales data."}>
                                <h3>View Infometrics</h3>
                            </Tooltip>
                        </div>
                        <div className={selectedOptionCard.name === "configurePayment" ? "option-card selected" : "option-card"} name="configurePayment" onClick={() => alert('Manage Payment Options')}>
                            <Tooltip message={"Configure available payment methods."}>
                                <h3>Manage Payment Options</h3>
                            </Tooltip>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default Home;

