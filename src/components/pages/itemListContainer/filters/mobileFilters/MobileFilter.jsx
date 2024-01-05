import styled from "styled-components/macro";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import { css } from "@emotion/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { Ring } from "@uiball/loaders";
import { GlobalToolsContext } from "../../../../context/GlobalToolsContext";
import { useContext } from "react";

export const MobileFilter = ({
  detailsFilters,
  setDetailsFilters,
  handleResetFilters,
  clearOrderedFilters,
  loadingReset,
  handleDetailsFilterChange,
  selectedCategoryOrder,
  handleCategorySelect,
  availableCategory,
  selectedSizeOrder,
  handleSizeSelect,
  availableSizes,
  selectedColorOrder,
  handleColorSelect,
  colorMapping,
  updateFilterArray,
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
              fontSize: "35px",
              marginTop: "15px",
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
          {/*      Loader Circle      */}
          <Loader>
            {loadingReset && (
              <Ring size={40} lineWeight={6} speed={1} color="black" />
            )}
          </Loader>

          {/****************      GENERAL FILTER       ****************/}
          <Accordion defaultExpanded sx={styles.expandedAccordion}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{
                "&.Mui-expanded": {
                  minHeight: "0px",
                  height: "45px",
                },
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  marginLeft: "11px",
                  fontSize: "1.1rem",
                  color: "#555454",
                }}
              >
                Order by
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: "18px 20px 18px 13px;" }}>
              <FormControlLabel
                sx={{
                  justifyContent: "flex-end",
                }}
                control={
                  <OrderByWrapper>
                    <OrderByBtn
                      active={detailsFilters.orderBy === ""}
                      onClick={() => {
                        setDetailsFilters((prevFilters) => ({
                          ...prevFilters,
                          orderBy: "",
                        }));
                        localStorage.removeItem("selectedFilters");
                        handleResetFilters();
                      }}
                    >
                      No order
                    </OrderByBtn>
                    <OrderByBtn
                      active={detailsFilters.orderBy === "discount"}
                      onClick={() => {
                        handleDetailsFilterChange("orderBy", "discount");
                      }}
                    >
                      Discount Only
                    </OrderByBtn>
                    <OrderByBtn
                      active={detailsFilters.orderBy === "lowPrice"}
                      onClick={() => {
                        handleDetailsFilterChange("orderBy", "lowPrice");
                      }}
                    >
                      Lower Price
                    </OrderByBtn>
                    <OrderByBtn
                      active={detailsFilters.orderBy === "highPrice"}
                      onClick={() => {
                        handleDetailsFilterChange("orderBy", "highPrice");
                      }}
                    >
                      Higher Price
                    </OrderByBtn>
                  </OrderByWrapper>
                }
              />
            </AccordionDetails>
          </Accordion>

          {/****************      CATEGORY FILTER       ****************/}
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
                .map((category, index) => (
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
            </AccordionDetails>
          </Accordion>

          {/****************      SIZE FILTER       ****************/}
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

          {/****************      COLOR FILTER       ****************/}
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
                {Object.keys(colorMapping)
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
  margin: 0px -5px 6px 20px;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    bottom: 1px;
    left: 6.4%;
    width: 88%;
    height: 1.5px;
    background-color: black;
  }
  &:hover {
    color: #00a6ff;
  }
`;
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

const Loader = styled.div`
  position: absolute;
  top: 48%;
  right: 85%;
  z-index: 1;
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
const OrderByWrapper = styled.div`
  width: 88%;
`;
const OrderByBtn = styled.button`
  width: 100%;
  text-align: inherit;
  border-radius: 3%;
  margin-bottom: 5px;
  padding: ${(props) => (props.active ? "5px" : "4px")};
  padding-left: 10px;
  text-transform: lowercase;
  color: ${(props) => (props.active ? "#000000" : "black")};
  font-size: 0.85rem;
  background-color: ${(props) =>
    props.active ? "rgb(189 189 189)" : "rgb(244 244 244 / 30%);"};
  border: ${(props) =>
    props.active ? "1px solid #857a7a" : "1px solid #8f8f8f89;"};
  font-weight: ${(props) => (props.active ? "500" : "normal")};
  text-align: ${(props) => (props.active ? "center" : "normal")};
  &:hover {
    background-color: ${(props) => (props.active ? "#979797" : "lightgrey")};
  }
`;
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
  justify-content: space-around;
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
