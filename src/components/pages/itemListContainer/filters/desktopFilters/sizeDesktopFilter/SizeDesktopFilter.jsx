import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  css,
  Grid,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styled from "styled-components/macro";
import { GlobalToolsContext } from "../../../../../context/GlobalToolsContext";
import { useContext } from "react";

export const SizeDesktopFilter = ({
  allItems,
  filteredItems,
  relatedItems,
  detailsFilters,
  setDetailsFilters,
  selectedSizeOrder,
  setSelectedSizeOrder,
  handleResetFilters,
  clearOrderedFilters,
  handleDetailsFilterChange,
  updateFilterArray,
}) => {
  const { windowWidth } = useContext(GlobalToolsContext);

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

  return (
    <>
      <Accordion
        defaultExpanded
        sx={styles.expandedAccordion(windowWidth)}
        screen={windowWidth}
      >
        <AccordionSummary
          sx={{
            "&.Mui-expanded": {
              minHeight: "0px",
              height: "30px",
            },
          }}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography
            sx={{
              minWidth: "112px",
              fontWeight: "bold",
              marginLeft: "6px",
              fontSize: "1.1rem",
              color: "#555454",
            }}
          >
            Sizes
          </Typography>
        </AccordionSummary>
        <ClearFilterBtn
          style={{ marginLeft: "23px" }}
          onClick={() => {
            setDetailsFilters((prevFilters) => ({
              // Reset section filters
              ...prevFilters,
              size: "",
            }));
            localStorage.removeItem("selectedFilters");
            localStorage.removeItem("selectedSizeOrder");
            handleResetFilters();
            clearOrderedFilters();
          }}
        >
          Clear filters
        </ClearFilterBtn>
        <AccordionDetails
          sx={{
            padding:
              windowWidth < 1200 ? "35px 14px 16px 8px" : "35px 24px 16px 12px",
          }}
        >
          <Grid container spacing={0}>
            {selectedSizeOrder.map((size, index) => (
              <Grid item xs={windowWidth < 1050 ? 6 : 4} key={index}>
                <CheckboxWrapper>
                  <SizeCheckboxLabel>
                    <SizeCheckboxInput
                      type="checkbox"
                      checked={detailsFilters.size.includes(size)}
                      onChange={(e) => {
                        handleDetailsFilterChange(
                          "size",
                          updateFilterArray(
                            detailsFilters.size,
                            size,
                            e.target.checked
                          )
                        );
                        handleSizeSelect(size); // Call handleSizeSelect when a size is selected or deselected
                      }}
                    />
                    <Typography
                      sx={{
                        fontWeight:
                          detailsFilters.size.includes(size) && "bold",
                        fontSize: "0.88rem",
                      }}
                    >
                      {size}
                    </Typography>
                  </SizeCheckboxLabel>
                </CheckboxWrapper>
              </Grid>
            ))}
            {availableSizes
              .sort((a, b) => {
                const sizeOrder = {
                  xs: 1,
                  s: 1.1,
                  m: 1.2,
                  l: 1.3,
                  xl: 1.4,
                  xxl: 1.5,
                };
                const aOrder = sizeOrder[a] || parseFloat(a, 16) || 9999;
                const bOrder = sizeOrder[b] || parseFloat(b, 16) || 9999;
                return aOrder - bOrder;
              })
              .filter((size) => !selectedSizeOrder.includes(size)) // Filter out selected sizes
              .map((size, index) => (
                <Grid item xs={windowWidth < 1050 ? 6 : 4} key={index}>
                  <CheckboxWrapper>
                    <SizeCheckboxLabel>
                      <SizeCheckboxInput
                        type="checkbox"
                        checked={detailsFilters.size.includes(size)}
                        disabled={disabledSizes.includes(size)}
                        onChange={(e) => {
                          handleDetailsFilterChange(
                            "size",
                            updateFilterArray(
                              detailsFilters.size,
                              size,
                              e.target.checked
                            )
                          );
                          handleSizeSelect(size); // Call handleSizeSelect when a size is selected or deselected
                        }}
                      />
                      <Typography
                        sx={{
                          fontWeight:
                            detailsFilters.size.includes(size) && "bold",
                          fontSize: "0.88rem",
                        }}
                      >
                        {size}
                      </Typography>
                    </SizeCheckboxLabel>
                  </CheckboxWrapper>
                </Grid>
              ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

const ClearFilterBtn = styled.button`
  display: none;
  font-size: 0.76rem;
  font-weight: 600;
  border: none;
  background-color: transparent;
  margin: 24px 0 0 32px;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    bottom: 2px;
    left: 6.8%;
    width: 84%;
    height: 1px;
    background-color: black;
  }
  &:hover {
    color: #00a6ff;
  }
`;

const styles = {
  expandedAccordion: (windowWidth) => css`
    margin: ${windowWidth < 1050 ? "0px" : "0px 10px 0 0px"} !important;
    border-top: 1px solid lightgray;
    box-shadow: none;
    padding: 16px 0;
    width: 88%;
    .MuiAccordionSummary-root {
      padding: 0 0 0 16px;
    }
    .css-b0p2nz-MuiFormControlLabel-root {
      margin-right: 0 !important ;
    }
  `,
};

const CheckboxWrapper = styled.div`
  margin-left: 24px;
`;
const SizeCheckboxLabel = styled.label`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  margin-right: 36px;
  margin-bottom: 25px;
  text-transform: uppercase;
  font-size: 0.88rem;
  &:hover {
    color: grey;
  }
`;
const SizeCheckboxInput = styled.input`
  width: 51px;
  height: 30px;
  border-radius: 10%;
  background-color: transparent;
  border: 1px solid rgb(191, 194, 198);
  appearance: none;
  outline: none;
  position: absolute;
  cursor: pointer;
  &:checked {
    border-width: 0.115rem;
    border-color: black;
    color: black;
  }
`;
