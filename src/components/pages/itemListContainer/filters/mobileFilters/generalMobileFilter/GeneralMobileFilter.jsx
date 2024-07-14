import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  css,
  FormControlLabel,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styled from "styled-components/macro";

export const GeneralMobileFilter = ({
  detailsFilters,
  setDetailsFilters,
  handleResetFilters,
  handleDetailsFilterChange,
}) => {
  return (
    <>
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
    </>
  );
};

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
const OrderByWrapper = styled.div`
  width: 88%;
`;
const OrderByBtn = styled.button`
  width: 100%;
  text-align: inherit;
  border-radius: 2px;
  margin-bottom: 5px;
  padding: ${(props) => (props.active ? "5px" : "4px")};
  padding-left: 10px;
  text-transform: capitalize;
  color: ${(props) => (props.active ? "#000000" : "black")};
  font-size: ${(props) => (props.active ? "0.67rem" : "0.65rem")};
  background-color: ${(props) =>
    props.active ? "rgb(189 189 189 / 65%)" : "rgb(244 244 244 / 30%)"};
  border: none;
  border-bottom: ${(props) =>
    props.active ? "1px solid #857a7a" : "1px solid #8f8f8f89;"};
  font-weight: ${(props) => (props.active ? "500" : "500")};
  text-align: ${(props) => (props.active ? "center" : "normal")};
  /*   &:hover {
    background-color: ${(props) => (props.active ? "#979797" : "lightgrey")};
  } */
`;
