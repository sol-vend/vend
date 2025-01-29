import React from 'react';

const SuccessfulSignup = () => {
  return (
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
  );
};

export default SuccessfulSignup;
