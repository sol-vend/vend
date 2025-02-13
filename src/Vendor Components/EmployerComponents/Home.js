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
    const [selectedOptionCard, setSelectedOptionCard] = useState({ name: 'editPos', component: [<FrontendDesigner />, <EmployeeInterfaceDesigner />], headerOpts: ['Control what my Customers See', 'Control what my Employees See'], selectedIndex: 0 })
    const optionsRef = useRef(null);
    const userRef = useRef(null);
    const [loginInformation, setLoginInformation] = useState(false);

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
        <div className='home-home-outer-wrapper'>
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

                                {/* Other options */}
                                <div className={selectedOptionCard.name === "viewPaymentHistory" ? "option-card selected" : "option-card"} name="viewPaymentHistory" onClick={() => alert('View Transaction History')}>
                                    <Tooltip message={"Transaction History."}>
                                        <h3>Transaction History</h3>
                                    </Tooltip>
                                </div>
                                {/*
                            <div className="option-card" onClick={() => alert('Inventory Management')}>
                                <Tooltip message={"Track and manage your product inventory."}>
                                    <h3>Inventory Management</h3>
                                </Tooltip>
                            </div>

                            <div className="option-card" onClick={() => alert('Customer Management')}>
                                <Tooltip message={"View customer profiles and transaction history."}>
                                    <h3>Customer Management</h3>
                                </Tooltip>
                            </div>

                            <div className="option-card" onClick={() => alert('Generate Reports')}>
                                <Tooltip message={"Download sales and transaction reports."}>
                                    <h3>Generate Reports</h3>
                                </Tooltip>
                            </div>

                            <div className="option-card" onClick={() => alert('System Settings')}>
                                <Tooltip message={"Adjust general system settings like language, time zone, etc."}>
                                    <h3>System Settings</h3>
                                </Tooltip>
                            </div>
                            */}
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
            {isMobileDevice &&
                <div className='home-home-bottom-banner'>
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

                    {/* Other options */}
                    <div className={selectedOptionCard.name === "viewPaymentHistory" ? "option-card selected" : "option-card"} name="viewPaymentHistory" onClick={() => alert('View Transaction History')}>
                        <Tooltip message={"Transaction History."}>
                            <h3>Transaction History</h3>
                        </Tooltip>
                    </div>
                    {/*
                            <div className="option-card" onClick={() => alert('Inventory Management')}>
                                <Tooltip message={"Track and manage your product inventory."}>
                                    <h3>Inventory Management</h3>
                                </Tooltip>
                            </div>

                            <div className="option-card" onClick={() => alert('Customer Management')}>
                                <Tooltip message={"View customer profiles and transaction history."}>
                                    <h3>Customer Management</h3>
                                </Tooltip>
                            </div>

                            <div className="option-card" onClick={() => alert('Generate Reports')}>
                                <Tooltip message={"Download sales and transaction reports."}>
                                    <h3>Generate Reports</h3>
                                </Tooltip>
                            </div>

                            <div className="option-card" onClick={() => alert('System Settings')}>
                                <Tooltip message={"Adjust general system settings like language, time zone, etc."}>
                                    <h3>System Settings</h3>
                                </Tooltip>
                            </div>
                            */}
                </div>
            }
        </div>
    );
}

export default Home;
