import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  css,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styled from "styled-components/macro";

export const ColorMobileFilter = ({
  detailsFilters,
  setDetailsFilters,
  allItems,
  filteredItems,
  selectedColorOrder,
  setSelectedColorOrder,
  handleResetFilters,
  handleDetailsFilterChange,
  updateFilterArray,
}) => {
  // Define a mapping of color names to CSS color values
  const colorMapping = {
    Black: "#000000",
    White: "#ffffff",
    Grey: "#8e8e8e",
    "Light Blue": "#269be4",
    Blue: "#2626e4",
    Navy: "#04046e",
    Purple: "#dc10ce",
    Pink: "#ea7baf",
    Red: "#e81a1a",
    Orange: "#f49d2c",
    Yellow: "#e6d21a",
    "Light Green": "#67dd4d",
    Green: "#24df13",
    Brown: "#682f21",
  };
  //function to find first color
  // const getFirstColorWord = (color) => {
  //   const words = color.split(" ");
  //   console.log(words);
  //   return words[0];
  // };

  const isFilteringByColor =
    detailsFilters.color && detailsFilters.color.length > 0;

  // Determine available colors based on the filter criteria
  const availableColors = Array.from(
    new Set(
      (isFilteringByColor ? allItems : filteredItems).flatMap(
        (item) => item.color
      )
    )
  ).filter((color) => color !== undefined);

  // Determine all colors across all items
  const allColors = Array.from(
    new Set(allItems.flatMap((item) => item.color))
  ).filter((color) => color !== undefined);

  // Colors to disable only when not filtering by color
  const disabledColors = isFilteringByColor
    ? []
    : allColors.filter((color) => !availableColors.includes(color));

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
            Colors
          </Typography>
        </AccordionSummary>
        <ClearFilterBtn
          style={{ display: "none" }}
          onClick={() => {
            //Reset section filters
            setDetailsFilters((prevFilters) => ({
              ...prevFilters,
              color: "",
            }));
            localStorage.removeItem("selectedFilters");
            handleResetFilters();
          }}
        >
          Clear filters
        </ClearFilterBtn>
        <AccordionDetails sx={{ padding: "20px 20px 20px 27px" }}>
          <Grid container spacing={1}>
            {/* Render selected colors */}
            {selectedColorOrder.map((colorKey, index) => (
              <Grid item xs={5} key={index}>
                <FormControlLabel
                  sx={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    margin: "8px 0 10px 0",
                    textTransform: "capitalize",
                  }}
                  control={
                    <ColorCheckbox
                      type="checkbox"
                      style={{
                        background: colorMapping[colorKey],
                      }}
                      checked={detailsFilters.color.includes(colorKey)}
                      onChange={(e) => {
                        handleDetailsFilterChange(
                          "color",
                          updateFilterArray(
                            detailsFilters.color,
                            /* getFirstColorWord(colorKey), */ //get first word value of property "color" in the object
                            colorKey,
                            e.target.checked
                          )
                        );
                        handleColorSelect(colorKey);
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        fontSize: "0.65rem",
                        paddingTop: "3px",
                      }}
                    >
                      {colorKey}
                    </Typography>
                  }
                />
              </Grid>
            ))}

            {/* Render available colors */}
            {availableColors
              .filter((colorKey) => !selectedColorOrder.includes(colorKey))
              .map((colorKey, index) => {
                const checkBoxColors = colorMapping[colorKey].split(" , ");
                const checkBoxStyle =
                  checkBoxColors.length > 1
                    ? `${checkBoxColors[0]}, ${checkBoxColors[1]}`
                    : checkBoxColors[0];

                return (
                  <Grid item xs={5} key={index}>
                    <FormControlLabel
                      sx={{
                        flexDirection: "column",
                        alignItems: "flex-start",
                        margin: "8px 0 10px 0",
                        textTransform: "capitalize",
                      }}
                      control={
                        <ColorCheckbox
                          type="checkbox"
                          style={{
                            background: checkBoxStyle,
                          }}
                          checked={detailsFilters.color.includes(colorKey)}
                          disabled={disabledColors.includes(colorKey)}
                          onChange={(e) => {
                            handleDetailsFilterChange(
                              "color",
                              updateFilterArray(
                                detailsFilters.color,
                                /* getFirstColorWord(colorKey), */ //get first word value of property "color" in the object
                                colorKey,
                                e.target.checked
                              )
                            );
                            handleColorSelect(colorKey);
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            fontSize: "0.65rem",
                            paddingTop: "3px",
                          }}
                        >
                          {colorKey}
                        </Typography>
                      }
                    />
                  </Grid>
                );
              })}
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
const ColorCheckbox = styled.input`
  appearance: none;
  outline: none;
  cursor: pointer;
  margin-left: ${({ checked }) => (checked ? "-6px" : "0")};
  border-radius: 50%;
  width: ${({ checked }) => (checked ? "38px" : "24px")};
  height: ${({ checked }) => (checked ? "38px" : "24px")};
  background-color: ${({ color }) => color};
  border: ${({ checked }) =>
    checked ? "1px solid black" : "1px solid#bfc2c6"};
`;
