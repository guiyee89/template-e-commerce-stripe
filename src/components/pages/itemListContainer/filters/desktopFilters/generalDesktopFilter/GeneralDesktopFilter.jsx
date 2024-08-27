import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  css,
  FormControlLabel,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GlobalToolsContext } from "../../../../../context/GlobalToolsContext";
import styled from "styled-components/macro";
import { useContext } from "react";

export const GeneralDesktopFilter = ({
    detailsFilters,
    setDetailsFilters,
    handleResetFilters,
    handleDetailsFilterChange,
}) => {
  const { windowWidth } = useContext(GlobalToolsContext);

  return (
    <>
      <Accordion
        defaultExpanded
        sx={styles.expandedAccordion(windowWidth)}
        screen={windowWidth}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography
            sx={{
              fontWeight: "bold",
              marginLeft: "8px",
              fontSize: "1.1rem",
              color: "#555454",
            }}
          >
            Order by
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControlLabel
            sx={{
              justifyContent: "flex-start",
              marginLeft: "0px",
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
    </>
  );
};

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

const OrderByWrapper = styled.div`
  width: 82%;
`;
const OrderByBtn = styled.button`
  width: 100%;
  text-align: inherit;
  border-radius: 2px;
  margin-bottom: 5px;
  padding: ${(props) => (props.active ? "6px 3px" : "6px 3px")};
  padding-left: 6px;
  text-transform: uppercase;
  color: ${(props) => (props.active ? "#000000" : "black")};
  font-size: ${(props) => (props.active ? "0.67rem" : "0.65rem")};
  background-color: ${(props) =>
    props.active ? "rgb(189 189 189 / 65%)" : "rgb(244 244 244 / 30%)"};
  border: none;
  border-bottom: ${(props) =>
    props.active ? "1px solid #857a7a" : "1px solid #8f8f8f89;"};
  font-weight: ${(props) => (props.active ? "500" : "500")};
  text-align: ${(props) => (props.active ? "center" : "normal")};
  /* &:hover {
    background-color: ${(props) => (props.active ? "#979797" : "lightgrey")};
  } */
`;
