import React, { useEffect, useState } from 'react';
import Phone from './Phone';
import { FaArrowLeft, FaArrowRight, FaTrash, FaPlusCircle } from 'react-icons/fa'; // Arrow icons
import ItemCarousel from './ItemCarousel';
import SwipeIndicator from '../SwipeIndicator';

const EmployeeInterfaceDesigner = ({ isMobileDevice }) => {
    const [groups, setGroups] = useState([]);
    const [currentGroupIndex, setCurrentGroupIndex] = useState(0); // State to track which group is being shown
    const [startTouchX, setStartTouchX] = useState(0); // To track the initial touch position
    const [deletionSelectionItem, setDeletionSelectionItem] = useState({ groupIndex: null, itemIndex: null })
    const [selectedItemCallback, setSelectedItemCallback] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [deleteButtonTranslationStartPosition, setDeleteButtonTranslationStartPosition] = useState(0)
    const [deleteButtonTranslationPosition, setDeleteButtonTranslationPostition] = useState(0);
    const [deleteButtonOpacity, setDeleteButtonOpacity] = useState(0.5);

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
        setSelectedIndex(0);
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

    const handleDeletionSwipeTouchStart = (e) => {
        const touch = e.touches[0];
        setDeleteButtonTranslationStartPosition(touch.clientX);
        setDeleteButtonOpacity(1);
    }

    const handleDeletionSwipeTouchMove = (e) => {
        const maxTranslation = e.target.parentNode.offsetWidth;
        const touch = e.touches[0];
        const currentPosition = touch.clientX;
        if (currentPosition < deleteButtonTranslationStartPosition) {
            const movement = Math.abs(deleteButtonTranslationStartPosition - currentPosition);
            setDeleteButtonTranslationPostition(movement < maxTranslation ? movement : maxTranslation);
        }
    }

    const handleDeletionSwipeTouchEnd = (e, currentGroupIndex, itemIndex) => {
        const maxTranslation = e.target.parentNode.offsetWidth;
        if (deleteButtonTranslationPosition > (maxTranslation * 0.75)) {
            if (groups[currentGroupIndex].items.length > 1) {
                handleRemoveItem(currentGroupIndex, itemIndex);
            } else {
                handleItemChange(currentGroupIndex, itemIndex, 'name', '');
                handleItemChange(currentGroupIndex, itemIndex, 'price', '');
            }
        }
        setDeleteButtonTranslationPostition(0);
        setDeleteButtonOpacity(0.55);
    }

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
        setSelectedIndex(itemIndex);
    }

    return (

        <div className='frontend-designer-wrapper' style={{ display: 'flex' }}>
            <div>
                <div className='frontend-options-wrapper'>
                    <div>
                        <div className="carousel-controls header-carousel swipeable">
                            <button className="header-carousel-arrow header-carousel-left-arrow" onClick={goToPreviousGroup} disabled={currentGroupIndex === 0}>{<SwipeIndicator direction={'left'} numArrows={3} size={10} />}</button>
                            <h3>Groups</h3>
                            <button className="header-carousel-arrow header-carousel-right-arrow" onClick={goToNextGroup} disabled={currentGroupIndex === groups.length - 1}>{<SwipeIndicator direction={'right'} numArrows={3} size={10} />}</button>
                        </div>
                        <div className='vendor-show-hide-styles' style={{ marginBottom: 'auto' }} onClick={handleAddGroup}><FaPlusCircle /></div>
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
                            <div className='vendor-show-hide-styles' onClick={() => handleRemoveGroup(currentGroupIndex)}><FaTrash /></div>
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
                                selectedIndex={selectedIndex}
                                setSelectedIndex={setSelectedIndex}
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
                            <div className='group-phone-contents'
                            style={{height: `${document.querySelector('.phone-outline').offsetHeight - 40}px`}}
                            >
                                {groups[currentGroupIndex].items.map((item, itemIndex) =>
                                    <div>
                                        {item.name !== '' &&
                                            <div
                                                className={isMobileDevice ? 'group-phone-display-button' : 'group-phone-display-button'}
                                                style={{ display: 'flex', marginLeft: '2px', marginRight: '2px', cursor: 'pointer', width: '100%' }}
                                                onClick={() => (handleDeletionSelection(currentGroupIndex, itemIndex))}
                                            ><p>{item.name}</p>
                                                {
                                                    deletionSelectionItem.groupIndex === currentGroupIndex && deletionSelectionItem.itemIndex === itemIndex ?
                                                        <p
                                                            className={isMobileDevice ? 'append-existing-phone-button visible mobile' : 'append-existing-phone-button visible'}
                                                            style={{ transform: `translateX(${-1 * deleteButtonTranslationPosition}px)`, opacity: deleteButtonOpacity, left: `${15 + (4.5 * item.name.length)}px` }}
                                                            onClick={() => !isMobileDevice ? (handleItemChange(currentGroupIndex, itemIndex, 'name', ''), handleItemChange(currentGroupIndex, itemIndex, 'price', 0)) : () => { return null }}
                                                            onTouchStart={handleDeletionSwipeTouchStart}
                                                            onTouchMove={handleDeletionSwipeTouchMove}
                                                            onTouchEnd={(e) => handleDeletionSwipeTouchEnd(e, currentGroupIndex, itemIndex)}
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
