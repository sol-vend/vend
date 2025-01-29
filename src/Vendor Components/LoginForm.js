import React, { useState, useEffect } from 'react';

const LoginForm = ({ setCreateAccount }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        if (clicked) {
            setCreateAccount(true);
        }
    }, [clicked])

    const handleClick = () => {
        setClicked(!clicked);
    };

    const textButtonStyles = {
        cursor: 'pointer', // Makes it look like a clickable item
        color: '#007BFF', // Text color like a link/button
        fontSize: '16px',
        textDecoration: 'underline', // Underline to resemble a link
        transition: 'all 0.3s ease',
    };

    const hoverStyles = {
        color: '#0056b3', // Darker color on hover
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!username || !password) {
            setError('Both fields are required.');
            return;
        }

        setError('');
        // Handle form submission logic here (e.g., API call)
        console.log('Form submitted with', { username, password });
    };

    const formStyles = {
        maxWidth: '400px',
        margin: 'auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
    };

    const headingStyles = {
        textAlign: 'center',
    };

    const inputStyles = {
        width: '100%',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    };

    const buttonStyles = {
        width: '100%',
        padding: '10px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    };

    const buttonHoverStyles = {
        backgroundColor: '#45a049',
    };

    const errorStyles = {
        color: 'red',
        textAlign: 'center',
    };

    return (
        <div style={formStyles}>
            <h2 style={headingStyles}>Login</h2>
            {error && <p style={errorStyles}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        style={inputStyles}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        style={inputStyles}
                        required
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        style={buttonStyles}
                        onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyles.backgroundColor}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
                    >
                        Submit
                    </button>
                </div>
            </form>
            <div style={{
                width: '50%',
            }}>
            </div >
            <div style={{
                display: 'ruby',
            }}>
                <span>Don't have an account?

                    <p
                        style={{
                            ...textButtonStyles,
                            ...(clicked ? hoverStyles : {}),
                            marginLeft: '4px',
                        }}
                        onClick={handleClick}
                        onMouseEnter={(e) => e.target.style.color = '#0056b3'}  // Mouse hover effect
                        onMouseLeave={(e) => e.target.style.color = '#007BFF'}  // Mouse out effect
                    >
                        Sign Up
                    </p>

                </span>
            </div>
        </div>
    );
};

export default LoginForm;
