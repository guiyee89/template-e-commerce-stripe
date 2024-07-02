import { useContext, useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { useParams } from "react-router-dom";
import { DesktopFilter } from "./desktopFilters/DesktopFilter";
import { GlobalToolsContext } from "../../../context/GlobalToolsContext";
import { MobileFilter } from "./mobileFilters/MobileFilter";
import styled from "styled-components/macro";

export const FilterContainer = ({
  items,
  allItems,
  onFilterChange,
  setCurrentPage,
  setItemLoader,
  filteredItems,
  isFilterOpen,
  toggleFilterMenu,
}) => {
  
  const { windowWidth } = useContext(GlobalToolsContext);

  //////////           ////////////           ////////////           ///////////           ///////////
  //                       STATE FOR DIFFERENT FILTERS                        //
  const [detailsFilters, setDetailsFilters] = useState({
    category: "",
    size: "",
    color: "",
    orderBy: "",
  });

  const getRelatedItems = (items) => {
    // Assuming related items are stored in a variable or fetched from a database
    return allItems.filter((relatedItem) =>
      items.some(
        (item) =>
          item.productId === relatedItem.productId && relatedItem.stock > 0
      )
    );
  };
  // Fetch related items based on filteredItems
  const relatedItems = getRelatedItems(filteredItems);

  //////////           ////////////           ////////////           ///////////           ///////////
  //      MAPING COLORS, SIZE, CATEGORIES AND QUANTITY FOR EACH FILTER        //

  //----------        SIZE MAPING       ----------//

  // Calculate available sizes from filteredItems and related items
  const availableSizes = Array.from(
    new Set([...filteredItems, ...relatedItems].map((item) => item.size))
  ).filter((size) => size !== undefined);

  // Get all sizes to determine which ones should be disabled
  const allSizes = Array.from(
    new Set(allItems.map((item) => item.size))
  ).filter((size) => size !== undefined);

  // Sizes to disable
  const disabledSizes = allSizes.filter(
    (size) => !availableSizes.includes(size)
  );

  const [selectedSizeOrder, setSelectedSizeOrder] = useState([]);

  const handleSizeSelect = (selectedSize) => {
    // Check if the size is already in the selectedSizeOrder array
    const isSizeSelected = selectedSizeOrder.includes(selectedSize);

    if (!isSizeSelected) {
      // If the size is not selected, add it to the front of the array
      const newOrder = [selectedSize, ...selectedSizeOrder];
      setSelectedSizeOrder(newOrder);
    } else {
      // If the size is already selected, remove it from the order
      const newOrder = selectedSizeOrder.filter(
        (size) => size !== selectedSize
      );
      setSelectedSizeOrder(newOrder);
    }
  };

  //----------       COLOR MAPING      ----------//

  // Define a mapping of color names to CSS color values
  const colorMapping = {
    Black: "#000000",
    White: "#ffffff",
    Grey: "#8e8e8e",
    "Light Blue": "#269be4",
    Blue: "#2626e4",
    Navy: "#04046e",
    Purple: "#dc10ce",
    Pink: "#ea7baf",
    Red: "#e81a1a",
    Orange: "#f49d2c",
    Yellow: "#e6d21a",
    "Light Green": "#67dd4d",
    Green: "#24df13",
    Brown: "#682f21",
  };
  //function to find first color
  // const getFirstColorWord = (color) => {
  //   const words = color.split(" ");
  //   console.log(words);
  //   return words[0];
  // };

  const isFilteringByColor =
    detailsFilters.color && detailsFilters.color.length > 0;

  // Determine available colors based on the filter criteria
  const availableColors = Array.from(
    new Set(
      (isFilteringByColor ? allItems : filteredItems).flatMap(
        (item) => item.color
      )
    )
  ).filter((color) => color !== undefined);

  // Determine all colors across all items
  const allColors = Array.from(
    new Set(allItems.flatMap((item) => item.color))
  ).filter((color) => color !== undefined);

  // Colors to disable only when not filtering by color
  const disabledColors = isFilteringByColor
    ? []
    : allColors.filter((color) => !availableColors.includes(color));

  const [selectedColorOrder, setSelectedColorOrder] = useState([]);

  const handleColorSelect = (selectedColor) => {
    // Check if the size is already in the selectedSizeOrder array
    const isColorSelected = selectedColorOrder.includes(selectedColor);

    if (!isColorSelected) {
      // If the size is not selected, add it to the front of the array
      const newOrder = [selectedColor, ...selectedColorOrder];
      setSelectedColorOrder(newOrder);
    } else {
      // If the size is already selected, remove it from the order
      const newOrder = selectedColorOrder.filter(
        (color) => color !== selectedColor
      );
      setSelectedColorOrder(newOrder);
    }
  };

  //----------       CATEGORY MAPING      ---------//
  const availableCategory = Array.from(
    new Set(items.map((item) => item.category))
  ).filter((category) => category !== undefined);

  const [selectedCategoryOrder, setSelectedCategoryOrder] = useState([]);

  const handleCategorySelect = (selectedCategory) => {
    const isCategorySelected = selectedCategoryOrder.includes(selectedCategory);

    if (!isCategorySelected) {
      const newOrder = [selectedCategory, ...selectedCategoryOrder];
      setSelectedCategoryOrder(newOrder);
    } else {
      const newOrder = selectedCategoryOrder.filter(
        (category) => category !== selectedCategory
      );
      setSelectedCategoryOrder(newOrder);
    }
  };

  // Helper function to determine if a size is numeric
  const isNumericSize = (size) => !isNaN(size);

  // Determine if there is any selected size and if it's numeric or string
  const selectedSizeType =
    selectedSizeOrder.length > 0
      ? isNumericSize(selectedSizeOrder[0])
        ? "numeric"
        : "string"
      : null;

  // Function to determine if a category should be disabled
  const isCategoryDisabled = (category) => {
    if (!selectedSizeType) return false; // No size selected, no categories disabled
    const categorySizes = allItems
      .filter((item) => item.category === category)
      .map((item) => item.size);

    return selectedSizeType === "numeric"
      ? categorySizes.some((size) => isNaN(size))
      : categorySizes.some((size) => !isNaN(size));
  };

  // Clear selected sizes order and get back to available sizes
  const clearOrderedFilters = () => {
    setSelectedSizeOrder([]);
    setSelectedCategoryOrder([]);
    setSelectedColorOrder([]);
  };

  //////////           ////////////           ////////////           ///////////           ///////////
  //                                FILTERING LOGIC FOR allItems                                  //

  const { categoryName } = useParams();

  // Fetch items from Firestore Database and filter accordingly on selection
  const fetchFilteredItems = async () => {
    console.log("fetching DesktopFilter...");
    try {
      const filteredCollection = collection(db, "products");
      let queryFilters = [];
      if (categoryName) {
        queryFilters.push(where("category", "==", categoryName));
      }
      if (detailsFilters.category.length > 0) {
        queryFilters.push(where("category", "in", detailsFilters.category));
      }
      if (detailsFilters.size.length > 0) {
        queryFilters.push(where("size", "in", detailsFilters.size));
      }

      const filteredQuery = query(filteredCollection, ...queryFilters);
      const querySnapshot = await getDocs(filteredQuery);

      // Use a Set to track unique productId-color combinations
      const uniqueItems = new Set();
      const filteredItems = querySnapshot.docs.reduce((filtered, doc) => {
        const item = doc.data();
        const key = `${item.productId}-${item.color}`;

        if (!uniqueItems.has(key) && item.stock > 0) {
          uniqueItems.add(key);
          // Check if any color filter matches with any word in the item's color
          if (
            detailsFilters.color.length === 0 ||
            detailsFilters.color.some((colorFilter) =>
              item.color.includes(colorFilter)
            )
          ) {
            filtered.push({
              id: doc.id,
              ...item,
            });
          }
        }
        return filtered;
      }, []);

      let orderedItems = [...filteredItems];

      // Apply the ordering logic
      if (detailsFilters.orderBy === "discount") {
        orderedItems = orderedItems.filter((item) => item.discount !== null);
      } else if (detailsFilters.orderBy === "lowPrice") {
        orderedItems.sort((a, b) => {
          const priceA =
            a.discountPrice !== "" && a.discountPrice !== null
              ? a.discountPrice
              : a.unit_price;
          const priceB =
            b.discountPrice !== "" && b.discountPrice !== null
              ? b.discountPrice
              : b.unit_price;
          return priceA - priceB;
        });
      } else if (detailsFilters.orderBy === "highPrice") {
        orderedItems.sort((a, b) => {
          const priceA =
            a.discountPrice !== "" && a.discountPrice !== null
              ? a.discountPrice
              : a.unit_price;
          const priceB =
            b.discountPrice !== "" && b.discountPrice !== null
              ? b.discountPrice
              : b.unit_price;
          return priceB - priceA;
        });
      }
      onFilterChange(orderedItems, detailsFilters, setItemLoader(false));
    } catch (error) {
      console.error("Error fetching filtered items:", error);
    }
  };

  //ORDER BY - filtering logic according if filtered items or original items are being rendered
  useEffect(() => {
    setTimeout(() => {
      if (
        detailsFilters.category.length === 0 &&
        detailsFilters.size.length === 0 &&
        detailsFilters.color.length === 0
      ) {
        // If no filters are applied, order the original items by the selected ordering option
        let orderedItems = [...items];
        if (detailsFilters.orderBy === "discount") {
          orderedItems = orderedItems.filter((item) => item.discount !== null);
        } else if (detailsFilters.orderBy === "lowPrice") {
          orderedItems.sort((a, b) => {
            const priceA =
              a.discountPrice !== "" && a.discountPrice !== null
                ? a.discountPrice
                : a.unit_price;
            const priceB =
              b.discountPrice !== "" && b.discountPrice !== null
                ? b.discountPrice
                : b.unit_price;
            return priceA - priceB;
          });
        } else if (detailsFilters.orderBy === "highPrice") {
          orderedItems.sort((a, b) => {
            const priceA =
              a.discountPrice !== "" && a.discountPrice !== null
                ? a.discountPrice
                : a.unit_price;
            const priceB =
              b.discountPrice !== "" && b.discountPrice !== null
                ? b.discountPrice
                : b.unit_price;
            return priceB - priceA;
          });
        }
        onFilterChange(orderedItems, detailsFilters, setItemLoader(false));
      } else {
        // If filters are applied, fetch and order filtered items
        fetchFilteredItems();
      }
    }, 300);
  }, [detailsFilters]);

  //////////           ////////////           ////////////           ///////////           ///////////
  //                    HANDLE FILTERED ITEMS & PASS VALUE TO ItemListContainer                    //

  //Handle each filter change and pass the values
  const handleDetailsFilterChange = (filterName, value) => {
    setTimeout(() => {
      setDetailsFilters((prevFilters) => ({
        ...prevFilters,
        [filterName]: value,
      }));
      setCurrentPage(1); //Set pagiination to 1 if filters changed
    }, 550);
    setItemLoader(true); //Activate Loader for filters
  };

  const updateFilterArray = (array, value, add) => {
    // Helper function to update filter array
    if (add) {
      return [...array, value];
    }
    return array.filter((item) => item !== value);
  };

  //////////           ////////////           ////////////           ///////////           ///////////
  //           LOADER            //
  const loadingReset = false;

  const handleResetFilters = () => {
    setItemLoader(true); //Activate Loader for filters
  };

  //////////           ////////////           ////////////           ///////////           ///////////
  //                                MANAGING FILTERS BY localStorage                               //
  // Load selected filters from localStorage when the component mounts
  useEffect(() => {
    const storedFilters = localStorage.getItem("selectedFilters");
    const storedSizeOrder = localStorage.getItem("selectedSizeOrder");
    const storedCategoryOrder = localStorage.getItem("selectedCategoryOrder");
    const storedColorOrder = localStorage.getItem("selectedColorOrder");
    if (storedFilters) {
      setDetailsFilters(JSON.parse(storedFilters));
    }
    if (storedSizeOrder) {
      setSelectedSizeOrder(JSON.parse(storedSizeOrder));
    }
    if (storedCategoryOrder) {
      setSelectedCategoryOrder(JSON.parse(storedCategoryOrder));
    }
    if (storedColorOrder) {
      setSelectedColorOrder(JSON.parse(storedColorOrder));
    }
  }, []);

  // Update localStorage when the detailsFilters state changes
  useEffect(() => {
    // Check if detailsFilters object has at least one property set
    if (Object.values(detailsFilters).some((value) => value !== "")) {
      localStorage.setItem("selectedFilters", JSON.stringify(detailsFilters));
      localStorage.setItem(
        "selectedSizeOrder",
        JSON.stringify(selectedSizeOrder)
      );
      localStorage.setItem(
        "selectedCategoryOrder",
        JSON.stringify(selectedCategoryOrder)
      );
      localStorage.setItem(
        "selectedColorOrder",
        JSON.stringify(selectedColorOrder)
      );
    }
  }, [
    detailsFilters,
    selectedSizeOrder,
    selectedCategoryOrder,
    selectedColorOrder,
  ]);

  //////////           ////////////           ////////////           ///////////           ///////////
  return (
    <>
      {windowWidth > 900 ? (
        <DesktopFilterWrapper scrolled={scroll}>
          <DesktopFilter
            loadingReset={loadingReset}
            detailsFilters={detailsFilters}
            setDetailsFilters={setDetailsFilters}
            handleResetFilters={handleResetFilters}
            clearOrderedFilters={clearOrderedFilters}
            handleDetailsFilterChange={handleDetailsFilterChange}
            selectedCategoryOrder={selectedCategoryOrder}
            handleCategorySelect={handleCategorySelect}
            availableCategory={availableCategory}
            isCategoryDisabled={isCategoryDisabled}
            selectedSizeOrder={selectedSizeOrder}
            handleSizeSelect={handleSizeSelect}
            availableSizes={availableSizes}
            disabledSizes={disabledSizes}
            selectedColorOrder={selectedColorOrder}
            handleColorSelect={handleColorSelect}
            colorMapping={colorMapping}
            availableColors={availableColors}
            disabledColors={disabledColors}
            updateFilterArray={updateFilterArray}
          />
        </DesktopFilterWrapper>
      ) : (
        <MobileFilterWrapper
          isFilterOpen={isFilterOpen}
          onClick={toggleFilterMenu}
        >
          <MobileFilter
            loadingReset={loadingReset}
            detailsFilters={detailsFilters}
            setDetailsFilters={setDetailsFilters}
            handleResetFilters={handleResetFilters}
            clearOrderedFilters={clearOrderedFilters}
            handleDetailsFilterChange={handleDetailsFilterChange}
            selectedCategoryOrder={selectedCategoryOrder}
            handleCategorySelect={handleCategorySelect}
            availableCategory={availableCategory}
            isCategoryDisabled={isCategoryDisabled}
            selectedSizeOrder={selectedSizeOrder}
            handleSizeSelect={handleSizeSelect}
            availableSizes={availableSizes}
            disabledSizes={disabledSizes}
            selectedColorOrder={selectedColorOrder}
            handleColorSelect={handleColorSelect}
            colorMapping={colorMapping}
            availableColors={availableColors}
            disabledColors={disabledColors}
            updateFilterArray={updateFilterArray}
          />
        </MobileFilterWrapper>
      )}
    </>
  );
};
const DesktopFilterWrapper = styled.aside`
  display: flex;
  grid-column: 1 / 2;
  gap: 0.5rem;
  flex-direction: column;
  margin: 5px 8px 0px 0px;
  height: 750px;
  min-width: 250px;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: start;
  justify-content: flex-start;
  position: sticky;
  top: 110px;
  background-color: rgb(253, 253, 253);
  @media (max-width: 1200px) {
    min-width: 228px;
  }
  @media (max-width: 1050px) {
    min-width: 200px;
  }
  @media (max-width: 900px) {
    display: none;
  }
`;
const MobileFilterWrapper = styled.div`
  position: fixed;
  top: 0;
  right: ${({ isFilterOpen }) => (isFilterOpen ? "-420px" : "0")};
  transition: right 0.3s ease-in-out;
  z-index: 3;
  min-width: 225px;
  max-width: 320px;
  height: 100%;
  background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
`;
