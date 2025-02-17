import React, { useState } from 'react';

const Carousel = ({ groups, currentGroupIndex, setCurrentGroupIndex }) => {
    const [startTouchX, setStartTouchX] = useState(0); // To track the initial touch position

    const handleNext = () => {
        setCurrentGroupIndex((prevIndex) => (prevIndex + 1) % groups.length);
    };

    const handlePrev = () => {
        setCurrentGroupIndex((prevIndex) => (prevIndex - 1 + groups.length) % groups.length);
    };

    // Handle the swipe start
    const handleTouchStart = (e) => {
        setStartTouchX(e.changedTouches[0].clientX); // Record the initial touch position
    };

    // Handle the swipe move
    const handleSwipe = (e) => {
        const endTouchX = e.changedTouches[0].clientX; // The end position of the touch

        // Determine swipe direction
        if (startTouchX > endTouchX) {
            handleNext(); // Swiped left (next group)
        } else if (startTouchX < endTouchX) {
            handlePrev(); // Swiped right (previous group)
        }
    };

    return (
        <div
            className="carousel"
            style={{
                width: '30vw',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                padding: '2px',
                borderRadius: '2px',
                touchAction: 'none', // Disable default touch behavior
            }}
            onTouchStart={handleTouchStart} // Start swipe
            onTouchEnd={handleSwipe} // End swipe
        >
            {/* Carousel Controls */}
            <div className="carousel-controls">
                <button onClick={handlePrev} disabled={currentGroupIndex === 0}>{"<"}</button>
                <button onClick={handleNext} disabled={currentGroupIndex === groups.length - 1}>{">"}</button>
            </div>

            {/* Group Content */}
            {groups.length > 0 && (
                <div
                    key={currentGroupIndex}
                    className="group"
                    style={{
                        border: "solid #dedede 1px",
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '2px',
                        borderRadius: '2px',
                    }}
                >
                    {/* Group Name */}
                    <div
                        className="vendor-input-group-styles"
                        style={{
                            width: '25vw',
                            background: "linear-gradient(45deg, #ffffff, transparent)",
                            border: "solid #ffffff 2px",
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Group Name"
                            className="vendor-input-field-styles"
                            value={groups[currentGroupIndex].groupName}
                            onChange={(e) =>
                                setCurrentGroupIndex(prevIndex => {
                                    const updatedGroups = [...groups];
                                    updatedGroups[prevIndex].groupName = e.target.value;
                                    return updatedGroups;
                                })
                            }
                        />
                    </div>

                    {/* Group Items */}
                    {groups[currentGroupIndex].items.map((item, itemIndex) => (
                        <div key={itemIndex} className="vendor-input-group-styles" style={{ width: "15vw" }}>
                            <input
                                className="vendor-input-field-styles"
                                type="text"
                                placeholder="Item Name"
                                value={item.name}
                                onChange={(e) => {
                                    const updatedGroups = [...groups];
                                    updatedGroups[currentGroupIndex].items[itemIndex].name = e.target.value;
                                    setCurrentGroupIndex(prevIndex => updatedGroups);
                                }}
                            />
                            <input
                                className="vendor-input-field-styles"
                                type="number"
                                placeholder="Price"
                                value={item.price}
                                onChange={(e) => {
                                    const updatedGroups = [...groups];
                                    updatedGroups[currentGroupIndex].items[itemIndex].price = e.target.value;
                                    setCurrentGroupIndex(prevIndex => updatedGroups);
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Carousel;
