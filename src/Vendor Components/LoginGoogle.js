import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT, GOOGLE_SECRET } from '../Components/auth';
import GoogleAuth from './GoogleAuth';

const LoginGoogle = () => {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT}>
            <><GoogleAuth /></>
        </GoogleOAuthProvider>
    );
};

export default LoginGoogle;