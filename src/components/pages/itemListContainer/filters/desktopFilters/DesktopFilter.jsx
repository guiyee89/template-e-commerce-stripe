import styled from "styled-components/macro";
import { Ring } from "@uiball/loaders";
import { CategoryDesktopFilter } from "./categoryDesktopFilter/CategoryDesktopFilter";
import { SizeDesktopFilter } from "./sizeDesktopFilter/SizeDesktopFilter";
import { ColorDesktopFilter } from "./colorDesktopFilter/ColorDesktopFilter";
import { GeneralDesktopFilter } from "./generalDesktopFilter/GeneralDesktopFilter";

export const DesktopFilter = ({
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

  return (
    <>
      <FilterHeader>
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
        
        {/*      Loader Circle      */}
        <Loader>
          {loadingReset && (
            <Ring size={40} lineWeight={6} speed={1} color="black" />
          )}
        </Loader>


        {/****************      GENERAL FILTER       ****************/}
        <GeneralDesktopFilter
          detailsFilters={detailsFilters}
          setDetailsFilters={setDetailsFilters}
          handleResetFilters={handleResetFilters}
          handleDetailsFilterChange={handleDetailsFilterChange}
        />

        {/****************      CATEGORY FILTER       ****************/}

        <CategoryDesktopFilter
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

        <SizeDesktopFilter
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

        <ColorDesktopFilter
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
    </>
  );
};

const FilterHeader = styled.div`
  display: flex;
  width: 88%;
  -webkit-box-pack: center;
  justify-content: space-evenly;
  padding-bottom: 10px;
  border-bottom: 1px solid lightgray;
  -webkit-box-align: center;
  align-items: center;
  @media (max-width: 1150px) {
    width: 92.7%;
  }
  @media (max-width: 1050px) {
    justify-content: flex-start;
    padding-left: 4px;
  }
`;
const FilterBy = styled.p`
  font-weight: bold;
  margin-right: 25px;
`;
const ResetAllBtn = styled.button`
  font-size: 0.8rem;
  font-weight: 600;
  border: none;
  background-color: transparent;
  margin-right: -25px;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    bottom: 2px;
    left: 5.3%;
    width: 90%;
    height: 1px;
    background-color: black;
  }
  &:hover {
    color: #00a6ff;
  }
`;
const FilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 76.5%;
  width: 95%;
  align-items: center;
  overflow-x: hidden;
  overflow-y: auto;
  border-bottom: 1px solid lightgrey;
  @media (max-width: 1150px) {
    width: 100%;
  }
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
`;
const Loader = styled.div`
  position: absolute;
  top: 25%;
  left: 77%;
  z-index: 1;
`;
