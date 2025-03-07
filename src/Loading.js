import React from "react";

const Loading = () => {
  return (
    <div
      className="modal-overlay"
      style={{
        display: "flex",
        alignItems: "center",
        background: "rgb(0 0 0 / 75%)",
      }}
    >
      <div className="modal">
        <div className="loading-dialog">
          <p>Loading...</p>
          <div className="spinner" style={{ marginLeft: "15%" }}></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;