import React, { useEffect, useState, useRef } from 'react';
import LoginForm from './LoginForm';
import ManualSignUp from './ManualSignUp';

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
                borderBottomStyle: 'groove'
            }}>
                <h2>
                    Vend
                </h2>
                <p>Solana Payment Platform (probably need a logo here somewhere)</p>
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