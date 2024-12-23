// import { AgregarDocs } from "../../dashboard/AgregarDocs";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ItemList } from "./ItemList";
import { db } from "../../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components/macro";
import { Ring } from "@uiball/loaders";
import { useContext } from "react";
import { GlobalToolsContext } from "../../context/GlobalToolsContext";
import { FilterContainer } from "./filters/FilterContainer";

////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ItemListContainer = () => {
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const { categoryName } = useParams();
  const [detailsFilters, setDetailsFilters] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsNotFound, setItemsNotFound] = useState(false);
  const [itemLoader, setItemLoader] = useState(false);
  const [filterChanged, setFilterChanged] = useState(false);
  const navigate = useNavigate();
  const {
    isMobileFilterOpen,
    isDesktopFilterOpen,
    toggleMobileFilterMenu,
    windowWidth,
    progressComplete,
    setProgressComplete,
    pageLoading,
    setPageLoading,
  } = useContext(GlobalToolsContext);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  //* Fetch to Firestore for collection DB "Products" - Filter by CategoryName
  useEffect(() => {
    setPageLoading(true); //? Page change loader
    const delay = 400;

    //Fetch item data from database
    const fetchData = async () => {
      try {
        // Retrieve "products" collection from Firestore
        const itemsCollection = collection(db, "products");
        const res = await getDocs(itemsCollection);
        const products = res.docs.map((productDoc) => ({
          ...productDoc.data(),
          id: productDoc.id,
        }));

        // Filter and sort products by category
        let filteredProducts = products;
        if (categoryName) {
          filteredProducts = filteredProducts.filter(
            (product) => product.category === categoryName
          );
        }

        // Create new map and filter products by id and color to obtain 1 unique item to render
        const uniqueProducts = [];
        const uniqueProductsMap = new Map();

        filteredProducts.forEach((product) => {
          const keys = `${product.productId}-${product.color}`;
          if (
            !uniqueProductsMap.has(keys) ||
            new Date(uniqueProductsMap.get(keys).createdAt) >
              new Date(product.createdAt)
          ) {
            uniqueProductsMap.set(keys, product);
          }
        });
        // Convert map to array
        uniqueProducts.push(...Array.from(uniqueProductsMap.values()));

        setItems(uniqueProducts); //? Store only 1 product to render
        setAllItems(products); //? Store all products

        // Hide loading indicator
        setPageLoading(false);
        // Mark fetch as complete for progress indicator
        setProgressComplete(true);
      } catch (err) {
        console.error(err);
      }
    };
    const timer = setTimeout(fetchData, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [categoryName]);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //* Store and handle filtered items and filter checkboxes
  const handleFilterChange = (filteredItems, detailsFilters) => {
    setItemsNotFound(false);
    if (filteredItems.length > 0) {
      setFilteredItems(filteredItems); //? Store filtered items on filter
      setDetailsFilters(detailsFilters); //? Store filter checkboxes
    } else {
      setFilteredItems([]);
      setDetailsFilters([]);
      setItemsNotFound(true);
    }
  };

  //* Scrolling behaviour on filter change
  useEffect(() => {
    if (filterChanged) {
      window.scrollTo({ top: 0, behavior: "instant" });
      setFilterChanged(false);
    }
  }, [filterChanged]);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //*                                    RENDERING                                   *//
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {pageLoading ? (
        <LoaderWrapper>
          {windowWidth > 600 ? (
            <Ring size={30} lineWeight={6} speed={1} color="black" />
          ) : (
            <Ring size={25} lineWeight={5} speed={1} color="black" />
          )}
        </LoaderWrapper>
      ) : (
        <>
          {/******  FILTER  ******/}
          {progressComplete && (
            <ItemsFiltersWrapper>
              <FilterContainer
                items={items}
                allItems={allItems}
                onFilterChange={handleFilterChange}
                setCurrentPage={setCurrentPage}
                setItemLoader={setItemLoader}
                filteredItems={filteredItems}
                isMobileFilterOpen={isMobileFilterOpen}
                isDesktopFilterOpen={isDesktopFilterOpen}
                toggleMobileFilterMenu={toggleMobileFilterMenu}
                setFilterChanged={setFilterChanged}
              />
              <ItemListWrapper isDesktopFilterOpen={isDesktopFilterOpen}>
                {/* RENDERING ITEMS */}

                <ItemList
                  filteredItems={filteredItems}
                  navigate={navigate}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  itemLoader={itemLoader}
                  detailsFilters={detailsFilters}
                />
              </ItemListWrapper>
            </ItemsFiltersWrapper>
          )}
        </>
      )}
      {/* <AgregarDocs /> */}
    </>
  );
};

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
  align-items: center;
`;

const NoProductMessage = styled.h2`
  padding-top: 140px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  width: 100%;
  height: 500px;
  color: black;
`;

const ItemListWrapper = styled.div`
  display: inline-block;
  width: 100%;
  padding-right: 12px;
  padding-left: 6px;
  padding-left: ${(props) => (props.isDesktopFilterOpen ? "0" : "12px")};
  transition: padding-left 0.4s ease-in-out;
  position: relative;

  @media (max-width: 900px) {
    width: 100%;
    padding-right: 0;
  }
`;
const ItemsFiltersWrapper = styled.div`
  display: flex;
  min-height: 1000px;
  height: 100%;
  width: 100%;
  max-width: 1618px;
  margin-top: 70px;
  margin-bottom: 85px;

  @media (max-width: 900px) {
    margin: 0 auto;
  }
`;
