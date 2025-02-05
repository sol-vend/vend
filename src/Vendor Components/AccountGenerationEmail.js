import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactDOMServer from 'react-dom/server'; // Import the ReactDOMServer module
import { API_URL } from '../Components/Shared';
import LogoSvg from './LogoSvg';

const AccountGenerationEmail = ({ userEmailAddress, businessName }) => {
    const [accountCreationStatus, setAccountCreationStatus] = useState({ loading: true });
    const [isLoad, setIsLoad] = useState(true);

    const introductoryMessage = `
    Solana offers high-speed peer-to-peer payments through its innovative blockchain technology, 
    designed to handle thousands of transactions per second (TPS) with low transaction fees. 
    By utilizing a unique consensus mechanism called Proof of History, combined with Proof of Stake.
    At VEND, we've leveraged these payment rails to make it easy for you, the business owner, to reap
    the rewards without having to pay the overhead fees associated with other, more modern systems.  
    If you are familiar with the Solana blockchain, feel free to skip this.  If you aren't, no worries,
    we have designed this with you in mind. To get started, we would recommend that you stick with our default
    payment method - PYUSD.  This is a specific US Dollar backed stablecoin that has been issued by PayPal.
    Through PayPal's interface, this can easily be exchanged for dollars. 
    `;

    const emailConfirmationMessage = `Congratulations! Your account has been created!
    You can click the link below to continue to our Point of Sale Interface and finish setting up your account.  We have developed this with simplicity in mind and our hope is that you can personalize your interface.  
    At VEND, we want you to be able to be a part of this experience.  If you want to keep it basic, keep it basic, if you want to make it your own, by all means.  We are here to support you and we thank you for your interest in our product!`;

    const paragraphStyles = {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#525852',
        textAlign: 'center',
        padding: '20px',
        borderRadius: '4px',
        backgroundColor: '#f0f9f4',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '500px',
        margin: '0 auto',
        lineHeight: '1.5',
    };

    const createHTMLContent = () => {
        return ReactDOMServer.renderToStaticMarkup(
            <html>
                <body>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            maxWidth: '600px',
                            margin: 'auto',
                            padding: '40px',
                            borderRadius: '8px',
                            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                            backgroundColor: '#ffffff',
                            marginBottom: '20px',
                            marginTop: '20px'
                        }}
                    >
                        <div>
                            <div style={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                boxShadow: '1px 1px 20px 20px rgba(128, 0, 128, 0.06)', // Purple shadow with transparency
                                borderRadius: '5px',
                                outline: 'auto',
                                fontStyle: 'italic',
                            }}><LogoSvg />
                                <h3>Solana Payment Processing</h3>
                            </div>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginBlock: '10px',
                            padding: '10px',
                            border: 'solid #3af50012 .25px',
                            borderRadius: '2px',
                            boxShadow: '#8080800f 1px 1px 20px',
                            alignItems: 'center'
                        }}>
                            {
                                emailConfirmationMessage.split('\n').map((segment) =>
                                    <p style={paragraphStyles}>{segment}</p>
                                )
                            }
                            <a href='https://www.solvend.fun/#/vendor/#HASH_KEY'
                                style={{
                                    padding: '5px',
                                    textAlign: 'center',
                                    color: 'black',
                                    border: 'solid black 1px',
                                    borderRadius: '2px',
                                    background: 'white'
                                }}
                                id='confirmation-link'
                            >Continue to VEND</a>
                        </div>
                    </div>
                </body>
            </html>
        );
    };

    const handleSubmit = async (e) => {
        const htmlContent = createHTMLContent();
        const formData = {
            emailAddress: userEmailAddress,
            htmlContent: JSON.stringify(htmlContent),
        };
        console.log(formData);
        await axios.post(`${API_URL}/api/send_confirmation_email`, formData).then(response => {
            console.log(response);
            setAccountCreationStatus(response.data)
        })
            .catch(error => {
                if (error.response) {
                    try {
                        setAccountCreationStatus({ error: error.response.data.error });
                    } catch {
                        setAccountCreationStatus({ error: "An error occurred before account creation." });
                    }
                } else {
                    setAccountCreationStatus({ error: "An error occurred before account creation." });
                }
            })
    };
    if (isLoad) {
        handleSubmit();
        setIsLoad(false);
    }
    console.log(accountCreationStatus);
    return (
        <div>
            {accountCreationStatus.doContinue &&
                <div className="success-container">
                    <div className="success-message-box">
                        <h2 className="success-heading">Signup Successful!</h2>
                        <p className="success-message">
                            Congratulations! Your signup was successful.
                        </p>
                        <p className="success-message">
                            A verification email has been sent to your email address. Please check your inbox (and spam folder) for a link to verify your account and complete the registration process.
                        </p>
                        <p className="success-footer">Thank you for joining us!</p>
                    </div>
                </div>
            }
            {!accountCreationStatus.doContinue &&
                <div className='account-exists-container'>
                    <div className="account-exists-message">
                        <h2>Account Already Exists</h2>
                        <p>
                            It looks like an account with this email address already exists.
                            If you've forgotten your password, you can reset it.
                        </p>
                        <p>
                            <a href="/reset-password" className="reset-password-link">
                                Reset your password here.
                            </a>
                        </p>
                    </div>
                </div>
            }
            {accountCreationStatus.error &&
                <div className='server-error-container'>
                    <div className="server-error-message">
                        <h2>Oops! Something Went Wrong</h2>
                        <p>
                            {accountCreationStatus.error}
                        </p>
                        <p>
                            Please try again later. If the issue persists, contact support.
                        </p>
                    </div>
                </div>
            }
            {accountCreationStatus.loading &&
                <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="modal">
                        <div className="loading-dialog">
                            <p>Loading...</p>
                            <div className="spinner"></div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
};

export default AccountGenerationEmail;
