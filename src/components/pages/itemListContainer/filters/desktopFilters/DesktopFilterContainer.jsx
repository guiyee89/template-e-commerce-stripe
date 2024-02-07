import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../../firebaseConfig";
import { useParams } from "react-router-dom";
import { DesktopFilter } from "./DesktopFilter";

export const DesktopFilterContainer = ({
  items,
  allItems,
  onFilterChange,
  setCurrentPage,
  setItemLoader,
}) => {
  //////////           ////////////           ////////////           ///////////           ///////////
  //                       STATE FOR DIFFERENT FILTERS                        //
  const [detailsFilters, setDetailsFilters] = useState({
    category: "",
    size: "",
    color: "",
    orderBy: "",
  });

  //////////           ////////////           ////////////           ///////////           ///////////
  //      MAPING COLORS, SIZE, CATEGORIES AND QUANTITY FOR EACH FILTER        //

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

  //----------        SIZE MAPING       ----------//
  const availableSizes = Array.from(
    new Set(allItems.map((item) => item.size))
  ).filter((size) => size !== undefined);

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
    black: "#000000",
    white: "#ffffff",
    grey: "#8e8e8e",
    blue: "#2626e4",
    purple: "#dc10ce",
    pink: "#ea7baf",
    red: "#e81a1a",
    orange: "#f49d2c",
    yellow: "#e6d21a",
    green: "#24df13",
    brown: "#682f21",
  };
  //function to find first color
  // const getFirstColorWord = (color) => {
  //   const words = color.split(" ");
  //   console.log(words);
  //   return words[0];
  // };

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

  // Clear selected sizes order and get back to available sizes
  const clearOrderedFilters = () => {
    setSelectedSizeOrder([]);
    setSelectedCategoryOrder([]);
    setSelectedColorOrder([]);
  };

  //////////           ////////////           ////////////           ///////////           ///////////
  //                                FILTERING LOGIC FOR ALL ITEMS                                  //

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
      /* if (detailsFilters.color.length > 0) {
       queryFilters.push(where("color", "in", detailsFilters.color));
    }    */

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

      console.log(orderedItems);

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
    }, 750);
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
        selectedSizeOrder={selectedSizeOrder}
        handleSizeSelect={handleSizeSelect}
        availableSizes={availableSizes}
        selectedColorOrder={selectedColorOrder}
        handleColorSelect={handleColorSelect}
        colorMapping={colorMapping}
        updateFilterArray={updateFilterArray}
      />
    </>
  );
};
