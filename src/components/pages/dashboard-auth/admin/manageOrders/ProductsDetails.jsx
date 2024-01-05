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

export const ProductsDetails = ({ clientProducts }) => {
  const { windowWidth } = useContext(GlobalToolsContext);
  const { items, item_price } = clientProducts || {};


  return (
    <>
      <ProdcutsWrapper>
        <TableContainer component={Paper} sx={{ borderLeft: "1px solid grey" }}>
          <Table
            aria-label="simple table"
            sx={{
              borderLeft: "1px solid darkgrey",
              borderRight: " 1px solid darkgrey",
            }}
          >
            <TableHead>
              <TableRow>
                <TableCellTitle sx={{width: windowWidth < 500 ? "70px" : "120px", minWidth: "70px" }}></TableCellTitle>
                <TableCellTitle >Product</TableCellTitle> 
                <TableCellTitle>Color</TableCellTitle>
                <TableCellTitle>Size</TableCellTitle>
                <TableCellTitle>Price</TableCellTitle>
                <TableCellTitle>Qty</TableCellTitle>
                <TableCellTitle>Total</TableCellTitle>
              </TableRow>
            </TableHead>
            <TableBody>
              {items?.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCellData>
                    <OrderImg src={product.img[0]} alt={`Item ${product.id}`} />
                  </TableCellData>
                  <TableCellData>{product.title}</TableCellData>
                  <TableCellData>{product.color}</TableCellData>
                  <TableCellData sx={{textTransform:"uppercase!important"}}>{product.size}</TableCellData>
                  <TableCellData>
                    ${item_price?.[index]?.unit_price}
                  </TableCellData>
                  <TableCellData sx={{fontWeight:"600"}}>{product.quantity}</TableCellData>
                  <TableCellData>
                    ${item_price?.[index]?.unit_price * product.quantity}
                  </TableCellData>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ProdcutsWrapper>
    </>
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
  padding: 16px 8px !important;
  text-align: center !important;
  font-weight: 600!important;
`;
const TableCellData = styled(TableCell)`
  padding: 11.5px 0px !important;
  text-align: center !important;
  text-transform:capitalize
`;
const OrderImg = styled.img`
  width: 100%;
  max-width: 72px;
  min-width: 40px;
  height: auto;
  margin: 0px 0 0 35px;
  @media (max-width: 600px) {
    width: 55%;
    margin: 0px 0px 0px 15px;
  }
`;
