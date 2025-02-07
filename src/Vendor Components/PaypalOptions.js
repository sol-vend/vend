import React, { useState, useEffect } from 'react';

const PaypalOptions = ({ parentSetWalletAddress }) => {
    const [walletAddressDatas, setWalletAddressDatas] = useState({
        walletAddress: "",
        isAddressValid: false
    });

    const handleWalletAddressChange = (e) => {
        const address = e.target.value;
        const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
        setWalletAddressDatas({
            walletAddress: address,
            isAddressValid: solanaAddressRegex.test(address)
        })
    };

    const pasteWalletInput = async () => {
        try {
            const address = await navigator.clipboard.readText();
            const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
            setWalletAddressDatas({
                walletAddress: address,
                isAddressValid: solanaAddressRegex.test(address)
            })
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
        }
    }

    const clearWalletInput = () => {
        setWalletAddressDatas({
            walletAddress: "",
            isAddressValid: false
        })
    }

    useEffect(() => {
        if (walletAddressDatas.isAddressValid) {
            parentSetWalletAddress(walletAddressDatas.walletAddress);
        } else {
            parentSetWalletAddress(false);
        }
    }, [walletAddressDatas.isAddressValid, walletAddressDatas.walletAddress])

    return (
        <div>
            <div className='vendor-input-field-styles'>
                <label htmlFor="walletAddress" style={{ display: 'block', fontWeight: 'bold', marginTop: '15px' }}>
                    Wallet Address:
                </label>
                <div className="vendor-wallet-address-paste-wrapper">
                    <input
                        id="walletAddress"
                        type="text"
                        name="walletAddress"
                        value={walletAddressDatas.walletAddress}
                        onChange={handleWalletAddressChange}
                        placeholder="Paste Solana Wallet Address"
                        style={{
                            width: '100%',
                            fontSize: '16px',
                            borderRadius: '4px',
                            borderColor: '#ffffff00',
                            outline: 'none'
                        }}
                    />
                    <button
                        className={walletAddressDatas.walletAddress.length ? "tutorial-exit-button" : "vendor-wallet-address-paste-button"}
                        onClick={walletAddressDatas.walletAddress.length ? clearWalletInput : pasteWalletInput}  // Call the function when the button is clicked
                        style={walletAddressDatas.walletAddress.length ? { position: 'inherit' } : { height: 'min-content' }}
                    >
                        {walletAddressDatas.walletAddress.length ?
                            "x" :
                            <svg fill="#000000" width="22px" height="22px" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                                <title>Paste Wallet Address</title>
                                <path d="M30,12H26v2h4v2h2V14A2,2,0,0,0,30,12Z" className="clr-i-solid clr-i-solid-path-1"></path>
                                <rect x="30" y="18" width="2" height="6" className="clr-i-solid clr-i-solid-path-2"></rect>
                                <path d="M30,30H28v2h2a2,2,0,0,0,2-2V26H30Z" className="clr-i-solid clr-i-solid-path-3"></path>
                                <rect x="4" y="4" width="20" height="20" rx="2" ry="2" className="clr-i-solid clr-i-solid-path-4"></rect>
                                <rect x="20" y="30" width="6" height="2" className="clr-i-solid clr-i-solid-path-5"></rect>
                                <path d="M14,26H12v4a2,2,0,0,0,2,2h4V30H14Z" className="clr-i-solid clr-i-solid-path-6"></path>
                                <rect x="0" y="0" width="36" height="36" style={{fillOpacity: "0"}} />
                            </svg>
                        }
                    </button>
                </div>
                {!walletAddressDatas.isAddressValid && walletAddressDatas.walletAddress && (
                    <p style={{ color: 'red', fontSize: '14px', marginTop: '8px' }}>
                        Invalid wallet address. Please <strong>paste</strong> your address.
                    </p>
                )}
                <p style={{ fontSize: '12px', color: '#f00', marginTop: '10px' }}>
                    <strong>Warning:</strong> Be sure this wallet address is correct.
                    Transactions on the blockchain are <strong>irreversible</strong>.
                </p>
            </div>
        </div>
    );
};

export default PaypalOptions;
