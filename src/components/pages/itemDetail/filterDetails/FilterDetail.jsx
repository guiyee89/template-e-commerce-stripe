import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components/macro";
import { db } from "../../../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export const FilterDetail = ({
  selectedItem,
  handleFilterItemChange,
  handleSizeLoading,
  handleColorLoading,
}) => {
  /////////////     /////////////      ////////////       ////////////      ////////////      /////////////      /////////////     ////////////
  const [selectedFilters, setSelectedFilters] = useState({
    color: null,
    size: null,
  });
  const [relatedItems, setRelatedItems] = useState([]); //Items related to the selectedItem prop
  const [filteredItem, setFilteredItem] = useState({});

  /////////////     /////////////      ////////////       ////////////      ////////////      /////////////      /////////////     ////////////
  //                         FETCH ITEMS RELATED TO "selectedItem" BY productId PROPERTY             (Firestore database)              //

  useEffect(() => {
    const fetchRelatedItems = () => {
      console.log("Fetching related items from Firestore...");
      const productId = selectedItem.productId;
      const relatedItemsQuery = query(
        collection(db, "products"),
        where("productId", "==", productId)
      );
      getDocs(relatedItemsQuery)
        .then((snapshot) => {
          const relatedItems = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setRelatedItems(relatedItems);
        })
        .catch((error) => {
          console.error("Error fetching related items:", error);
        });
    };
    // Fetch related items only once when the component mounts
    fetchRelatedItems();
    // Set the color and size checkboxes according to the selectedItem at first rendering
    setSelectedFilters({
      color: selectedItem.color,
      size: selectedItem.size,
    });
  }, [selectedItem]);

  /////////////     /////////////      ////////////       ////////////      ////////////      /////////////      /////////////     ////////////
  //                                      HANDLING OF COLOR AND SIZE SELECTION ON-CHANGE  +  LOADERS                                         //

  // Function to handle color filter selection change
  const handleColorChange = (color) => {
    setTimeout(() => {
      setSelectedFilters((prevFilters) => ({
        ...prevFilters,
        color: color,
      }));
    }, 1200);
    handleColorLoading();
  };
  // Function to handle size filter selection change
  const handleSizeChange = (size) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      size: size,
    }));
    handleSizeLoading();
  };

  // Function to handle size and color filter selection change
  useEffect(() => {
    const { color, size } = selectedFilters;
    if (color && size) {
      let filterSelection = relatedItems.find(
        (item) => item.color === color && item.size === size
      );
      if (!filterSelection) {
        // If no item matches the selected combination of color and size, find the first item that has color and size properties
        filterSelection = relatedItems.find(
          (item) => item.color === color && item.size
        );
        // Set an available selectedFilters "size" when selecting a new "color" in case filteredItem doesn't have current "size"
        if (filterSelection) {
          filterSelection = relatedItems.find((item) => item.color === color);
          setSelectedFilters((prevFilters) => ({
            ...prevFilters,
            size: filterSelection.size,
          }));
        }
      }
      handleFilterItemChange(filterSelection); //responible to set new item by color or sizes and render it
      setFilteredItem(filterSelection || {});
    }
  }, [selectedFilters, relatedItems, handleFilterItemChange]);

  /////////////     /////////////      ////////////       ////////////      ////////////      /////////////      /////////////     ////////////
  //                                            LOGIC FOR COLOR & SIZE RENDERING                                                             //
  //Create map for properties existing "color"
  const uniqueColors = Array.from(
    new Set(relatedItems.map((item) => item.color))
  );

  //Render custom "size" for clothing or map existing "size" for shoes
  const renderSizes = () => {
    const customStringSizes = ["xs", "s", "m", "l", "xl", "xxl"];
    const customNumberSizes = [39, 40, 41, 42, 43, 44, 45];

    if (typeof selectedItem.size === "string") {
      // If selectedItem.size is a string, render customStringSizes
      return customStringSizes;
    } else if (typeof selectedItem.size === "number") {
      // If selectedItem.size is a number, render customNumberSizes
      return customNumberSizes;
    }
    return [];
  };

  //Manipulate "size" enabling/disabling by selecting a "color" checking which sizes are available
  const getAvailableSizesForColor = (color) => {
    return Array.from(
      new Set(
        relatedItems
          .filter((item) => item.color === color && item.stock > 0)
          .map((item) => item.size)
      )
    );
  };
  const availableSizesForColor = selectedFilters.color
    ? getAvailableSizesForColor(selectedFilters.color)
    : [];

  /////////////     /////////////      ////////////       ////////////      ////////////      /////////////      /////////////     ////////////
  //                                                   RENDERING                                                                             //
  return (
    <>
      <Wrapper>
        {/* Color filter */}
        <ColorContainer>
          <ColorText>
            Color:{" "}
            <ColorSpan>
              {Object.keys(filteredItem).length > 0
                ? filteredItem.color
                : selectedItem.color}
            </ColorSpan>
          </ColorText>
          <ColorImagesContainer>
            {uniqueColors.map((color) => {
              const itemsWithCurrentColor = relatedItems.filter(
                (item) => item.color === color
              );

              if (itemsWithCurrentColor.length > 0) {
                return (
                  <ColorCheckboxWrapper key={color}>
                    <ColorCheckbox
                      id={`color-${color}`}
                      checked={selectedFilters.color === color}
                      onChange={() => handleColorChange(color)}
                    />
                    <ColorImage
                      src={itemsWithCurrentColor[0].img[0]}
                      alt={color}
                    />
                  </ColorCheckboxWrapper>
                );
              } else {
                return (
                  <ColorCheckboxWrapper key={color}>
                    <ColorCheckbox
                      id={`color-${color}`}
                      checked={selectedFilters.color === color}
                      onChange={() => handleColorChange(color)}
                    />
                    {/* Placeholder representation when there are no related items with the current color */}
                    <ColorRepresentation color={color} />
                  </ColorCheckboxWrapper>
                );
              }
            })}
          </ColorImagesContainer>
        </ColorContainer>

        {/* Size filter */}
        <SizeContainer>
          <SizeText>
            Size:{" "}
            <SizeSpan>
              {Object.keys(filteredItem).length > 0
                ? filteredItem.size
                : selectedItem.size}
            </SizeSpan>
          </SizeText>
          <SizeImagesContainer>
            {renderSizes().map((size) => {
              const isSizeAvailable =
                !selectedFilters.color || availableSizesForColor.includes(size);
              return (
                <SizeCheckboxWrapper key={size}>
                  <SizeCheckbox
                    id={`size-${size}`}
                    checked={selectedFilters.size === size}
                    onChange={() => handleSizeChange(size)}
                    disabled={!isSizeAvailable}
                    isSizeAvailable={isSizeAvailable}
                  />
                  <SizeCheckboxLabel
                    htmlFor={`size-${size}`}
                    checked={SizeCheckboxLabel && "white"}
                    isSizeAvailable={isSizeAvailable}
                  >
                    {size}
                  </SizeCheckboxLabel>
                </SizeCheckboxWrapper>
              );
            })}
          </SizeImagesContainer>
        </SizeContainer>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  @media (max-width: 950px) {
    align-items: flex-start;
    width: 100%;
  }
`;

const ColorContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  margin-bottom: 16px;
  width: 100%;
  gap: 0.4rem;
  @media (max-width: 950px) {
    justify-content: center;
    gap: 0.2rem;
  }
`;
const ColorImagesContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
const SizeImagesContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
const ColorCheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  position: relative;
  margin-right: -5px;
`;

const ColorCheckbox = styled.input.attrs({ type: "checkbox" })`
  margin-right: 8px;
  appearance: none;
  width: 76px;
  height: 80px;
  outline: none;
  cursor: pointer;
  &:checked {
    border: 1px solid rgb(21 26 32 / 78%);
    border-radius: 12px;
  }
`;
const ColorImage = styled.img`
  width: 72px;
  height: 76px;
  object-fit: cover;
  position: absolute;
  right: 10px;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.65) 0px 0px 3.5px;
`;
const ColorRepresentation = styled.div``;

const SizeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 0.4rem;
  @media (max-width: 950px) {
    gap: 0.2rem;
  }
`;
const ColorText = styled.p`
  text-transform: capitalize;
  font-weight: 500;
`;
const ColorSpan = styled.span`
  font-weight: bold;
`;

const SizeText = styled.p`
  text-transform: capitalize;
  font-weight: 500;
`;
const SizeSpan = styled.span`
  font-weight: bold;
  text-transform: uppercase;
`;

const SizeCheckboxWrapper = styled.div`
  margin-right: 8px;
  position: relative;
`;

const SizeCheckbox = styled.input.attrs({ type: "checkbox" })`
  margin-right: 8px;
  appearance: none;
  width: 36px;
  height: 41px;
  border: ${(props) =>
    props.isSizeAvailable ? "1.9px solid grey" : "1.9px solid lightgrey"};
  border-radius: 40%;
  outline: none;
  cursor: pointer;
  &:checked {
    background-color: #b55604;
    border: 2px solid rgb(181, 86, 4);
  }
`;
const SizeCheckboxLabel = styled.label`
  cursor: pointer;
  position: absolute;
  top: 45.6%;
  left: 41.4%;
  font-size: 0.8rem;
  transform: translate(-50%, -50%);
  text-transform: uppercase;
  font-weight: bold;
  transition: color 0.1s;
  color: black;
  color: ${(props) => !props.isSizeAvailable && "lightgray"};
  font-size: ${(props) => props.isSizeAvailable && "0.87rem"};
  ${SizeCheckbox}:checked + & {
    color: white;
    font-size: 0.87rem;
  }
`;
