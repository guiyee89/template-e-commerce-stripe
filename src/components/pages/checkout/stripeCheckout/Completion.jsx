import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components/macro";
import { serverTimestamp } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { Ring } from "@uiball/loaders";
import { CartContext } from "../../../context/CartContext";
import { useCustomerOrderEmail } from "../../../emails/buyOrders/useCustomerOrderEmail";
import { useOwnerOrderEmail } from "../../../emails/buyOrders/useOwnerOrderEmail";

export const Completion = () => {
  const { clearCart } = useContext(CartContext);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramValue = queryParams.get("redirect_status");
  const [orderId, setOrderId] = useState(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);

  useEffect(() => {
    setIsLoadingOrder(true);
    let order = JSON.parse(localStorage.getItem("order"));

    if (paramValue === "succeeded" && order && order.items) {
      let ordersCollection = collection(db, "orders");
      
      // Add the order to the "orders" collection
      addDoc(ordersCollection, { ...order, date: serverTimestamp() })
        .then(async (res) => {
          const orderRef = doc(db, "orders", res.id);

          setOrderId(res.id);
          // Send emails to the customer and owner
          await useCustomerOrderEmail(order, res.id);
          await useOwnerOrderEmail(order, res.id);

          // Update the order document with "shipped: false"
          await updateDoc(orderRef, {
            shipped: false,
          });

          // Update stock for each product
          order.items.forEach(async (product) => {
            const productRef = doc(db, "products", product.id);
            await updateDoc(productRef, {
              stock: product.stock - product.quantity,
            });
          });
        })
        .catch((error) => {
          console.error("Error adding order:", error);
        });

      // Clear cart and remove order from localStorage
      localStorage.removeItem("order", order.id);
      clearCart();
      console.log("Order added successfully:", order);
    }

    setTimeout(() => {
      setIsLoadingOrder(false);
    }, 2000);
  }, [paramValue]);
  // useEffect(() => {
  //   setIsLoadingOrder(true);
  //   let order = JSON.parse(localStorage.getItem("order"));

  //   if (paramValue === "succeeded" && order && order.items) {
  //     let ordersCollection = collection(db, "orders");
  //     addDoc(ordersCollection, {
  //       ...order,
  //       date: serverTimestamp(),
  //       shipped: false,
  //     }).then(async (res) => {
  //       setOrderId(res.id);
  //       await useCustomerOrderEmail(order, res.id);
  //       await useOwnerOrderEmail(order, res.id);
  //     });

  //     order.items.forEach((product) => {
  //       updateDoc(doc(db, "products", product.id), {
  //         stock: product.stock - product.quantity,
  //       });
  //     });

  //     localStorage.removeItem("order", order.id);
  //     clearCart();
  //     console.log("Order added successfully:", order);
  //   }
  //   setTimeout(() => {
  //     setIsLoadingOrder(false);
  //   }, 2000);
  // }, [paramValue]);

  if (isLoadingOrder) {
    return (
      <LoaderWrapper>
        <Ring size={30} lineWeight={6} speed={1} color="black" />
      </LoaderWrapper>
    );
  }

  return (
    <Wrapper>
      {orderId && (
        <>
          <h1 style={{ fontSize: "1.7rem", fontWeight: "bold" }}>
            Your purchase was successful.
          </h1>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
            We have sent you an email with your order details
          </h2>
          <h3 style={{ fontWeight: "500" }}>
            The ORDER ID is:{" "}
            <span style={{ fontWeight: "bold" }}> {orderId}</span>{" "}
          </h3>
          <Link to="/all-products">Continue Shopping</Link>
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  text-align: center;
  margin: 0 0 200px 0px;
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 200px;
  /* min-height: 550px; */
`;
