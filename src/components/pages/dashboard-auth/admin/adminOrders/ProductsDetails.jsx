import styled from "styled-components/macro";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useContext } from "react";
import { GlobalToolsContext } from "../../../../context/GlobalToolsContext";
import CloseIcon from "@mui/icons-material/Close";

export const ProductsDetails = ({ clientProducts, handleClose }) => {
  const { windowWidth } = useContext(GlobalToolsContext);
  const { items, item_price } = clientProducts || {};

  return (
    <ProdcutsWrapper>
      <CloseIconBtn onClick={handleClose} windowWidth={windowWidth} />
      <TableContainer
        component={Paper}
        sx={{
          borderLeft: "1px solid grey",
          padding: windowWidth < 700 ? "8px" : "20px",
        }}
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCellTitle
                sx={{
                  fontSize: windowWidth < 700 ? "0.65rem" : "inherit",
                  width: windowWidth < 700 ? "20px" : "50px",
                }}
              >
                ID
              </TableCellTitle>
              <TableCellTitle
                sx={{
                  width: windowWidth < 700 ? "60px" : "110px",
                  minWidth: windowWidth < 700 ? "25px" : "70px",
                  fontSize: windowWidth < 700 ? "0.68rem" : "inherit",
                }}
              >
                Image
              </TableCellTitle>
              <TableCellTitle
                sx={{
                  fontSize: windowWidth < 700 ? "0.68rem" : "inherit",
                }}
              >
                Product
              </TableCellTitle>
              <TableCellTitle
                sx={{
                  fontSize: windowWidth < 700 ? "0.68rem" : "inherit",
                }}
              >
                Color
              </TableCellTitle>
              <TableCellTitle
                sx={{
                  fontSize: windowWidth < 700 ? "0.68rem" : "inherit",
                }}
              >
                Size
              </TableCellTitle>
              <TableCellTitle
                sx={{
                  fontSize: windowWidth < 700 ? "0.68rem" : "inherit",
                }}
              >
                Price
              </TableCellTitle>
              <TableCellTitle
                sx={{
                  fontSize: windowWidth < 700 ? "0.68rem" : "inherit",
                }}
              >
                Qty
              </TableCellTitle>
              <TableCellTitle
                sx={{
                  /*  paddingRight:
                    windowWidth < 900 ? "20px!important" : "55px!important", */
                  fontSize: windowWidth < 700 ? "0.68rem" : "inherit",
                }}
              >
                Total
              </TableCellTitle>
            </TableRow>
          </TableHead>
          <TableBody>
            {items?.map((product, index) => (
              <TableRow key={product.id}>
                <TableCellData
                  sx={{
                    fontSize: windowWidth < 700 ? "0.68rem" : "inherit",
                    width: windowWidth < 700 ? "20px" : "50px",
                  }}
                >
                  {product.productId}
                </TableCellData>
                <TableCellData>
                  <OrderImg src={product.img[0]} alt={`Item ${product.id}`} />
                </TableCellData>
                <TableCellData
                  sx={{
                    fontSize: windowWidth < 700 ? "0.68rem" : "inherit",
                    width: windowWidth < 900 ? "63px" : "150px",
                  }}
                >
                  {product.title}
                </TableCellData>
                <TableCellData
                  sx={{
                    fontSize: windowWidth < 700 ? "0.68rem" : "inherit",
                  }}
                >
                  {product.color}
                </TableCellData>
                <TableCellData
                  sx={{
                    textTransform: "uppercase!important",
                    fontSize: windowWidth < 700 ? "0.68rem" : "inherit",
                  }}
                >
                  {product.size}
                </TableCellData>
                <TableCellData
                  sx={{
                    fontSize: windowWidth < 700 ? "0.68rem" : "inherit",
                  }}
                >
                  ${(item_price?.[index]?.unit_price).toFixed(2)}
                </TableCellData>
                <TableCellData
                  sx={{
                    fontWeight: "600",
                    fontSize: windowWidth < 700 ? "0.68rem" : "inherit",
                  }}
                >
                  {product.quantity}
                </TableCellData>
                <TableCellData
                  sx={{
                    /*   paddingRight:
                      windowWidth < 900 ? "20px!important" : "55px!important", */
                    fontSize: windowWidth < 700 ? "0.68rem" : "inherit",
                    fontWeight: 600,
                  }}
                >
                  $
                  {(item_price?.[index]?.unit_price * product.quantity).toFixed(
                    2
                  )}
                </TableCellData>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ProdcutsWrapper>
  );
};

const ProdcutsWrapper = styled.div`
  box-shadow: 0px -3px 1px rgba(0, 0, 0, 0.15);
  overflow-x: auto;
  width: 100%;
  @media (max-width: 1000px) {
  }
  /* Customize scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 8px;
  }
  &::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }
`;

const TableCellTitle = styled(TableCell)`
  padding: 24px 8px !important;
  text-align: center !important;
  font-weight: 600 !important;
`;

const TableCellData = styled(TableCell)`
  padding: 11.5px 0px !important;
  text-align: center !important;
  text-transform: capitalize;
`;

const OrderImg = styled.img`
  width: 100%;
  max-width: 72px;
  min-width: 40px;
  height: auto;
  margin: 0 auto;
  @media (max-width: 900px) {
    margin: 0px 0px 0px 15px;
  }
  @media (max-width: 700px) {
    width: 55%;
    margin: 0px 10px 0px 10px;
  }
`;

const CloseIconBtn = styled(CloseIcon)`
  cursor: pointer;
  font-size: 1.6rem !important;
  top: 4px;
  right: 4px;
  position: absolute;
  z-index: 2;
  box-shadow: rgba(0, 0, 0, 0.85) 0px 0px 5px;
  box-shadow: rgba(0, 0, 0, 0.35) 0 0 10px;
  @media (max-width: 750px) {
    font-size: 1.1rem !important;
    top: 4px;
    right: 4px;
  }
`;
