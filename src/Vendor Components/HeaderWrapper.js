import React from "react";

const HeaderWrapper = () => {
    return (
        <div className='vendor-title-wrapper' style={{
            borderBottomColor: 'black',
            borderBottomStyle: 'groove',
            display: 'flex',
            justifyContent: 'center',
            height: '150px'
        }}>
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
        </div>
    );
}

export default HeaderWrapper;