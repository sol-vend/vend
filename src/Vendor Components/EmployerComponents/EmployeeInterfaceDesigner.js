import React, { useEffect, useState, useCallback } from "react";
import debounce from "lodash.debounce";
import Phone from "./Phone";
import { FaTrash, FaPlusCircle } from "react-icons/fa"; // Arrow icons
import ItemCarousel from "./ItemCarousel";
import SwipeIndicator from "../SwipeIndicator";
import SnapSlider from "./SnapSlider";
import { retrieveExistingData, updateExistingData } from "../Shared";
import './EmployeeInterfaceDesigner.css'

const EmployeeInterfaceDesigner = ({}) => {
  const debounceWaitTime = 5000;
  const [groups, setGroups] = useState([
    {
      groupName: "",
      items: [{ name: "", price: "" }],
    },
  ]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0); // State to track which group is being shown
  const [startTouchX, setStartTouchX] = useState(0); // To track the initial touch position
  const [deletionSelectionItem, setDeletionSelectionItem] = useState({
    groupIndex: null,
    itemIndex: null,
  });
  const [isMobileDevice, setIsMobileDevice] = useState(
    window.innerWidth <= 768
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [
    deleteButtonTranslationStartPosition,
    setDeleteButtonTranslationStartPosition,
  ] = useState(0);
  const [deleteButtonTranslationPosition, setDeleteButtonTranslationPostition] =
    useState(0);
  const [deleteButtonOpacity, setDeleteButtonOpacity] = useState(0.5);
  const [groupNames, setGroupNames] = useState([]);
  const [isGroupClicked, setIsGroupClicked] = useState(false);
  const [isStartup, setIsStartup] = useState(true);
  const [error, setError] = useState(false);

  // useCallback for updateDatabaseWithGroups
  const updateDatabaseWithGroups = useCallback(
    debounce(async (prefs) => {
      try {
        const data = {
          interfaceSetup: prefs,
        };
        const response = await updateExistingData(data);
        console.log("Database update response:", response);
        if (response && response.status === 500) {
          setError(true);
          console.error("Error updating database."); //Check here for loading
        }
      } catch (updateError) {
        setError(true);
        console.error("Error updating database:", updateError);
      }
    }, debounceWaitTime),
    [updateExistingData]
  );

  useEffect(() => {
    // Load interface preferences from the database on startup
    const getCurrentGroups = async () => {
      try {
        const interfaceSetup = ["interfaceSetup"];
        const currentGroups = await retrieveExistingData(interfaceSetup);
        console.log("Retrieved data:", currentGroups);

        if (currentGroups.response?.interfaceSetup) {
          //Safely update to prevent "undefined"
          setGroups(currentGroups.response.interfaceSetup);
        } else if (currentGroups.status === 500) {
          setError(true);
          console.error("Error retrieving data.");
        }
      } catch (getDataError) {
        setError(true);
        console.error("Error retrieving data:", getDataError);
      }
    };

    getCurrentGroups();
    setIsStartup(false); // Set isStartup to false after the initial data load
  }, []);

  // Use Effect that updates when it changes
  useEffect(() => {
    if (!isStartup) {
      updateDatabaseWithGroups(groups);
    }
  }, [groups, updateDatabaseWithGroups, isStartup]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobileDevice(true);
      } else {
        setIsMobileDevice(false);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleAddGroup = (e) => {
    e.preventDefault();
    setGroups([
      ...groups,
      {
        groupName: "",
        items: [{ name: "", price: "" }],
      },
    ]);
  };

  const handleTextboxClicked = () => {
    setIsGroupClicked(true);
  };

  useEffect(() => {
    try {
      setGroupNames(groups.map((group) => group.groupName));
    } catch (error) {
      setError(true);
    }
  }, [groups]);

  const handleRemoveGroup = (groupIndex) => {
    const updatedGroups = groups.filter((_, index) => index !== groupIndex);
    setGroups(updatedGroups);
    if (currentGroupIndex >= updatedGroups.length) {
      setCurrentGroupIndex(updatedGroups.length - 1); // Ensure the index doesn't go out of bounds
    }
  };

  const handleAddItem = (groupIndex) => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex].items.push({ name: "", price: "" });
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
  };

  const handleDeletionSwipeTouchMove = (e) => {
    const maxTranslation = e.target.parentNode.offsetWidth;
    const touch = e.touches[0];
    const currentPosition = touch.clientX;
    if (currentPosition < deleteButtonTranslationStartPosition) {
      const movement = Math.abs(
        deleteButtonTranslationStartPosition - currentPosition
      );
      setDeleteButtonTranslationPostition(
        movement < maxTranslation ? movement : maxTranslation
      );
    }
  };

  const handleDeletionSwipeTouchEnd = (e, currentGroupIndex, itemIndex) => {
    const maxTranslation = e.target.parentNode.offsetWidth;
    if (deleteButtonTranslationPosition > maxTranslation * 0.75) {
      if (groups[currentGroupIndex].items.length > 1) {
        handleRemoveItem(currentGroupIndex, itemIndex);
      } else {
        handleItemChange(currentGroupIndex, itemIndex, "name", "");
        handleItemChange(currentGroupIndex, itemIndex, "price", "");
      }
    }
    setDeleteButtonTranslationPostition(0);
    setDeleteButtonOpacity(0.55);
  };

  // Go to the next group
  const goToNextGroup = () => {
    setCurrentGroupIndex((prevIndex) => (prevIndex + 1) % groups.length);
  };

  // Go to the previous group
  const goToPreviousGroup = () => {
    setCurrentGroupIndex(
      (prevIndex) => (prevIndex - 1 + groups.length) % groups.length
    );
  };

  const handleDeletionSelection = (groupIndex, itemIndex) => {
    if (
      deletionSelectionItem.groupIndex === groupIndex &&
      deletionSelectionItem.itemIndex === itemIndex
    ) {
      setDeletionSelectionItem({ groupIndex: null, itemIndex: null });
    } else {
      setDeletionSelectionItem({
        groupIndex: currentGroupIndex,
        itemIndex: itemIndex,
      });
    }
    setSelectedIndex(itemIndex);
  };

  if (error) {
    console.log(error);
  } else {
    return (
      <div className="frontend-designer-wrapper" style={{ display: "flex" }}>
        <div className="employee-interface-wrapper">
          <div className="frontend-options-wrapper-two">
            <div className="fow-wrapper">
              <div className="carousel-controls header-carousel swipeable">
                {true && (
                  <button
                    className="header-carousel-arrow header-carousel-left-arrow"
                    onClick={goToPreviousGroup}
                    disabled={currentGroupIndex === 0}
                  >
                    {
                      <SwipeIndicator
                        direction={"left"}
                        numArrows={3}
                        size={10}
                        minIndex={currentGroupIndex === 0}
                      />
                    }
                  </button>
                )}
                {!isMobileDevice && groups[currentGroupIndex] && (
                  <h3>
                    {groups[currentGroupIndex].groupName.length > 0
                      ? groups[currentGroupIndex].groupName
                      : "Page"}
                  </h3>
                )}
                {isMobileDevice && (
                  <h3
                    style={{
                      height: "100%",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    <SnapSlider
                      selectedIndex={currentGroupIndex}
                      items={groupNames}
                      setSelectedIndex={setCurrentGroupIndex}
                    />
                  </h3>
                )}
                {true && (
                  <button
                    className="header-carousel-arrow header-carousel-right-arrow"
                    onClick={goToNextGroup}
                  >
                    {
                      <SwipeIndicator
                        direction={"right"}
                        numArrows={3}
                        size={10}
                        maxIndex={currentGroupIndex === groups.length - 1}
                      />
                    }
                  </button>
                )}
              </div>
            </div>

            {groups.length > 0 && (
              <div
                key={currentGroupIndex}
                className="group"
                style={{
                  border: "solid #dedede 1px",
                  width: "30vw",
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  padding: "2px",
                  borderRadius: "2px",
                  touchAction: "none", // Disable default touch behavior
                }}
                onTouchStart={handleTouchStart} // Start swipe
                onTouchEnd={handleSwipe} // End swipe
              >
                <div
                  className="vendor-show-hide-styles"
                  style={{ marginBottom: "auto" }}
                  onClick={handleAddGroup}
                >
                  <FaPlusCircle />
                </div>
                <div
                  className="vendor-input-group-styles"
                  style={{
                    background: "linear-gradient(45deg, #ffffff, transparent)",
                    border: "solid #ffffff 2px",
                    flexDirection: "row",
                  }}
                >
                  <input
                    id="group-input-textbox"
                    type="text"
                    placeholder="Set your page title"
                    className="vendor-input-field-styles"
                    value={groups[currentGroupIndex].groupName}
                    onClick={handleTextboxClicked}
                    onChange={(e) =>
                      handleGroupChange(
                        currentGroupIndex,
                        "groupName",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div
                  className="vendor-show-hide-styles"
                  onClick={() => handleRemoveGroup(currentGroupIndex)}
                >
                  <FaTrash />
                </div>
              </div>
            )}
          </div>
          {groups[currentGroupIndex] &&
            groups[currentGroupIndex].items &&
            groups[currentGroupIndex].items.length >= 0 && (
              <div className="frontend-options-wrapper-two">
                <ItemCarousel
                  groups={groups}
                  currentGroupIndex={currentGroupIndex}
                  handleItemChange={handleItemChange}
                  handleAddItem={handleAddItem}
                  selectedIndex={selectedIndex}
                  setSelectedIndex={setSelectedIndex}
                />
              </div>
            )}
        </div>
        {console.log(isMobileDevice)}
        <Phone marginBottom={isMobileDevice ? 0 : 0}>
          <div
            style={{
              position: "absolute",
              paddingTop: "10px",
              height: "100%",
              width: "100%",
            }}
          >
            {groups.length > 0 && (
              <div>
                <div className="group-phone-header">
                  <div>{groups[currentGroupIndex].groupName}</div>
                </div>
                <div
                  className="group-phone-contents"
                  style={{
                    height: `${
                      document.querySelector(".phone-outline").offsetHeight - 60
                    }px`,
                  }}
                >
                  {groups[currentGroupIndex].items.map((item, itemIndex) => (
                    <div>
                      {item.name !== "" && (
                        <div
                          className={
                            deletionSelectionItem.groupIndex ===
                              currentGroupIndex &&
                            deletionSelectionItem.itemIndex === itemIndex
                              ? isMobileDevice
                                ? "group-phone-display-button active"
                                : "group-phone-display-button active"
                              : "group-phone-display-button"
                          }
                          style={{
                            display: "flex",
                            marginLeft: "2px",
                            marginRight: "2px",
                            cursor: "pointer",
                            width: "100%",
                          }}
                          onClick={() =>
                            handleDeletionSelection(
                              currentGroupIndex,
                              itemIndex
                            )
                          }
                        >
                          <p>{item.name}</p>
                          {deletionSelectionItem.groupIndex ===
                            currentGroupIndex &&
                          deletionSelectionItem.itemIndex === itemIndex ? (
                            <p
                              className={
                                isMobileDevice
                                  ? "append-existing-phone-button visible mobile"
                                  : "append-existing-phone-button visible"
                              }
                              style={{
                                transform: `translateX(${
                                  -1 * deleteButtonTranslationPosition
                                }px)`,
                                opacity: deleteButtonOpacity,
                                left: `${15 + 4.5 * item.name.length}px`,
                              }}
                              onTouchStart={handleDeletionSwipeTouchStart}
                              onTouchMove={handleDeletionSwipeTouchMove}
                              onTouchEnd={(e) =>
                                handleDeletionSwipeTouchEnd(
                                  e,
                                  currentGroupIndex,
                                  itemIndex
                                )
                              }
                            >
                              <FaTrash />
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Phone>
      </div>
    );
  }
};

export default EmployeeInterfaceDesigner;
