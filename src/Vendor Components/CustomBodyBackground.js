import React from 'react';

export const CustomBodyBackground = () => {
    return (
        <div
            className='vendor-body-background'
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="50%" y2="100%">
                        <stop offset="0%" style={{ stopColor: 'rgba(250, 250, 250, 0.95)', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: 'rgba(245, 255, 245, 0.9)', stopOpacity: 1 }} />
                    </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grad1)" />

                <g fill="white" opacity="0.85">
                    <circle cx="50" cy="30" r="8" />
                    <line x1="50" y1="30" x2="50" y2="10" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="0.5" opacity="0.4" />
                    <line x1="50" y1="30" x2="60" y2="10" stroke="rgba(245, 245, 245, 0.9)" strokeWidth="0.5" opacity="0.4" />
                    <line x1="50" y1="30" x2="70" y2="20" stroke="rgba(235, 235, 235, 0.85)" strokeWidth="0.5" opacity="0.4" />
                    <line x1="50" y1="30" x2="70" y2="40" stroke="rgba(245, 245, 245, 0.9)" strokeWidth="0.5" opacity="0.4" />
                    <line x1="50" y1="30" x2="60" y2="50" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="0.5" opacity="0.4" />
                    <line x1="50" y1="30" x2="40" y2="50" stroke="rgba(245, 245, 245, 0.9)" strokeWidth="0.5" opacity="0.4" />
                    <line x1="50" y1="30" x2="30" y2="40" stroke="rgba(235, 235, 235, 0.85)" strokeWidth="0.5" opacity="0.4" />
                    <line x1="50" y1="30" x2="30" y2="20" stroke="rgba(245, 245, 245, 0.9)" strokeWidth="0.5" opacity="0.4" />
                    <line x1="50" y1="30" x2="40" y2="10" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="0.5" opacity="0.4" />
                </g>

                <g fill="white" opacity="0.75">
                    <circle cx="20" cy="70" r="7" />
                    <line x1="20" y1="70" x2="20" y2="50" stroke="rgba(245, 245, 245, 0.85)" strokeWidth="0.5" opacity="0.4" />
                    <line x1="20" y1="70" x2="30" y2="50" stroke="rgba(235, 235, 235, 0.85)" strokeWidth="0.5" opacity="0.4" />
                    <line x1="20" y1="70" x2="40" y2="60" stroke="rgba(255, 255, 255, 0.85)" strokeWidth="0.5" opacity="0.4" />
                    <line x1="20" y1="70" x2="40" y2="80" stroke="rgba(245, 245, 245, 0.85)" strokeWidth="0.5" opacity="0.4" />
                    <line x1="20" y1="70" x2="30" y2="90" stroke="rgba(235, 235, 235, 0.8)" strokeWidth="0.5" opacity="0.4" />
                    <line x1="20" y1="70" x2="10" y2="90" stroke="rgba(255, 255, 255, 0.85)" strokeWidth="0.5" opacity="0.4" />
                    <line x1="20" y1="70" x2="10" y2="80" stroke="rgba(245, 245, 245, 0.85)" strokeWidth="0.5" opacity="0.4" />
                </g>

                <g fill="white" opacity="0.65">
                    <circle cx="80" cy="80" r="9" />
                    <line x1="80" y1="80" x2="80" y2="60" stroke="rgba(245, 245, 245, 0.75)" strokeWidth="0.5" opacity="0.4" />
                    <line x1="80" y1="80" x2="90" y2="60" stroke="rgba(235, 235, 235, 0.75)" strokeWidth="0.5" opacity="0.4" />
                    <line x1="80" y1="80" x2="100" y2="70" stroke="rgba(245, 245, 245, 0.75)" strokeWidth="0.5" opacity="0.4" />
                    <line x1="80" y1="80" x2="100" y2="90" stroke="rgba(235, 235, 235, 0.75)" strokeWidth="0.5" opacity="0.4" />
                    <line x1="80" y1="80" x2="90" y2="100" stroke="rgba(245, 245, 245, 0.75)" strokeWidth="0.5" opacity="0.4" />
                    <line x1="80" y1="80" x2="70" y2="100" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.5" opacity="0.4" />
                    <line x1="80" y1="80" x2="70" y2="90" stroke="rgba(245, 245, 245, 0.75)" strokeWidth="0.5" opacity="0.4" />
                </g>

                <path d="M 10,80 Q 50,60 90,10" stroke="#d1d1d1" opacity="0.05" strokeWidth="1" fill="transparent" />
                <path d="M 0,50 C 25,60 45,50 70, 40" stroke="#e4e4e4" opacity="0.05" strokeWidth="1" fill="transparent" />
                <path d="M 30,10 C 50,25 75,10 100,30" stroke="#d1d1d1" opacity="0.05" strokeWidth="1" fill="transparent" />
                <path d="M 20,20 C 40,40 60,20 80,30" stroke="#e4e4e4" opacity="0.05" strokeWidth="1" fill="transparent" />
                <path d="M 15,60 C 45,65 65,50 85,70" stroke="#d1d1d1" opacity="0.065" strokeWidth="1" fill="transparent" />
                <path d="M 5,90 C 30,80 50,90 70,75" stroke="#e4e4e4" opacity="0.05" strokeWidth="1" fill="transparent" />
                <path d="M 40,0 Q 50,50 0,90" stroke="#d1d1d1" opacity="0.1" strokeWidth="1" fill="transparent" />
            </svg>
        </div>
    );
};
