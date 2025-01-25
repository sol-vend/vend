import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './vendorComponentsStyles.css'
import './TutorialModal.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import { getBytesCodec } from '@solana/codecs';
import { Buffer } from 'buffer';
window.Buffer = Buffer;


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
