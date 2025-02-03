import React, { useEffect, useState, useRef } from 'react';
import LoginForm from './LoginForm';
import ManualSignUp from './ManualSignUp';
import { VENDOR_BANNER_IMG } from '../Components/Shared';

const VendorApp = () => {
    document.body.classList.add('vendor');
    const [createAccount, setCreateAccount] = useState(false);

    useEffect(() => {
        console.log(createAccount);
    }, [createAccount])

    return (
        <div className='vendor-interface'>
            <div className='vendor-title-wrapper' style={{
                borderBottomColor: 'black',
                borderBottomStyle: 'groove',
                display: 'flex',
                justifyContent: 'center',
                maxHeight: '120px'
            }}>
                <img src={`/vend/solvendlogo-banner.jpg?v=${Date.now()}`}></img>
            </div>

            {!createAccount && (
                <div className='vendor-login-wrapper' style={{
                    marginTop: '5vw'
                }}>
                    <div>
                        <div className='vendor-login-inputs'>
                            <LoginForm setCreateAccount={setCreateAccount} />
                        </div>
                    </div>
                </div>
            )}

            {createAccount && (
                <ManualSignUp />
            )}

        </div>
    )
}

export default VendorApp;