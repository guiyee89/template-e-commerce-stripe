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

export const SizeMobileFilter = ({
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
      <Accordion defaultExpanded sx={styles.expandedAccordion}>
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
              marginLeft: "12px",
              fontSize: "1.1rem",
              color: "#555454",
            }}
          >
            Sizes
          </Typography>
        </AccordionSummary>
        <ClearFilterBtn
          style={{ marginLeft: "21px", display: "none" }}
          onClick={() => {
            setDetailsFilters((prevFilters) => ({
              //Reset section filters
              ...prevFilters,
              size: "",
            }));
            localStorage.removeItem("selectedFilters");
            handleResetFilters();
          }}
        >
          Clear filters
        </ClearFilterBtn>
        <AccordionDetails sx={{ padding: "30px 36px 18px 15px;" }}>
          <Grid container spacing={0}>
            {selectedSizeOrder.map((size, index) => (
              <Grid item xs={5} key={index}>
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
                  s: 2,
                  m: 3,
                  l: 4,
                  xl: 5,
                  xxl: 6,
                };
                const aOrder = sizeOrder[a] || parseInt(a, 16) || 9999;
                const bOrder = sizeOrder[b] || parseInt(b, 16) || 9999;
                return aOrder - bOrder;
              })
              .filter((size) => !selectedSizeOrder.includes(size)) // Filter out selected sizes
              .map((size, index) => (
                <Grid item xs={5} key={index}>
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
  font-size: 0.7rem;
  font-weight: 500;
  border: none;
  background-color: transparent;
  margin: 24px 0 0 21px;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    bottom: 2px;
    left: 8.5%;
    width: 85.5%;
    height: 1px;
    background-color: black;
  }
  &:hover {
    color: #00a6ff;
  }
`;
const styles = {
  expandedAccordion: css`
    border-top: 1px solid lightgray;
    box-shadow: none;
    padding: 16px 0;
    width: 88%;

    &.Mui-expanded {
      margin: 5px 11px 0px 8px;
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
  margin-left: 8px;
  margin-right: 36px;
  margin-bottom: 25px;
  text-transform: uppercase;
  justify-content: center;
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
