import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";
import SwipeIndicator from "../SwipeIndicator";
import SnapSlider from "./SnapSlider";

const ItemCarousel = ({
  groups,
  currentGroupIndex,
  handleItemChange,
  handleAddItem,
  selectedIndex,
  setSelectedIndex,
}) => {
  const [transformValue, setTransformValue] = useState(0); // For scroll translation
  const [isMobile, setIsMobile] = useState(false); // Check if the device is mobile
  const defaultGap = 50; // Gap between items in the carousel (adjust this based on desired gap)
  const items = groups[currentGroupIndex].items;
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust based on screen width
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile); // Cleanup
  }, []);

  const handleNext = () => {
    setSelectedIndex((prevIndex) => Math.min(prevIndex + 1, items.length - 1));
  };

  const handlePrev = () => {
    setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const newItemHandler = (currentGroupIndex, selectedIndex) => {
    handleAddItem(currentGroupIndex);
    setSelectedIndex(selectedIndex + 1);
    setTransformValue(-1 * defaultGap);
  };

  return (
    <>
      <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ width: "100%" }}>
          <div
            className="item-carousel-wrapper"
            style={{ width: "100%", position: "relative" }}
          >
            <div
              className="item-carousel-items-wrapper"
              style={{ display: "flex", height: "100%", width: "100%" }}
            >
              <div className="carousel-controls header-carousel swipeable">
                <>
                  <button
                    className="header-carousel-arrow header-carousel-left-arrow"
                    onClick={handlePrev}
                  >
                    <SwipeIndicator
                      direction={"left"}
                      numArrows={3}
                      size={10}
                      minIndex={selectedIndex === 0}
                    />
                  </button>
                  {isMobile && (
                    <SnapSlider
                      items={items}
                      selectedIndex={selectedIndex}
                      setSelectedIndex={setSelectedIndex}
                      itemWidth={50}
                      gap={20}
                      objectHeight={50}
                    />
                  )}
                  {!isMobile && (
                    <div>
                      {items[selectedIndex].name === ""
                        ? "New Item"
                        : items[selectedIndex].name}
                    </div>
                  )}
                  <button
                    className="header-carousel-arrow header-carousel-right-arrow"
                    onClick={handleNext}
                  >
                    <SwipeIndicator
                      direction={"right"}
                      numArrows={3}
                      size={10}
                      maxIndex={selectedIndex === items.length - 1}
                    />
                  </button>
                </>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ width: "100%", height: "100%" }}>
        <div>
          {groups[currentGroupIndex].items.map((item, itemIndex) => {
            const isSelected = itemIndex === selectedIndex;
            return (
              <div key={itemIndex} style={{}}>
                <div
                  className="vendor-input-group-styles"
                  style={{
                    display: isSelected ? 'flex' : 'none',
                  }}
                >
                  <input
                    className="vendor-input-field-styles"
                    style={{ width: "90%" }}
                    type="text"
                    disabled={!isSelected}
                    placeholder="Add your items!"
                    value={item.name}
                    onChange={(e) =>
                      handleItemChange(
                        currentGroupIndex,
                        itemIndex,
                        "name",
                        e.target.value
                      )
                    }
                  />
                  <input
                    className="vendor-input-field-styles"
                    style={{ width: "90%" }}
                    type="number"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) =>
                      handleItemChange(
                        currentGroupIndex,
                        itemIndex,
                        "price",
                        e.target.value
                      )
                    }
                  />
                  <div
                    className="vendor-show-hide-styles"
                    onClick={
                      isSelected
                        ? () => newItemHandler(currentGroupIndex, selectedIndex)
                        : () => {
                            return null;
                          }
                    }
                  >
                    <FaCheck />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ItemCarousel;
