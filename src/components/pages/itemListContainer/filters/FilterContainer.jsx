import { useContext, useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { useParams } from "react-router-dom";
import { DesktopFilter } from "./desktopFilters/DesktopFilter";
import { GlobalToolsContext } from "../../../context/GlobalToolsContext";
import { MobileFilter } from "./mobileFilters/MobileFilter";
import styled from "styled-components/macro";

 ////////////////////////////////////////////////////////////////////////////////////////////////////
export const FilterContainer = ({
  items,
  allItems,
  onFilterChange,
  setCurrentPage,
  setItemLoader,
  filteredItems,
  isMobileFilterOpen,
  isDesktopFilterOpen,
  toggleMobileFilterMenu,
  setFilterChanged,
  isDiscountOnly,
}) => {
  const { windowWidth } = useContext(GlobalToolsContext);

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  //*                       STATE FOR DIFFERENT FILTERS                        //
  const [detailsFilters, setDetailsFilters] = useState({
    category: "",
    size: "",
    color: "",
    orderBy: "",
  });
  const [selectedCategoryOrder, setSelectedCategoryOrder] = useState([]);
  const [selectedSizeOrder, setSelectedSizeOrder] = useState([]);
  const [selectedColorOrder, setSelectedColorOrder] = useState([]);
  const { categoryName } = useParams();

  //! Assuming related items are stored in a variable or fetched from a database
  const getRelatedItems = (items) => {
    return allItems.filter((relatedItem) =>
      items.some(
        (item) =>
          item.productId === relatedItem.productId && relatedItem.stock > 0
      )
    );
  };
  // Fetch related items based on filteredItems
  const relatedItems = getRelatedItems(filteredItems);

  // Clear selected sizes order and get back to available sizes
  const clearOrderedFilters = () => {
    setSelectedSizeOrder([]);
    setSelectedCategoryOrder([]);
    setSelectedColorOrder([]);
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  //*                                FILTERING LOGIC FOR allItems                                  //

  //! Fetch items from Firestore Database and filter accordingly on selection
  const fetchFilteredItems = async () => {
    setFilterChanged(true);
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

  //!ORDER BY - filtering logic according if filtered items or original items are being rendered
  useEffect(() => {
    setTimeout(() => {
      if (
        detailsFilters.category.length === 0 &&
        detailsFilters.size.length === 0 &&
        detailsFilters.color.length === 0
      ) {
        // If no filters are applied, order the original items by the selected ordering option
        let orderedItems = [...items];
        if (detailsFilters.orderBy === "discount" || isDiscountOnly) {
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

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  //*                    HANDLE FILTERED ITEMS & PASS VALUE TO ItemListContainer                    *//

  //!   Handle each filter change and pass the values
  const handleDetailsFilterChange = (filterName, value) => {
    setTimeout(() => {
      setDetailsFilters((prevFilters) => ({
        ...prevFilters,
        [filterName]: value,
      }));
      setCurrentPage(1); //Set pagination to 1 if filters changed
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

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  //*           LOADER            //
  const loadingReset = false;

  const handleResetFilters = () => {
    setItemLoader(true); //Activate Loader for filters
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  //*                                MANAGING FILTERS BY localStorage                               //
  //! Load selected filters from localStorage when the component mounts
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

  //! Update localStorage when the detailsFilters state changes
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

   ////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <>
      {windowWidth > 900 ? (
        <DesktopFilterWrapper
          scrolled={scroll}
          isDesktopFilterOpen={isDesktopFilterOpen}
        >
          <DesktopFilter
            items={items}
            allItems={allItems}
            filteredItems={filteredItems}
            relatedItems={relatedItems}
            loadingReset={loadingReset}
            detailsFilters={detailsFilters}
            setDetailsFilters={setDetailsFilters}
            handleResetFilters={handleResetFilters}
            clearOrderedFilters={clearOrderedFilters}
            handleDetailsFilterChange={handleDetailsFilterChange}
            updateFilterArray={updateFilterArray}
            selectedCategoryOrder={selectedCategoryOrder}
            setSelectedCategoryOrder={setSelectedCategoryOrder}
            selectedSizeOrder={selectedSizeOrder}
            setSelectedSizeOrder={setSelectedSizeOrder}
            selectedColorOrder={selectedColorOrder}
            setSelectedColorOrder={setSelectedColorOrder}
            isDiscountOnly={isDiscountOnly}
          />
        </DesktopFilterWrapper>
      ) : (
        <MobileFilterWrapper
          isMobileFilterOpen={isMobileFilterOpen}
          onClick={toggleMobileFilterMenu}
        >
          <MobileFilter
            items={items}
            allItems={allItems}
            filteredItems={filteredItems}
            relatedItems={relatedItems}
            loadingReset={loadingReset}
            detailsFilters={detailsFilters}
            setDetailsFilters={setDetailsFilters}
            handleResetFilters={handleResetFilters}
            clearOrderedFilters={clearOrderedFilters}
            handleDetailsFilterChange={handleDetailsFilterChange}
            updateFilterArray={updateFilterArray}
            selectedCategoryOrder={selectedCategoryOrder}
            setSelectedCategoryOrder={setSelectedCategoryOrder}
            selectedSizeOrder={selectedSizeOrder}
            setSelectedSizeOrder={setSelectedSizeOrder}
            selectedColorOrder={selectedColorOrder}
            setSelectedColorOrder={setSelectedColorOrder}
            isDiscountOnly={isDiscountOnly}
          />
        </MobileFilterWrapper>
      )}
    </>
  );
};
const DesktopFilterWrapper = styled.aside`
  width: ${(props) => (props.isDesktopFilterOpen ? "25%" : "0")};
  opacity: ${(props) => (props.isDesktopFilterOpen ? 1 : 0)};
  visibility: ${(props) => (props.isDesktopFilterOpen ? "visible" : "hidden")};
  transform: ${(props) =>
    props.isDesktopFilterOpen ? "translateX(0)" : "translateX(-100%)"};
  transition: width 0.3s ease-in-out, opacity 0.2s ease-in-out,
    visibility 0s linear 0.15s, transform 0.35s ease-in-out;
  transform-origin: left;
  margin: 10px 0 0 0;
  height: 750px;
  max-width: 285px;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: start;
  position: sticky;
  top: 110px;
  background-color: rgb(253, 253, 253);

  animation: ${(props) =>
    props.isDesktopFilterOpen
      ? "fadeIn 0.55s ease-in"
      : "fadeOut 0.3s ease-out"};

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  @media (max-width: 900px) {
    display: none;
  }
`;

const MobileFilterWrapper = styled.div`
  position: fixed;
  top: 0;
  right: ${({ isMobileFilterOpen }) => (isMobileFilterOpen ? "-420px" : "0")};
  transition: right 0.3s ease-in-out;
  z-index: 3;
  min-width: 225px;
  max-width: 320px;
  height: 100%;
  background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
`;
