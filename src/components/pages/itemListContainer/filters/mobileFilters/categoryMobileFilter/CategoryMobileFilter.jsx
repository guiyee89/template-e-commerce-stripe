import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  css,
  FormControlLabel,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styled from "styled-components/macro";

export const CategoryMobileFilter = ({
  items,
  allItems,
  detailsFilters,
  setDetailsFilters,
  handleResetFilters,
  selectedCategoryOrder,
  setSelectedCategoryOrder,
  handleDetailsFilterChange,
  updateFilterArray,
  selectedSizeOrder,
}) => {
  const availableCategory = Array.from(
    new Set(items.map((item) => item.category))
  ).filter((category) => category !== undefined);

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

  const isNumericSize = (size) => !isNaN(size);

  const selectedSizeType =
    selectedSizeOrder.length > 0
      ? isNumericSize(selectedSizeOrder[0])
        ? "numeric"
        : "string"
      : null;

  const isCategoryDisabled = (category) => {
    if (!selectedSizeType) return false;
    const categorySizes = allItems
      .filter((item) => item.category === category)
      .map((item) => item.size);

    return selectedSizeType === "numeric"
      ? categorySizes.some((size) => isNaN(size))
      : categorySizes.some((size) => !isNaN(size));
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
              fontWeight: "bold",
              marginLeft: "12px",
              fontSize: "1.1rem",
              color: "#555454",
            }}
          >
            Categories
          </Typography>
        </AccordionSummary>
        <ClearFilterBtn
          onClick={() => {
            //Reset section filters
            setDetailsFilters((prevFilters) => ({
              ...prevFilters,
              category: "",
            }));
            localStorage.removeItem("selectedFilters");
            handleResetFilters();
          }}
          style={{ marginLeft: "25px", display: "none" }}
        >
          Clear filters
        </ClearFilterBtn>
        <AccordionDetails sx={{ padding: "18px 20px 18px 10px" }}>
          {selectedCategoryOrder.map((category, index) => (
            <FormControlLabel
              key={index}
              sx={{
                ...selectStyle,
                marginBottom: "3px",
                textTransform: "capitalize",
              }}
              control={
                <Checkbox
                  sx={{
                    color: "#949495",
                    width: "2.2rem",
                    "&.Mui-checked": {
                      color: "black",
                      width: "2.2rem",
                    },
                  }}
                  checked={detailsFilters.category.includes(category)}
                  onChange={(e) => {
                    handleDetailsFilterChange(
                      "category",
                      updateFilterArray(
                        detailsFilters.category,
                        category,
                        e.target.checked
                      )
                    );
                    handleCategorySelect(category);
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontSize: "0.88rem",
                  }}
                >
                  {category}
                </Typography>
              }
            />
          ))}
          {availableCategory
            .filter((category) => !selectedCategoryOrder.includes(category))
            .map((category, index) => {
              const isDisabled = isCategoryDisabled(category);
              return (
                <FormControlLabel
                  key={index}
                  sx={{
                    ...selectStyle,
                    marginBottom: "3px",
                    textTransform: "capitalize",
                  }}
                  control={
                    <Checkbox
                      sx={{
                        color: "#4b4848",
                        width: "2.2rem",
                        "&.Mui-checked": {
                          color: "black",
                          width: "2.2rem",
                        },
                      }}
                      checked={detailsFilters.category.includes(category)}
                      disabled={isDisabled}
                      onChange={(e) => {
                        handleDetailsFilterChange(
                          "category",
                          updateFilterArray(
                            detailsFilters.category,
                            category,
                            e.target.checked
                          )
                        );
                        handleCategorySelect(category);
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        fontSize: "0.88rem",
                        color: isDisabled ? "grey" : "black", // Change the color based on isDisabled
                      }}
                    >
                      {category}
                    </Typography>
                  }
                />
              );
            })}
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
const selectStyle = {
  m: 1.1,
  height: 25,
  width: 100,
};
