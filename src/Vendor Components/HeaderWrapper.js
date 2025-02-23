import React, { useState, useRef, useEffect } from "react";
import { FaHome, FaQuestionCircle, FaDollarSign } from 'react-icons/fa';
import AppHome from "../Home/AppHome";

const HeaderWrapper = () => {
    const [isMenuActive, setIsMenuActive] = useState(false);
    const [route, setRoute] = useState(false);
    const menuRef = useRef(null);
    const optionsRef = useRef(null);
    const menuItems = {
        Home: { icon: <FaHome />, component: <AppHome /> },
        'How it works': { icon: <FaQuestionCircle /> },
        'VEND Token': { icon: <FaDollarSign /> },
    };

    const toggleOptions = () => {
        setIsMenuActive(!isMenuActive);
    };


    const handleClickOutside = (event) => {
        if (
            optionsRef.current &&
            !optionsRef.current.contains(event.target) &&
            menuRef.current &&
            !menuRef.current.contains(event.target)
        ) {
            setIsMenuActive(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);


    const handleMenuSelection = (key, index) => {
        if (menuItems[key] && menuItems[key].component) {
            window.location.reload();
        } else {
            console.log(`Menu item ${key} was clicked!`);
        }
    };

    if (route) {
        return route;
    } else {

        return (
            <div className='vendor-title-wrapper' style={{
                borderBottomColor: 'black',
                borderBottomStyle: 'groove',
                display: 'flex',
                justifyContent: 'center',
                height: '150px'
            }}>
                <div
                    onClick={toggleOptions}
                    className="menu-icon"
                    ref={menuRef}
                    style={{ color: isMenuActive ? 'black' : 'white' }}
                >
                    &#9776;
                </div>
                <div
                    style={{ position: 'relative', width: '100%', height: 'auto', overflow: 'hidden', display: 'contents' }}
                >
                    <div
                        style={{
                            zIndex: '5',
                            position: 'absolute',
                        }}
                    ><img
                        style={{
                            boxShadow: "#5c24b0 0px 0px 20px 5px",
                            borderRadius: "5px"
                        }}
                        width='150px'
                        src={`/Vend-Logo.png`}>
                        </img>
                    </div>
                    <div
                        style={{
                            zIndex: '0',
                            position: 'absolute',
                            width: "100%",
                            height: "150px",
                            background: "linear-gradient(#303f56, #384249, #161422, #191524, #0c0b11)",
                            boxShadow: "black 1px 1px 20px 7px"
                        }}>
                    </div>
                </div>
                <>
                    {isMenuActive && (
                        <div className="menu-active-wrapper" ref={optionsRef}>
                            <div className="menu-active-container">
                                {Object.keys(menuItems).map((key, index) => (
                                    <div
                                        className="menu-item"
                                        key={key}
                                        onClick={() => handleMenuSelection(key, index)}
                                    >
                                        <p>{key}</p>
                                        <span>{menuItems[key].icon}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            </div>
        );
    }
}

export default HeaderWrapper;