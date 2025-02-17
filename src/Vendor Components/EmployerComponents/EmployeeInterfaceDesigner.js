import React, { useEffect, useState } from 'react';
import Phone from './Phone';
import { FaArrowLeft, FaArrowRight, FaTrash, FaPlusCircle } from 'react-icons/fa'; // Arrow icons
import ItemCarousel from './ItemCarousel';

const EmployeeInterfaceDesigner = () => {
    const [groups, setGroups] = useState([]);
    const [currentGroupIndex, setCurrentGroupIndex] = useState(0); // State to track which group is being shown
    const [startTouchX, setStartTouchX] = useState(0); // To track the initial touch position
    const [deletionSelectionItem, setDeletionSelectionItem] = useState({ groupIndex: null, itemIndex: null })

    const handleAddGroup = () => {
        setGroups([
            ...groups,
            {
                groupName: '',
                items: [{ name: '', price: '' }],
            },
        ]);
    };

    useEffect(() => {
        console.log(groups);
    }, [groups])

    const handleRemoveGroup = (groupIndex) => {
        const updatedGroups = groups.filter((_, index) => index !== groupIndex);
        setGroups(updatedGroups);
        if (currentGroupIndex >= updatedGroups.length) {
            setCurrentGroupIndex(updatedGroups.length - 1); // Ensure the index doesn't go out of bounds
        }
    };

    const handleAddItem = (groupIndex) => {
        const updatedGroups = [...groups];
        updatedGroups[groupIndex].items.push({ name: '', price: '' });
        setGroups(updatedGroups);
    };

    const handleRemoveItem = (groupIndex, itemIndex) => {
        const updatedGroups = [...groups];
        updatedGroups[groupIndex].items = updatedGroups[groupIndex].items.filter(
            (_, index) => index !== itemIndex
        );
        setGroups(updatedGroups);
    };

    const handleGroupChange = (groupIndex, field, value) => {
        const updatedGroups = [...groups];
        updatedGroups[groupIndex][field] = value;
        setGroups(updatedGroups);
    };

    const handleItemChange = (groupIndex, itemIndex, field, value) => {
        const updatedGroups = [...groups];
        updatedGroups[groupIndex].items[itemIndex][field] = value;
        setGroups(updatedGroups);
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
            goToNextGroup(); // Swiped left (next group)
        } else if (startTouchX < endTouchX) {
            goToPreviousGroup(); // Swiped right (previous group)
        }
    };

    // Go to the next group
    const goToNextGroup = () => {
        setCurrentGroupIndex((prevIndex) => (prevIndex + 1) % groups.length);
    };

    // Go to the previous group
    const goToPreviousGroup = () => {
        setCurrentGroupIndex((prevIndex) => (prevIndex - 1 + groups.length) % groups.length);
    };

    const handleDeletionSelection = (groupIndex, itemIndex) => {
        if (deletionSelectionItem.groupIndex === groupIndex && deletionSelectionItem.itemIndex === itemIndex) {
            setDeletionSelectionItem({ groupIndex: null, itemIndex: null });
        } else {
            setDeletionSelectionItem({ groupIndex: currentGroupIndex, itemIndex: itemIndex });
        }
    }

    return (

        <div className='frontend-designer-wrapper' style={{ display: 'flex' }}>
            <div>
                <div className='frontend-options-wrapper'>
                    <div>
                        <div className="carousel-controls header-carousel swipeable">
                            <button className="header-carousel-arrow header-carousel-left-arrow" onClick={goToPreviousGroup} disabled={currentGroupIndex === 0}>{<FaArrowLeft size={15} />}</button>
                            <h3>Groups</h3>
                            <button className="header-carousel-arrow header-carousel-right-arrow" onClick={goToNextGroup} disabled={currentGroupIndex === groups.length - 1}>{<FaArrowRight size={15} />}</button>
                        </div>
                        <div className='vendor-show-hide-styles' style={{marginBottom:'auto'}} onClick={handleAddGroup}><FaPlusCircle /></div>
                    </div>
                    {/* Carousel with swipe functionality */}
                    {groups.length > 0 && (
                        <div
                            key={currentGroupIndex}
                            className="group"
                            style={{
                                border: "solid #dedede 1px",
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
                            <div
                                className='vendor-input-group-styles'
                                style={{
                                    width: '25vw',
                                    background: "linear-gradient(45deg, #ffffff, transparent)",
                                    border: "solid #ffffff 2px",
                                    flexDirection: 'row'
                                }}
                            >
                                <input
                                    type="text"
                                    placeholder="Group Name"
                                    className='vendor-input-field-styles'
                                    value={groups[currentGroupIndex].groupName}
                                    onChange={(e) =>
                                        handleGroupChange(currentGroupIndex, 'groupName', e.target.value)
                                    }
                                />
                            </div>
                            <div className='vendor-show-hide-styles' onClick={() => handleRemoveGroup(currentGroupIndex)}><FaTrash/></div>
                        </div>
                    )}
                </div>
                {groups[currentGroupIndex] &&
                    groups[currentGroupIndex].items &&
                    groups[currentGroupIndex].items.length > 0 && (
                        <div 
                        className='frontend-options-wrapper'
                        >
                            <ItemCarousel
                                groups={groups}
                                currentGroupIndex={currentGroupIndex}
                                handleItemChange={handleItemChange}
                                handleAddItem={handleAddItem}
                            />
                        </div>
                    )
                }
            </div>
            <Phone>
                <div style={{ position: 'absolute', paddingTop: '10px', height: '100%', width: '100%' }}>
                    {groups.length > 0 &&
                        <div>
                            <div className='group-phone-header'>
                                <div>{groups[currentGroupIndex].groupName}</div>
                            </div>
                            <div style={{ display: 'flex' }}>
                                {groups[currentGroupIndex].items.map((item, itemIndex) =>
                                    <div>
                                        {item.name !== '' &&
                                            <div
                                                className='group-phone-display-button'
                                                style={{ display: 'flex', marginLeft: '2px', marginRight: '2px', cursor: 'pointer', width: '100%' }}
                                                onClick={() => handleDeletionSelection(currentGroupIndex, itemIndex)}
                                            ><p>{item.name}</p>
                                                {
                                                    deletionSelectionItem.groupIndex === currentGroupIndex && deletionSelectionItem.itemIndex === itemIndex ?
                                                        <p
                                                            className='append-existing-phone-button visible'
                                                            onClick={() => (handleItemChange(currentGroupIndex, itemIndex, 'name', ''), handleItemChange(currentGroupIndex, itemIndex, 'price', 0))}
                                                        >x</p>
                                                        :
                                                        <p
                                                            className='append-existing-phone-button'
                                                            onClick={() => (handleItemChange(currentGroupIndex, itemIndex, 'name', ''), handleItemChange(currentGroupIndex, itemIndex, 'price', 0))}
                                                        >x</p>
                                                }
                                            </div>
                                        }
                                    </div>
                                )}
                            </div>
                        </div>
                    }
                </div>
            </Phone>
        </div>
    );
};

export default EmployeeInterfaceDesigner;
