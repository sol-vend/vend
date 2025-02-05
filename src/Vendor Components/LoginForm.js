import React, { useState, useEffect } from 'react';
import PasswordToggle from './PasswordToggle';
import axios from 'axios';
import { API_URL } from '../Components/Shared';

const LoginForm = ({ setCreateAccount }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [clicked, setClicked] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    useEffect(() => {
        if (clicked) {
            setCreateAccount(true);
        }
    }, [clicked])

    const handleClick = () => {
        setClicked(!clicked);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!username || !password) {
            setError('Both fields are required.');
            return;
        }
        const postLoginData = async () => {
            try {
                const response = await axios.post(`${API_URL}/login`, {
                    emailAddress: username,
                    password: password
                });

                if (response.status >= 200 && response.status < 300) {
                    console.log('Login successful:', response.data);
                    if (response.data.success) {
                        const token = response.data.authToken;
                        localStorage.setItem('authToken', token);
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
        setError('');
    };
    return (
        <div
            className='vendor-form-styles'
            style={{ width: '60%' }}>
            <h2>Login</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
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
                                />
                                <div>
                                    <PasswordToggle parentSetPasswordVisibility={setPasswordVisible} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <button
                        type="submit"
                        className='vendor-submit-button-styles'
                    >
                        Submit
                    </button>
                </div>
            </form>
            <div>
            </div >
            <div style={{ display: 'flex' }}>
                <span>Don't have an account?

                    <p
                        onClick={handleClick}
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
};

export default LoginForm;
