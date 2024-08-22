import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components/macro";
import { serverTimestamp } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { Ring } from "@uiball/loaders";
import { CartContext } from "../../../context/CartContext";
import { sendPurchaseOrderEmail } from "../../../../firebaseEmailConfig";

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
      addDoc(ordersCollection, { ...order, date: serverTimestamp() }).then(
        async (res) => {
          setOrderId(res.id);
          await handleSendEmail(order, res.id);
        }
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
    setTimeout(() => {
      setIsLoadingOrder(false);
    }, 2000);
  }, [paramValue]);

  const handleSendEmail = async (order, orderId) => {
    const email = order.buyer.email;
    const subject = "Order Confirmation";
    const body = `
    <div style="width:100%;">
      <table role="presentation" width="100%" style="border-spacing: 0; margin: 0 auto; padding: 0; >
        <tr>
          <td align="center">
            <table role="presentation" style="width:100%; max-width: 600px; margin: 0 auto; padding: 20px; text-align: left; border:1px solid lightgray">
              <tr>
                <td>
  
                  <h1>Thank you for your purchase, <span style="text-transform:capitalize"> ${
                    order.buyer.name
                  }</span>!</h1>
                  <p>Your order has been confirmed. Below are the details:</p>
                  <p style="font-size: 1rem; margin-top: 35px; padding-right: 10px;">Order ID: <strong>${orderId}</strong></p>
  
                  <table role="presentation" style="width: 100%; margin: 50px 0; border-spacing: 0 10px;">
                    <thead>
                      <tr style="padding-bottom: 10px;">
                        <th style="width:70px; text-align: center"></th>
                        <th style="width:70px; text-align: center">Item</th>
                        <th style="width:70px; text-align: center">Quantity</th>
                        <th style="width:70px; text-align: center">Color</th>
                        <th style="width:70px; text-align: center">Size</th>
                        <th style="width:70px; text-align: center">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${order.items
                        .map(
                          (item) => `
                        <tr style="margin-bottom: 10px;">
                          <td><img src="${item.img[0]}" alt="${
                            item.title
                          }" style="width:90%; height:auto; margin-right:10px;"/></td>
                          <td style="text-align: center; text-transform: capitalize;">${
                            item.title
                          }</td>
                          <td style="text-align: center; text-transform: capitalize;">${
                            item.quantity
                          }</td>
                          <td style="text-align: center; text-transform: capitalize;">${
                            item.color[0]
                          }</td>
                          <td style="text-align: center; text-transform: capitalize;">${
                            item.size
                          }</td>
                          <td style="text-align: center; text-transform: capitalize;">$ ${(item.discountPrice
                            ? item.discountPrice
                            : item.unit_price
                          ).toFixed(2)}</td>
                        </tr>
                        `
                        )
                        .join("")}
                    </tbody>
                  </table>
  
                  <p style="font-size:1rem">Shipping: <strong>$ ${order.shipment_cost.toFixed(
                    2
                  )}</strong></p>
                  <p style="font-size:1.1rem; font-weight:600">Total:<strong style="padding-left:23px">$ ${order.total.toFixed(
                    2
                  )}</strong></p>
                  <p>We hope to see you again soon!</p>
  
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;

    await sendPurchaseOrderEmail(email, subject, body);
  };

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
