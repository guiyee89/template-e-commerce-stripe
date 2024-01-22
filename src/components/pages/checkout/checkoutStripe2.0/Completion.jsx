import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components/macro";
import { serverTimestamp } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { CartContext } from "../../../context/CartContext";

export const Completion = () => {
  const { clearCart } = useContext(CartContext);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramValue = queryParams.get("redirect_status");
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    // Guardamos la orden en Firebase
    let order = JSON.parse(localStorage.getItem("order"));

    if (paramValue === "succeeded" && order && order.items) {
      // Check if 'items' property exists
      let ordersCollection = collection(db, "orders");
      addDoc(ordersCollection, { ...order, date: serverTimestamp() }).then(
        (res) => setOrderId(res.id)
      );

      order.items.forEach((product) => {
        updateDoc(doc(db, "products", product.id), {
          stock: product.stock - product.quantity,
        });
      });
      localStorage.removeItem("order");
      clearCart();
      console.log("Order added successfully:", order);
    }
  }, [paramValue]);

  return (
    <>
      <Wrapper>
        {orderId && (
          <>
            <h1>
              Su compra fue exitosa. <br />
              El numero de comprobante es: {orderId}{" "}
            </h1>
            <Link to="/all-products">Seguir Comprando</Link>
          </>
        )}
      </Wrapper>
    </>
  );
};
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;
