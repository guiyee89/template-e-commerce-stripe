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
import { DesktopFilterContainer } from "./filters/desktopFilters/DesktopFilterContainer";
import { MobileFilterContainer } from "./filters/mobileFilters/MobileFilterContainer";

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

  const navigate = useNavigate(); //Pasamos useNavigate() como prop
  const {
    isFilterOpen,
    toggleFilterMenu,
    windowWidth,
    setProgress,
    setVisible,
    progressComplete,
    setProgressComplete,
    pageLoading,
    setPageLoading,
  } = useContext(GlobalToolsContext);

  //////////////     //////////////    ////////////      ////////////      /////////////
  //FETCH TO FIRESTORE FOR COLLECTION DATABASE "products" AND FILTER BY categoryName
  useEffect(() => {
    setPageLoading(true);
    const delay = 500;

    const fetchData = async () => {
      // setVisible(true);
      // setProgress(8);
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

        // setTimeout(() => {
        setPageLoading(false);
        setProgressComplete(true);
        // if (progressComplete === true) {
        //   setProgress(100);
        // }
        // }, 150);
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
      window.scrollTo({ top: 150, behavior: "instant" });
    } else {
      setFilteredItems([]);
      setDetailsFilters([]);
      setItemsNotFound(true);
    }
  };

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
                {windowWidth > 900 && (
                  <DesktopFilterWrapper scrolled={scroll}>
                    <DesktopFilterContainer
                      items={items}
                      allItems={allItems}
                      onFilterChange={handleFilterChange}
                      setCurrentPage={setCurrentPage}
                      setItemLoader={setItemLoader}
                      filteredItems={filteredItems}
                    />
                  </DesktopFilterWrapper>
                )}
                {windowWidth <= 900 && (
                  <MobileFilterWrapper
                    isFilterOpen={isFilterOpen}
                    onClick={toggleFilterMenu}
                  >
                    <MobileFilterContainer
                      items={items}
                      allItems={allItems}
                      onFilterChange={handleFilterChange}
                      setCurrentPage={setCurrentPage}
                      setItemLoader={setItemLoader}
                    />
                  </MobileFilterWrapper>
                )}

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
  min-height: 550px;
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
  margin-top: 38px;
  margin-right: 20px;
  @media (max-width: 1150px) {
    margin-right: 10px;
  }
  @media (max-width: 900px) {
    grid-column: 1/13;
    margin: 0 auto;
  }
`;
