import React, { useState, useEffect } from 'react';
import CustomCheckbox from '../CustomCheckbox';
import axios from 'axios'
import PasswordToggle from '../PasswordToggle';
import { API_URL } from '../../Components/Shared';
import Tooltip from '../Tooltip';
import SolanaLogoSvg from '../SolanaLogoSvg';
import Home from '../EmployerComponents/Home';
import ManualSignUp from '../ManualSignUp';

export const EmployeeLogin = () => {
    const [userDetails, setUserDetails] = useState(
        {
            isSet: false,
            businessName: '',
            employerEmail: '',
            name: '',
            hasWritePermissions: false,
            primaryWalletAddress: '',
            tipWalletAddress: '',
            interfaceDetails: {}
        });

    const [username, setUsername] = useState('');
    const [pin, setPin] = useState('');
    const [password, setPassword] = useState('')
    const [businessName, setBusinessName] = useState('');
    const [error, setError] = useState('');
    const [resetClicked, setResetClicked] = useState(false);
    const [pinVisible, setPinVisible] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isEmployerLogin, setIsEmployerLogin] = useState(false);
    const [employeePinReset, setEmployeePinReset] = useState(false);
    const [employerPasswordReset, setEmployerPasswordReset] = useState(false);
    const [isLoginSuccess, setIsLoginSuccess] = useState(false);
    const [isSignupClick, setIsSignupClick] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (resetClicked) {
            if (isEmployerLogin) {
                setEmployerPasswordReset(true);
            } else {
                setEmployeePinReset(true);
            }
        }
    }, [resetClicked])

    const handleResetClick = () => {
        setResetClicked(!resetClicked);
    };

    const handleSignupClick = () => {
        setIsSignupClick(true);
    }

    const handlePinChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setPin(value);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        if (!isEmployerLogin) {
            if (!username || !pin) {
                setError('Both fields are required.');
                return;
            }
        }
        const postLoginData = async () => {
            try {
                const route = isEmployerLogin ? 'login' : 'employee_login';
                const postObject = isEmployerLogin ? { emailAddress: username, password: password } : {
                    businessName: businessName,
                    username: username,
                    pin: pin
                };
                console.log(route, postObject);
                const response = await axios.post(`${API_URL}/api/${route}`, postObject);
                if (response.status >= 200 && response.status < 300) {
                    if (response.data.authToken) {
                        const token = response.data.authToken;
                        localStorage.setItem('authToken', token);
                        setIsLoginSuccess(true);
                    } else {
                        console.log('Login failed:', response.data.message);
                    }
                } else {
                    console.error('Unexpected status code:', response.status);
                }
            } catch (error) {
                console.error('Error during login:', error.response ? error.response.data : error.message);
            }
        };
        setLoading(false);
        setError('');
        postLoginData();
    };
    if (loading) {
        return (
            <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', background: "rgb(0 0 0 / 75%)" }}>
                <div className="modal">
                    <div className="loading-dialog">
                        <p>Loading...</p>
                        <div className="spinner" style={{ marginLeft: '15%' }}></div>
                    </div>
                </div>
            </div>
        )
    }
    else if (isLoginSuccess) {
        if (isEmployerLogin) {
            return (
                <Home />
            )
        } else {
            return (
                <div>
                    Employee Point of Sale
                </div>
            )
        }
    } else if (isSignupClick) {
        return (
            <ManualSignUp />
        )
    } else if (resetClicked) {
        if (isEmployerLogin) {
            return (
                <div>
                    Password Reset Protocol
                </div>
            )
        } else {
            return (
                <div>
                    Pin Reset Protocol
                </div>
            )
        }
    }
    else {
        return (
            <div>
                {loading &&
                    <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', background: "rgb(0 0 0 / 75%)" }}>
                        <div className="modal">
                            <div className="loading-dialog">
                                <p>Loading...</p>
                                <div className="spinner" style={{ marginLeft: '15%' }}></div>
                            </div>
                        </div>
                    </div>
                }
                <div
                    className='vendor-form-styles'
                    style={isEmployerLogin ? { width: '60%' } : { width: '60%', background: 'linear-gradient(45deg, #a1b2dab0, transparent)' }}>
                    <div className='vendor-form-header-wrapper'>
                        <h2 style={{ textAlign: 'center' }}>Business Login</h2>
                        <p>Powered by <SolanaLogoSvg /></p>
                    </div>
                    {error && <p>{error}</p>}
                    <form onSubmit={handleSubmit}>
                        {!isEmployerLogin &&
                            <div>
                                <div className='vendor-input-group-styles'>
                                    <label htmlFor="username">Business ID:</label>
                                    <input
                                        className='vendor-input-field-styles'
                                        type="text"
                                        id="businessName"
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)}
                                        placeholder="Enter your business ID"
                                        required
                                    />
                                    <p className='custom-checkbox-wrapper-paragraph-descriptor'>
                                        This is usually the business name but should have been provided by your employer.
                                    </p>
                                </div>
                                <div className='vendor-input-group-styles'>
                                    <label htmlFor="username">Username:</label>
                                    <input
                                        className='vendor-input-field-styles'
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter your username"
                                        required
                                    />
                                </div>
                                < div className='vendor-input-group-styles'>
                                    <div>
                                        <label>Pin:</label>
                                        <div
                                            className='vendor-password-container-styles'
                                        >
                                            <div
                                                className='password-control-visibility-wrapper'
                                            >
                                                <input
                                                    type={pinVisible ? 'text' : 'password'}
                                                    inputMode='numeric'
                                                    pattern='[0-9]*'
                                                    id="pin"
                                                    value={pin}
                                                    onChange={(e) => handlePinChange(e)}
                                                    placeholder="Enter your pin"
                                                    className='password-input-field-styles'
                                                    required
                                                />
                                                <div>
                                                    <PasswordToggle parentSetPasswordVisibility={setPinVisible} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        {isEmployerLogin &&
                            <div>
                                <div className='vendor-input-group-styles'>
                                    <label htmlFor="username">Email Address:</label>
                                    <input
                                        className='vendor-input-field-styles'
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter your username"
                                        required
                                    />
                                </div>
                                <div className='vendor-input-group-styles'>
                                    <div>
                                        <label>Password:</label>
                                        <div
                                            className='vendor-password-container-styles'
                                        >
                                            <div
                                                className='password-control-visibility-wrapper'
                                            >
                                                <input
                                                    type={passwordVisible ? 'text' : 'password'}
                                                    id="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="Enter your password"
                                                    className='password-input-field-styles'
                                                    required
                                                />
                                                <div>
                                                    <PasswordToggle parentSetPasswordVisibility={setPasswordVisible} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        <div>
                            <Tooltip
                                message={!isEmployerLogin ? "Business owner looking for the management portal?" : "Switch back to employee portal."}
                                styles={{ left: '50%' }}
                            >
                                <CustomCheckbox
                                    label={!isEmployerLogin ? { title: "User Login", description: "Point of Sale Portal for Employees" } : { title: "Employer Login", description: "Manage Your Account" }}
                                    checked={isEmployerLogin}
                                    onChange={setIsEmployerLogin}
                                    name={'isEmployerLogin'}
                                />
                            </Tooltip>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className='vendor-submit-button-styles'
                            >
                                Submit
                            </button>
                        </div>
                    </form >
                    <div>
                    </div >
                    {!isEmployerLogin &&
                        <div style={{ display: 'flex' }}>
                            <span>Forget your pin? No problem. We can set you up with a new one with a quick email to your employer.
                                <p
                                    onClick={handleResetClick}
                                    onMouseEnter={(e) => e.target.style.color = '#0056b3'}  // Mouse hover effect
                                    onMouseLeave={(e) => e.target.style.color = '#007BFF'}  // Mouse out effect
                                    style={{ cursor: 'pointer', color: "#007BFF" }}
                                >
                                    Reset your pin.
                                </p>
                            </span>
                        </div>
                    }
                    {isEmployerLogin &&
                        <div style={{ display: 'flex' }}>
                            <span>Forget your password?
                                <p
                                    onClick={handleResetClick}
                                    onMouseEnter={(e) => e.target.style.color = '#0056b3'}  // Mouse hover effect
                                    onMouseLeave={(e) => e.target.style.color = '#007BFF'}  // Mouse out effect
                                    style={{ cursor: 'pointer', color: "#007BFF" }}
                                >
                                    Reset it here.
                                </p>
                            </span>
                        </div>
                    }
                </div >
                <div className='login-create-account-wrapper'>
                    <span className='login-create-account-wrapper'>Don't have an account?
                        <p
                            onClick={handleSignupClick}
                            onMouseEnter={(e) => e.target.style.color = '#0056b3'}  // Mouse hover effect
                            onMouseLeave={(e) => e.target.style.color = '#007BFF'}  // Mouse out effect
                            style={{ cursor: 'pointer', color: "#007BFF" }}
                        >
                            Sign Up
                        </p>
                    </span>
                </div>
            </div>
        );
    }
}

export default EmployeeLogin;