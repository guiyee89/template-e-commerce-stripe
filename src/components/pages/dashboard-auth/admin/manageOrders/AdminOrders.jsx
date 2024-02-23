import { useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import styled from "styled-components/macro";
import { db } from "../../../../../firebaseConfig";
import {
  Box,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import TopicOutlinedIcon from "@mui/icons-material/TopicOutlined";
import { ProductsDetails } from "./ProductsDetails";
import { BuyerDetails } from "./BuyerDetails";
import { GlobalToolsContext } from "../../../../context/GlobalToolsContext";

export const AdminOrders = () => {
  const { windowWidth } = useContext(GlobalToolsContext);
  const [myOrders, setMyOrders] = useState([]);
  console.log(myOrders.sort((a, b) => b.date.seconds - a.date.seconds));

  useEffect(() => {
    const ordersCollection = collection(db, "orders");

    getDocs(ordersCollection)
      .then((res) => {
        const newArray = res.docs.map((order) => ({
          ...order.data(),
          id: order.id,
        }));
        setMyOrders(newArray);
      })
      .catch((error) => console.log(error));
  }, []);

  const formatDate = (seconds) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(seconds * 1000).toLocaleDateString("en-US", options);
  };

  const [openProducts, setOpenProducts] = useState(false);
  const [clientProducts, setClientProducts] = useState(null);

  const handleOpenProducts = (orderId) => {
    const selectedOrder = myOrders.find((order) => order.id === orderId);
    if (selectedOrder) {
      setClientProducts(selectedOrder);
      setOpenProducts(true);
    }
  };

  const [openDetails, setOpenDetails] = useState(false);
  const [clientDetails, setClientDetails] = useState(null);

  const handleOpenDetails = (orderId) => {
    const selectedOrder = myOrders.find((order) => order.id === orderId);
    if (selectedOrder) {
      setClientDetails(selectedOrder);
      setOpenDetails(true);
    }
  };

  const handleClose = () => {
    setOpenProducts(false);
    setOpenDetails(false);
  };

  return (
    <>
      <OrdersWrapper>
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
                <TableCellTitle sx={{ width: "160px" }}>
                  Order ID
                </TableCellTitle>
                <TableCellTitle sx={{ width: "115px" }}>Date</TableCellTitle>
                <TableCellTitle sx={{ width: "80px" }}>Total</TableCellTitle>
                <TableCellTitle sx={{ width: "80px" }}>Products</TableCellTitle>
                <TableCellTitle sx={{ width: "160px" }}>
                  Buyer Details
                </TableCellTitle>
              </TableRow>
            </TableHead>
            <TableBody>
              {myOrders
                .filter((order) => order.items && order.items.length > 0) // Filter out orders with empty items
                .sort((a, b) => b.date.seconds - a.date.seconds) // Sort by date in descending order
                .map((order) => (
                  <TableRow key={order.id}>
                    <TableCellData>{order.id}</TableCellData>
                    <TableCellData sx={{ minWidth: "70px" }}>
                      {formatDate(order.date.seconds)}
                    </TableCellData>
                    <TableCellData sx={{ minWidth: "70px" }}>
                      $ {order.total.toFixed(2)}
                    </TableCellData>
                    <TableCellData onClick={() => handleOpenProducts(order.id)}>
                      <span
                        style={{
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        Open
                        <ArrowDropDownIcon sx={{ marginTop: "-2px" }} />
                      </span>
                    </TableCellData>
                    <TableCellData
                      onClick={() => handleOpenDetails(order.id)}
                      sx={{
                        textTransform: "capitalize",
                        display: "flex",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        paddingLeft:
                          windowWidth > 1076
                            ? "40px!important"
                            : "7px!important",
                      }}
                    >
                      {order?.buyer?.name}{" "}
                      <span
                        style={{
                          width: "35%",
                          paddingRight: "15px",
                          cursor: "pointer",
                        }}
                      >
                        <TopicOutlinedIcon />
                      </span>
                    </TableCellData>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Modal
          sx={{ maxWidth: "1000px", margin: "0 auto" }}
          open={openProducts}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <ProductsDetails
              handleClose={handleClose}
              clientProducts={clientProducts}
            />
          </Box>
        </Modal>
        <Modal
          sx={{ maxWidth: "600px", margin: "0 auto" }}
          open={openDetails}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <BuyerDetails
              handleClose={handleClose}
              clientDetails={clientDetails}
            />
          </Box>
        </Modal>
      </OrdersWrapper>
    </>
  );
};
const OrdersWrapper = styled.div`
  margin-top: 50px;
  box-shadow: 0px -3px 1px rgba(0, 0, 0, 0.15);
  overflow-x: auto;
  width: 85%;
  @media (max-width: 1000px) {
    width: 95%;
  }
  @media (max-width: 800px) {
    width: 100%;
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
  border-bottom: 5px solid lightgrey !important;
  border-left: 2px solid lightgrey;
  border-right: 2px solid lightgrey;
  font-size: 0.975rem;
  font-weight: 600 !important;
`;
const TableCellData = styled(TableCell)`
  padding: 19px 0px !important;
  text-align: center !important;
  border-left: 1px solid lightgrey;
  border-right: 1px solid lightgrey;
`;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  boxShadow: 24,
  border: "none!important",
  outline: "0",
};
