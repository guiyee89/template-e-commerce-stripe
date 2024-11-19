import { useEffect } from "react";
import { useState } from "react";
import styled, { css } from "styled-components/macro";
import { db } from "../../../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export const FilterDetail = ({
  selectedItem,
  handleFilterItemChange,
  handleSizeLoading,
  handleColorLoading,
}) => {
  const [selectedFilters, setSelectedFilters] = useState({
    color: [],
    size: null,
  });
  const [relatedItems, setRelatedItems] = useState([]);
  const [filteredItem, setFilteredItem] = useState({});

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

    fetchRelatedItems();

    setSelectedFilters({
      color: selectedItem?.color,
      size: selectedItem.size,
    });
  }, [selectedItem]);

  const handleColorChange = (colorArray) => {
    setTimeout(() => {
      setSelectedFilters((prevFilters) => ({
        ...prevFilters,
        color: colorArray,
      }));
    }, 1200);
    handleColorLoading();
  };

  const handleSizeChange = (size) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      size: size,
    }));
    handleSizeLoading();
  };

  useEffect(() => {
    const { color, size } = selectedFilters;
    if (color && size) {
      let filterSelection = relatedItems.find(
        (item) =>
          JSON.stringify(item.color) === JSON.stringify(color) &&
          item.size === size
      );
      if (!filterSelection) {
        filterSelection = relatedItems.find(
          (item) => JSON.stringify(item.color) === JSON.stringify(color)
        );
        if (filterSelection) {
          setSelectedFilters((prevFilters) => ({
            ...prevFilters,
            size: filterSelection.size,
          }));
        }
      }
      handleFilterItemChange(filterSelection);
      setFilteredItem(filterSelection || {});
    }
  }, [selectedFilters, relatedItems, handleFilterItemChange]);

  const uniqueColors = Array.from(
    new Set(relatedItems.map((item) => JSON.stringify(item.color)))
  );

  const renderSizes = () => {
    const customStringSizes = ["xs", "s", "m", "l", "xl", "xxl"];
    const customNumberSizes = [3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5];

    if (typeof selectedItem.size === "string") {
      return customStringSizes;
    } else if (typeof selectedItem.size === "number") {
      return customNumberSizes;
    }
    return [];
  };

  const getAvailableSizesForColor = (colorArray) => {
    return Array.from(
      new Set(
        relatedItems
          .filter(
            (item) =>
              JSON.stringify(item.color) === JSON.stringify(colorArray) &&
              item.stock > 0
          )
          .map((item) => item.size)
      )
    );
  };
  const availableSizesForColor = selectedFilters.color
    ? getAvailableSizesForColor(selectedFilters.color)
    : [];

  return (
    <>
      <Wrapper>
        <ColorContainer>
          <ColorText>
            Color:{" "}
            {Object.keys(filteredItem).length > 0
              ? filteredItem.color.map((color, index) => (
                  <ColorSpan key={color} secondary={index > 0}>
                    {color}
                    {index < filteredItem.color.length - 1 && " - "}
                  </ColorSpan>
                ))
              : selectedItem.color.map((color, index) => (
                  <ColorSpan key={color} secondary={index > 0}>
                    {color}
                    {index < selectedItem.color.length - 1 && " - "}
                  </ColorSpan>
                ))}
          </ColorText>
          <ColorImagesContainer>
            {uniqueColors.map((colorString) => {
              //Identify color array as a whole if it has more than 1 color
              const colorArray = JSON.parse(colorString);
              const itemsWithCurrentColor = relatedItems.filter(
                (item) =>
                  JSON.stringify(item.color) === JSON.stringify(colorArray)
              );

              if (itemsWithCurrentColor.length > 0) {
                return (
                  <ColorCheckboxWrapper key={colorString}>
                    <ColorCheckbox
                      id={`color-${colorString}`}
                      checked={
                        JSON.stringify(selectedFilters.color) ===
                        JSON.stringify(colorArray)
                      }
                      onChange={() => handleColorChange(colorArray)}
                    />
                    <ColorImage
                      src={itemsWithCurrentColor[0].img[0]}
                      alt={colorArray.join(", ")}
                    />
                  </ColorCheckboxWrapper>
                );
              } else {
                return (
                  <ColorCheckboxWrapper key={colorString}>
                    <ColorCheckbox
                      id={`color-${colorString}`}
                      checked={
                        JSON.stringify(selectedFilters.color) ===
                        JSON.stringify(colorArray)
                      }
                      onChange={() => handleColorChange(colorArray)}
                    />
                    <ColorRepresentation color={colorArray[0]} />
                  </ColorCheckboxWrapper>
                );
              }
            })}
          </ColorImagesContainer>
        </ColorContainer>

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
                    checked={selectedFilters.size === size}
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
  margin: 24px auto;
  width: 100%;
  gap: 0.4rem;
  @media (max-width: 950px) {
    justify-content: center;
    gap: 0.2rem;
    margin: 0px auto 24px;
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
  height: 88px;
  outline: none;
  cursor: pointer;
  &:checked {
    border: 1px solid rgb(21 26 32 / 78%);
    border-radius: 6px;
  }
`;
const ColorImage = styled.img`
  width: 72px;
  height: 86px;
  object-fit: cover;
  position: absolute;
  right: 10px;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.65) 0px 0px 3.5;
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
  font-weight: ${({ secondary }) => (secondary ? "normal" : "bold")};
  ${({ secondary }) =>
    secondary &&
    css`
      color: #464545;
      font-size: 0.9rem;
    `}
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
  font-weight: 500;
  transition: color 0.1s;
  color: black;
  color: ${(props) => !props.isSizeAvailable && "darkgrey"};
  font-size: ${(props) => props.isSizeAvailable && "0.85rem"};
  ${SizeCheckbox}:checked + & {
    color: white;
    font-size: 0.87rem;
    font-weight: bold;
  }
`;
