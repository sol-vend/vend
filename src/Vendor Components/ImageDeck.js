import React from "react";

const ImageDeck = ({ imagePaths }) => {
  return (
    <div>
      {imagePaths.map((path) => (
        <img src={path} className="image-deck-image"></img>
      ))}
    </div>
  );
};

export default ImageDeck;
