import React, { useState, useEffect, useRef } from 'react';

export const Home = () => {
    const [userDetails, setUserDetails] = useState(
        {
            isSet: false,
            name: '',
            hasWritePermissions: false,
            primaryWalletAddress: '',
            tipWalletAddress: '',
        });

    useEffect(() => {
        if (!userDetails.isSet){
            
        }
    }, [])

    return (
        <div>

        </div>
    )
}

export default Home;