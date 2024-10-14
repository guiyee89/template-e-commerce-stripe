import { useContext, useEffect, useState } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import styled from "styled-components/macro";
import { db } from "../../../../../firebaseConfig";
import {
  Box,
  Modal,
  Paper,
  Switch,
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
import { Ring } from "@uiball/loaders";

export const AdminOrders = () => {
  const { windowWidth } = useContext(GlobalToolsContext);
  const [openProducts, setOpenProducts] = useState(false);
  const [clientProducts, setClientProducts] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [clientDetails, setClientDetails] = useState(null);
  const [myOrders, setMyOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(true);
  const [isActive, setIsActive] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersCollection = collection(db, "orders");
        const querySnapshot = await getDocs(ordersCollection);
        const ordersArray = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        // Initialize isActive state based on the shipped status of each order
        const initialActiveState = {};
        ordersArray.forEach((order) => {
          initialActiveState[order.id] = order.shipped || false;
        });

        setMyOrders(ordersArray);
        setIsActive(initialActiveState); // Set initial isActive state
        setTimeout(() => {
          setOrderLoading(false); // Set loading to false once data is fetched
        }, 700);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setTimeout(() => {
          setOrderLoading(false); // Set loading to false once data is fetched
        }, 700);
      }
    };

    fetchOrders();
  }, []);
 
  const formatDate = (seconds) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(seconds * 1000).toLocaleDateString("en-US", options);
  };

  const handleOpenProducts = (orderId) => {
    const selectedOrder = myOrders.find((order) => order.id === orderId);
    if (selectedOrder) {
      setClientProducts(selectedOrder);
      setOpenProducts(true);
    }
  };

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

  const handleToggle = async (orderId) => {
    try {
      setIsActive((prevState) => ({
        ...prevState,
        [orderId]: !prevState[orderId],
      }));
      console.log(
        `Order ${orderId} is now ${!isActive[orderId] ? "active" : "inactive"}`
      );
      const orderDocRef = doc(db, "orders", orderId);
      await updateDoc(orderDocRef, {
        shipped: true,
      });
      console.log(
        `Order ${orderId} shipped status updated to: ${orderId}`
      );
    } catch (error) {
      console.error("Error updating order shipped status:", error);
    }
  };

  if (orderLoading) {
    return (
      <Loader>
        <Ring size={40} lineWeight={6} speed={1} color="black" />
      </Loader>
    );
  }

  return (
    <>
      <OrdersWrapper>
        <TableOrderContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "#bac7e194" }}>
              <TableRow sx={{ textTransform: "uppercase" }}>
                <TableCellTitle
                  sx={{
                    width: "150px",
                    fontSize: windowWidth < 500 && ".58rem",
                  }}
                >
                  Order ID
                </TableCellTitle>
                <TableCellTitle
                  sx={{
                    width: "115px",
                    fontSize: windowWidth < 500 && ".58rem",
                  }}
                >
                  Date
                </TableCellTitle>
                <TableCellTitle
                  sx={{
                    width: "80px",
                    fontSize: windowWidth < 500 && ".58rem",
                  }}
                >
                  Total
                </TableCellTitle>
                <TableCellTitle
                  sx={{
                    width: "80px",
                    fontSize: windowWidth < 500 && ".58rem",
                  }}
                >
                  Products
                </TableCellTitle>
                <TableCellTitle
                  sx={{
                    width: "110px",
                    fontSize: windowWidth < 500 && ".58rem",
                  }}
                >
                  Buyer Details
                </TableCellTitle>
                <TableCellTitle
                  sx={{
                    width: "110px",
                    fontSize: windowWidth < 500 && ".58rem",
                  }}
                >
                  Shipping
                </TableCellTitle>
              </TableRow>
            </TableHead>
            <TableBody>
              {myOrders
                .filter((order) => order.items && order.items.length > 0) // Filter out orders with empty items
                .sort((a, b) => b.date.seconds - a.date.seconds) // Sort by date in descending order
                .map((order) => (
                  <TableRow
                    key={order.id}
                    sx={{
                      backgroundColor: isActive[order.id]
                        ? "#bac7e14a"
                        : "transparent",
                    }}
                  >
                    <TableCellData
                      sx={{ fontSize: windowWidth < 500 && ".68rem" }}
                    >
                      {order.id}
                    </TableCellData>
                    <TableCellData
                      sx={{
                        minWidth: "70px",
                        fontSize: windowWidth < 500 && ".68rem",
                      }}
                    >
                      {formatDate(order.date.seconds)}
                    </TableCellData>
                    <TableCellData
                      sx={{
                        minWidth: "70px",
                        fontSize: windowWidth < 500 && ".68rem",
                      }}
                    >
                      $ {order.total.toFixed(2)}
                    </TableCellData>
                    <TableCellData
                      onClick={() => handleOpenProducts(order.id)}
                      sx={{
                        minWidth: "70px",
                        fontSize: windowWidth < 500 && ".68rem",
                      }}
                    >
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
                    <TableCellData onClick={() => handleOpenDetails(order.id)}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: windowWidth < 560 && "column",
                          justifyContent: "center",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            textTransform: "uppercase",
                            fontSize: windowWidth < 500 ? ".48rem" : ".69rem",
                            paddingRight: windowWidth > 600 && "6px",
                            maxWidth: windowWidth < 700 && "95px",
                            minWidth: windowWidth > 700 && "110px",
                          }}
                        >
                          <span>{order?.buyer?.name}</span>
                          <span>{order?.buyer?.lastName}</span>
                        </div>

                        <span
                          style={{
                            width: windowWidth < 500 ? "25%" : "35px",
                            paddingRight: windowWidth < 500 ? "0" : "6px",
                            cursor: "pointer",
                          }}
                        >
                          <TopicOutlinedIcon
                            sx={{
                              fontSize: windowWidth < 700 ? "1.1rem" : "1.5rem",
                            }}
                          />
                        </span>
                      </div>
                    </TableCellData>
                    <TableCellData>
                      <MaterialUISwitch
                        checked={isActive[order.id] || false}
                        disabled={isActive[order.id]}
                        onChange={() => handleToggle(order.id)}
                      />
                    </TableCellData>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableOrderContainer>
        <Modal
          sx={{ maxWidth: "1000px", margin: "0 auto" }}
          open={openProducts}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{ ...style, width: windowWidth > 600 ? "80%" : "100%" }}>
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
          <Box sx={{ ...style, width: windowWidth > 600 ? "70%" : "95%" }}>
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

const Loader = styled.div`
  width: 100%;
  border-bottom-right-radius: 5px;
  border-top-right-radius: 7px;
  padding-right: 209px;
  box-shadow: rgba(0, 0, 0, 0.45) 2px 0px 6px;
  grid-column: 2/7;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 1100px) {
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px;
    display: flex;
    justify-content: center;
    padding: 150px 0;
  }
`;

const OrdersWrapper = styled.div`
  grid-column: 2/7;
  margin: 0 10px 0 0;
  overflow-x: auto;
  width: 100%;
  height: 100%;
  box-shadow: rgba(0, 0, 0, 0.45) 2px 0px 6px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;

  @media (max-width: 1100px) {
    width: 100%;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    box-shadow: rgba(0, 0, 0, 0) 0 0 0;
    height: 950px;
    margin-bottom: 20px;
  }
  @media (max-width: 550px) {
    height: 660px;
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
const TableOrderContainer = styled(TableContainer)`
  background-color: #fff;
  color: rgba(0, 0, 0, 0.87);
  width: 100%;
  overflow-x: auto;
  box-shadow: none !important;
  border-radius: none !important;
`;
const TableCellTitle = styled(TableCell)`
  padding: 16px 8px !important;
  text-align: center !important;
  border-bottom: 2px solid lightgrey !important;
  border-left: 1px solid lightgrey;
  border-right: 2px solid lightgrey;
  font-size: 0.975rem;
  font-weight: 600 !important;
`;
const TableCellData = styled(TableCell)`
  padding: 18px 4px !important;
  text-align: center !important;
  border-bottom: 1px solid #b7b4b4 !important;
  border-left: 1px solid lightgrey !important;
  border-right: 1px solid lightgrey !important;
`;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  border: "none!important",
  outline: "0",
};

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: "90px!important",
  overflow: "initial!important",
  height: "40px!important",
  position: "relative",

  "&:hover .MuiSwitch-thumb": {
    boxShadow: "-1px 1px 8px rgba(0, 0, 0, 0.5)",
  },

  "& .MuiSwitch-switchBase": {
    padding: 0,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    position: "absolute",

    "& .MuiSwitch-input": {
      width: "100%",
      height: "100%",
      top: 0,
      left: 0,
      opacity: 0,
      position: "absolute",
    },

    "&.Mui-checked": {
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "rgb(201 199 199 / 40%)",
      },
    },
    "&.MuiSwitch-switchBase:hover": {
      backgroundColor: "transparent",
    },
  },

  "& .MuiSwitch-thumb": {
    backgroundColor: "#ffffff",
    width: 34,
    height: 32,
    borderRadius: "50%",
    position: "absolute",
    left: 12,
    top: 4,
    boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
    border: "1px solid darkgrey",
    transition: "box-shadow 0.2s ease-in-out, transform 0.3s ease",
  },

  "& .Mui-checked .MuiSwitch-thumb": {
    transform: "translateX(16px)",
    boxShadow: "none",
    border: "1px solid darkgrey",
    transition: "box-shadow 0.2s ease-in-out, transform 0.3s ease",
  },

  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: "rgb(201 199 199)",
    borderRadius: 30,
  },
}));
