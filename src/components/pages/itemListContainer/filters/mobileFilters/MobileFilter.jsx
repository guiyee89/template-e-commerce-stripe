import styled from "styled-components/macro";
import CloseIcon from "@mui/icons-material/Close";
import { Ring } from "@uiball/loaders";
import { GlobalToolsContext } from "../../../../context/GlobalToolsContext";
import { useContext } from "react";
import { CategoryMobileFilter } from "./categoryMobileFilter/CategoryMobileFilter";
import { SizeMobileFilter } from "./sizeMobileFilter/SizeMobileFilter";
import { ColorMobileFilter } from "./colorMobileFilter/ColorMobileFilter";
import { GeneralMobileFilter } from "./generalMobileFilter/GeneralMobileFilter";

export const MobileFilter = ({
  items,
  allItems,
  filteredItems,
  relatedItems,
  loadingReset,
  detailsFilters,
  setDetailsFilters,
  handleResetFilters,
  clearOrderedFilters,
  handleDetailsFilterChange,
  updateFilterArray,
  selectedCategoryOrder,
  setSelectedCategoryOrder,
  selectedSizeOrder,
  setSelectedSizeOrder,
  selectedColorOrder,
  setSelectedColorOrder,
}) => {
  const { isFilterOpen, toggleFilterMenu } = useContext(GlobalToolsContext);

  return (
    <>
      <TransparentDiv
        isOpen={isFilterOpen}
        onClick={isFilterOpen ? toggleFilterMenu : null}
      />
      <SideFilterWrapper isFilterOpen={isFilterOpen} onClick={toggleFilterMenu}>
        <FilterHeader>
          <CloseIcon
            onClick={toggleFilterMenu}
            sx={{
              fontSize: "25px",
              marginTop: "15px",
              marginRight: "4px",
              marginLeft: "-15px",
              cursor: "pointer",
            }}
          />
          <FilterBy>Filters</FilterBy>
          <ResetAllBtn
            onClick={() => {
              //Reset General Filters
              setDetailsFilters((prevFilters) => ({
                ...prevFilters,
                category: "",
                size: "",
                color: "",
                orderBy: "",
              }));
              localStorage.removeItem("selectedFilters");
              localStorage.removeItem("selectedSizeOrder");
              localStorage.removeItem("selectedCategoryOrder");
              localStorage.removeItem("selectedColorOrder");
              handleResetFilters();
              clearOrderedFilters();
            }}
          >
            Clear Filters
          </ResetAllBtn>
        </FilterHeader>
        <FilterWrapper>

          {/*  Loader Circle  */}
          <ResetLoader>
            {loadingReset && (
              <Ring size={40} lineWeight={6} speed={1} color="black" />
            )}
          </ResetLoader>


          {/****************      GENERAL FILTER       ****************/}
          <GeneralMobileFilter
            detailsFilters={detailsFilters}
            setDetailsFilters={setDetailsFilters}
            handleResetFilters={handleResetFilters}
            handleDetailsFilterChange={handleDetailsFilterChange}
          />

          {/****************      CATEGORY FILTER       ****************/}
          <CategoryMobileFilter
            items={items}
            allItems={allItems}
            detailsFilters={detailsFilters}
            setDetailsFilters={setDetailsFilters}
            handleResetFilters={handleResetFilters}
            selectedCategoryOrder={selectedCategoryOrder}
            setSelectedCategoryOrder={setSelectedCategoryOrder}
            handleDetailsFilterChange={handleDetailsFilterChange}
            updateFilterArray={updateFilterArray}
            selectedSizeOrder={selectedSizeOrder}
          />

          {/****************      SIZE FILTER       ****************/}
          <SizeMobileFilter
            allItems={allItems}
            filteredItems={filteredItems}
            relatedItems={relatedItems}
            detailsFilters={detailsFilters}
            setDetailsFilters={setDetailsFilters}
            selectedSizeOrder={selectedSizeOrder}
            setSelectedSizeOrder={setSelectedSizeOrder}
            handleResetFilters={handleResetFilters}
            clearOrderedFilters={clearOrderedFilters}
            handleDetailsFilterChange={handleDetailsFilterChange}
            updateFilterArray={updateFilterArray}
          />

          {/****************      COLOR FILTER       ****************/}
          <ColorMobileFilter
            allItems={allItems}
            filteredItems={filteredItems}
            detailsFilters={detailsFilters}
            setDetailsFilters={setDetailsFilters}
            selectedColorOrder={selectedColorOrder}
            setSelectedColorOrder={setSelectedColorOrder}
            handleResetFilters={handleResetFilters}
            handleDetailsFilterChange={handleDetailsFilterChange}
            updateFilterArray={updateFilterArray}
          />
        </FilterWrapper>
      </SideFilterWrapper>
    </>
  );
};

//MATERIAL UI STYLES
const TransparentDiv = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ isOpen }) => (isOpen ? "none" : "rgba(0, 0, 0, 0.2)")};
  z-index: ${({ isOpen }) => (isOpen ? "0" : "1")};
  display: ${({ isOpen }) => (isOpen ? "none" : "block")};
`;

const SideFilterWrapper = styled.div`
  position: fixed;
  top: 0;
  right: ${({ isFilterOpen }) => (isFilterOpen ? "-420px" : "0")};
  transition: right 0.3s ease-in-out;
  z-index: 2;
  max-width: 225px;
  height: 100%;
  background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
`;
const FilterHeader = styled.div`
  display: flex;
  width: 100%;
  -webkit-box-pack: center;
  justify-content: center;
  padding-bottom: 10px;
  border-bottom: 1px solid lightgray;
  @media (max-width: 900px) {
    justify-content: space-around;
    align-items: flex-end;
  }
`;
const FilterBy = styled.p`
  font-weight: bold;
  margin-right: 25px;
  @media (max-width: 900px) {
    display: none;
  }
`;
const ResetAllBtn = styled.button`
  font-size: 0.7rem;
  font-weight: 500;
  border: none;
  background-color: transparent;
  margin: 0px -5px 2px 20px;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    bottom: 2px;
    left: 8.4%;
    width: 86%;
    height: 1.5px;
    background-color: black;
  }
  &:hover {
    color: #00a6ff;
  }
`;
const FilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 68%;
  width: 95%;
  align-items: center;
  overflow-x: hidden;
  overflow-y: auto;
  border-bottom: 1px solid lightgrey;
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
  ::-webkit-scrollbar-track {
    background-color: #f6f6f6;
  }
  @media (max-width: 900px) {
    height: 85%;
    width: 95%;
  }
`;
const ResetLoader = styled.div`
  position: absolute;
  top: 48%;
  right: 85%;
  z-index: 1;
`;
