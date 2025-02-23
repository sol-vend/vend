import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './AppHome.css';

function TokenTicker({ tokens }) {
  const [isVisible, setIsVisible] = useState(false);
  const [shuffledTokens, setShuffledTokens] = useState([]);
  const tickerRef = useRef(null);
  const [currentText, setCurrentText] = useState('');
  const [textAnimationClass, setTextAnimationClass] = useState('');

  const emphasizedTexts = [
    'Literally any SPL token.',
    'Did we mention ALL solana tokens are accepted?',
    'Even this one.',
    'Pay with $TRUMP.',
    'Buy your bae dinner with Fartcoin.',
    'And that one.',
    'That one is money!',
    '$PNUT!!!',
    'The hat stays on!'
  ];

  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.current.disconnect(); // Stop observing after it's visible
          }
        });
      },
      { threshold: 1 }
    )
  );

  useEffect(() => {
    if (tickerRef.current) {
      observer.current.observe(tickerRef.current);
    }
    return () => {
      observer.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      const doubledTokens = [...tokens, ...tokens];
      const initialTokens = doubledTokens.sort(() => Math.random() - 0.5);
      setShuffledTokens(initialTokens);
    }
  }, [tokens, isVisible]);

  useEffect(() => {
    let intervalId;
    const animationDuration = 3; // Animation duration in seconds (must match CSS)

    if (isVisible) {
      const selectRandomText = () => {
        const randomIndex = Math.floor(Math.random() * emphasizedTexts.length);
        setCurrentText(emphasizedTexts[randomIndex]);
        setTextAnimationClass('fade-in-out');
        setTimeout(() => {
          setTextAnimationClass('');
        }, animationDuration * 1000);
      };

      selectRandomText();
      intervalId = setInterval(selectRandomText, animationDuration * 1000 * 3.33);
    }

    return () => clearInterval(intervalId);
  }, [isVisible]);

  const renderTokenImages = useMemo(() => {
    return shuffledTokens.slice(0, 60).map((token) => {
      if (!token.logoURI) {
        return null;
      }

      return (
        <img
          key={token.chainId + token.address}
          src={token.logoURI}
          alt={token.name}
          style={{
            width: '50px',
            height: '50px',
            margin: '0 50px',
            objectFit: 'contain',
          }}
        />
      );
    });
  }, [shuffledTokens]); // Only re-run when shuffledTokens changes

  return (
    <div
      className={isVisible ? `token-ticker-container visible` : 'token-ticker-container invisible'}
      ref={tickerRef}
      style={{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        padding: '20px 0',
      }}
    >
      <div
        className={`token-ticker ${isVisible ? 'token-ticker-animate' : ''}`}
        style={{
          display: 'inline-block',
          animationDuration: '70s',
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
        }}
      >
        {tokens.length > 0 ? renderTokenImages : <p></p>}
      </div>
      <div className={`emphasized-text ${textAnimationClass}`}>
        <p>{currentText}</p>
      </div>
    </div>
  );
}

export default TokenTicker;

