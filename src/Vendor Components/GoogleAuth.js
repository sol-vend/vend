import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleAuth = () => {
  const handleSuccess = (response) => {
    console.log('Login Success:', response);
  };

  const handleFailure = (error) => {
    console.log('Login Failed:', error);
  };

  return (
    <div>
      <GoogleLogin 
        onSuccess={handleSuccess}
        onError={handleFailure}
      />
    </div>
  );
};

export default GoogleAuth;
