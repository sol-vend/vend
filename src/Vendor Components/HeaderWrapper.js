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
                    src={`/vend/Vend Logo.png?v=${Date.now()}`}>
                    </img>
                </div>
                <div
                    style={{
                        zIndex: '-1',
                        position: 'absolute',
                        width: "100%",
                        height: "150px",
                        background: "linear-gradient(#303f56, #384249, #161422, #191524, #0c0b11)"
                    }}></div>
            </div>
        </div>
    );
}

export default HeaderWrapper;