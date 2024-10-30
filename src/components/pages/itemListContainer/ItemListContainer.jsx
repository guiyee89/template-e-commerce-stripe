// import { AgregarDocs } from "../../dashboard/AgregarDocs";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ItemList } from "./ItemList";
import { db } from "../../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components/macro";
import useScrollRestoration from "../../hooks/useScrollRestoration";
import { Ring } from "@uiball/loaders";
import { useContext } from "react";
import { GlobalToolsContext } from "../../context/GlobalToolsContext";
import { FilterContainer } from "./filters/FilterContainer";

//////////////     //////////////    ////////////      ////////////      /////////////
export const ScrollRestorationWrapper = ({ children }) => {
  useScrollRestoration(); // Apply the scroll restoration hook
  return <>{children}</>; // Render the children content
};

//////////////     //////////////    ////////////      ////////////      /////////////
export const ItemListContainer = () => {
  const [items, setItems] = useState([]); //Guardamos los items
  const [allItems, setAllItems] = useState([]); //Save all items to filter properly
  const { categoryName } = useParams(); //useParams de react-router-dom para filtrar productos por categoryName
  const [detailsFilters, setDetailsFilters] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsNotFound, setItemsNotFound] = useState(false);
  const [itemLoader, setItemLoader] = useState(false);
  const [filterChanged, setFilterChanged] = useState(false);
  const navigate = useNavigate(); //Pasamos useNavigate() como prop

  const {
    isFilterOpen,
    toggleFilterMenu,
    windowWidth,
    progressComplete,
    setProgressComplete,
    pageLoading,
    setPageLoading,
  } = useContext(GlobalToolsContext);

  //////////////     //////////////    ////////////      ////////////      /////////////
  //FETCH TO FIRESTORE FOR COLLECTION DATABASE "products" AND FILTER BY categoryName
  useEffect(() => {
    setPageLoading(true);
    const delay = 300;

    const fetchData = async () => {
      try {
        const itemsCollection = collection(db, "products");
        const res = await getDocs(itemsCollection);
        const products = res.docs.map((productDoc) => ({
          ...productDoc.data(),
          id: productDoc.id,
        }));

        // Filter and sort products
        let filteredProducts = products;

        if (categoryName) {
          filteredProducts = filteredProducts.filter(
            (product) => product.category === categoryName
          );
        }

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

        uniqueProducts.push(...Array.from(uniqueProductsMap.values()));

        setItems(uniqueProducts);
        setAllItems(products);

        console.log(uniqueProducts);

        setPageLoading(false);
        setProgressComplete(true);
      } catch (err) {
        console.error(err);
      }
    };
    const timer = setTimeout(fetchData, delay);
    return () => {
      clearTimeout(timer); // Clear the timeout if the component unmounts
    };
  }, [categoryName]);

  const handleFilterChange = (filteredItems, detailsFilters) => {
    setItemsNotFound(false);
    if (filteredItems.length > 0) {
      setFilteredItems(filteredItems);
      setDetailsFilters(detailsFilters);
    } else {
      setFilteredItems([]);
      setDetailsFilters([]);
      setItemsNotFound(true);
    }
  };

  useEffect(() => {
    if (filterChanged) {
      window.scrollTo({ top: 0, behavior: "instant" });
      setFilterChanged(false);
    }
  }, [filterChanged]);

  //////////////     //////////////    ////////////      ////////////      /////////////
  //                                    RENDERING                                    //
  return (
    <>
      <ScrollRestorationWrapper>
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
              <Ring size={27} lineWeight={6} speed={1} color="black" />
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
                  isFilterOpen={isFilterOpen}
                  toggleFilterMenu={toggleFilterMenu}
                  setFilterChanged={setFilterChanged}
                />
                <ItemListWrapper>
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
      </ScrollRestorationWrapper>
    </>
  );
};

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
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
  grid-column: 2/13;
  margin-top: -3px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  @media (max-width: 900px) {
    width: 100%;
    grid-column: 1/13;
  }
`;
const ItemsFiltersWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  height: 100%;
  width: 100%;
  max-width: 1618px;
  margin-top: 70px;
  margin-right: 20px;
  margin-bottom: 85px;
  @media (max-width: 1150px) {
    margin-right: 10px;
  }
  @media (max-width: 900px) {
    grid-column: 1/13;
    margin: 0 auto;
  }
`;
