import styled from "styled-components/macro";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useState } from "react";
import { PaymentElement } from "@stripe/react-stripe-js";
import { CartContext } from "../../context/CartContext";
import { useContext } from "react";

export const PaymentElementCheckout = () => {
  const { cart, getTotalPrice, clearCart } = useContext(CartContext);
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const total = getTotalPrice();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      amount: total,
      confirmParams: {
        return_url: `${window.location.origin}/completion`,
      },
      /* redirect: "if_required", */
    });
    if (error) {
      setMessage(error.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage("Payment status:" + paymentIntent.status + ":D");
    } else {
      setMessage("Unexpected state");
    }
    setIsProcessing(false);
  };

  return (
    <>
      <form id="payment-form" onSubmit={handleSubmit}>
        <h2>The total amount is: {total}</h2>
        <PaymentElement />
        <button disabled={isProcessing} id="submit">
          <span id="button-text">
            {isProcessing ? "Processing ... " : "Pay Now"}
          </span>
        </button>

        {message && <div id="payment-message">{message}</div>}
      </form>
    </>
  );
};
