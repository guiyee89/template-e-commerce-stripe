import { useContext, useEffect, useState } from "react";
import { db } from "../../../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { AuthContext } from "../../../context/AuthContext";
import styled from "styled-components/macro";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import { useNavigate } from "react-router-dom";

export const UserOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { user, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const ordersCollection = collection(db, "orders");
    let filteredOrders = query(
      ordersCollection,
      where("email", "==", user.email)
    );

    getDocs(filteredOrders)
      .then((res) => {
        const newArray = res.docs.map((order) => {
          return {
            ...order.data(),
            id: order.id,
          };
        });
        setMyOrders(newArray);
      })
      .catch((error) => console.log(error));
  }, [user.email]);

  return (
    <>
      <LogoutBtn>
        <h4>Logout</h4>
        <LogoutSharpIcon
          sx={{ fontSize: "25px" }}
          onClick={() => handleLogout(navigate("/"))}
        />
      </LogoutBtn>
      <OrdersWrapper>
        <Title>Ordenes de compra</Title>
        <h2>Welcome user {user.email}</h2>
        {myOrders.map((order) => {
          return (
            <div key={order.id}>
              {order?.items?.map((product) => {
                return (
                  <div key={product.id}>
                    <h2>{product.title}</h2>
                    <h3>{product.quantity}</h3>
                  </div>
                );
              })}
              <h4>El total de la orden es {order.total}</h4>
            </div>
          );
        })}
      </OrdersWrapper>
    </>
  );
};
const OrdersWrapper = styled.div`
  margin-top: 50px;
`;
const Title = styled.h1``;
const LogoutBtn = styled.button`
  background-color: transparent;
  border: none;
  font-size: 0.65rem;
  width: 100%;
  text-align: right;
  margin: -25px 24px 0 0px;
`;
