import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import Tooltip from '../Tooltip';

const Home = ({ loginInfos }) => {
    [userSettingsDropdownClicked, setUserSettingsDropdownClicked] = useState(false);

    const handleUserSettingsClick = () => {
        setUserSettingsDropdownClicked(true);
    }

    const handleUserSettingsClickAway = () => {
        setUserSettingsDropdownClicked(false);
    }

    return (
        <div className='home-home-outer-wrapper'>
            <div className="user-settings-icon" onClick={handleUserSettingsClick}>
                <FaUser size={20} />
                {userSettingsDropdownClicked &&
                    <select onBlur={handleUserSettingsClickAway}>
                        <option>

                        </option>
                    </select>
                }
            </div>
            <div className='home-home-top-banner'>
                <h1>Manager</h1>
                <p>{loginInfos.emailAddress.includes('@') ? loginInfos.emailAddress.split('@')[0] : loginInfos.emailAddress}</p>
            </div>
            <div className='home-home-primary-content'>
                <div className='home-home-left-banner'>
                    <div className='home-left-banner'>
                        <div className="options-container">
                            <div className="option-card" >
                                <Tooltip message={"Add or manage employee roles and permissions."}>
                                    <h3>Manage Employees</h3>
                                </Tooltip>
                            </div>

                            <div className="option-card" onClick={() => alert('Go to POS Interface')}>
                                <Tooltip message={"Access the live POS interface for transactions."}>
                                    <h3>Go to Point of Sale Interface</h3>
                                </Tooltip>
                            </div>

                            <div className="option-card" onClick={() => alert('Edit POS Interface')}>
                                <Tooltip message={"Modify POS system settings, layout, and products."}>
                                    <h3>Edit Point of Sale Interface</h3>
                                </Tooltip>
                            </div>

                            <div className="option-card" onClick={() => alert('View Infometrics')}>
                                <Tooltip message={"View detailed analytics and sales data."}>
                                    <h3>View Infometrics</h3>
                                </Tooltip>
                            </div>

                            <div className="option-card" onClick={() => alert('Manage Payment Options')}>
                                <Tooltip message={"Configure available payment methods."}>
                                    <h3>Manage Payment Options</h3>
                                </Tooltip>
                            </div>

                            {/* Other options */}
                            <div className="option-card" onClick={() => alert('View Transaction History')}>
                                <Tooltip message={"Search past transactions and payment logs."}>
                                    <h3>Transaction History</h3>
                                </Tooltip>
                            </div>

                            <div className="option-card" onClick={() => alert('System Notifications')}>
                                <Tooltip message={"Check for important system updates and alerts."}>
                                    <h3>System Notifications</h3>
                                </Tooltip>
                            </div>

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
                        </div>
                    </div>
                </div>
                <div className='home-home-center-content'>
                    This is the center section.
                    All Selected and displayed content should go in here.
                </div>
            </div>
            <div className='home-home-bottom-banner'>
                This is the bottom banner - I want an app style menu here.
            </div>
        </div>
    );
}

export default Home;
