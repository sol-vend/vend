import React from 'react';
import './SessionExpiredModal.css'; // Import the CSS file

const SessionExpiredModal = ({ onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Session Expired</h2>
        <p>Your session has expired. Please sign back in to continue.</p>
        <button onClick={onClose} className="close-button">
          Close
        </button>
        <p>
          <a
            href="#"
            onClick={() => {
              window.location.reload();
            }}
            className="link"
          >
            Click here to refresh and sign back in.
          </a>
        </p>
      </div>
    </div>
  );
};

export default SessionExpiredModal;
