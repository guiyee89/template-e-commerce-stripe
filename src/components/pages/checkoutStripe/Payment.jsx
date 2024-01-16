import styled from "styled-components/macro";
import { useState, useEffect } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentElementCheckout } from "./PaymentElementCheckout";
import { Elements } from "@stripe/react-stripe-js";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { Ring } from "@uiball/loaders";
import AOS from "aos";
import "aos/dist/aos.css";

export const Payment = () => {
  const { cart, getTotalPrice, clearCart } = useContext(CartContext);
  const [publishableKey, setPublishableKey] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [isFormLoading, setIsFormLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get("https://e-commerce-stripe-payment-element-1-dvobafole-guiyee89.vercel.app/config");
        const { publishableKey } = response.data;
        setPublishableKey(publishableKey);
        setStripePromise(loadStripe(publishableKey));
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };

    fetchConfig();
  }, []);

  //Publishable Key
  useEffect(() => {}, [publishableKey]);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      const total = getTotalPrice();
      try {
        const response = await axios.post(
          "https://e-commerce-stripe-payment-element-1-dvobafole-guiyee89.vercel.app/create-payment-intent",
          {
            items: cart,
            amount: total * 100,
          }
        );

        const { clientSecret } = response.data;
        setTimeout(() => {
          setClientSecret(clientSecret);
          setIsFormLoading(false);
        }, 2000);
      } catch (error) {
        console.error("Error fetching payment intent:", error);
      }
    };

    fetchPaymentIntent();
  }, [cart]);

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div>
      {stripePromise && clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret }}
          onReady={() => setIsFormLoading(false)}
        >
          <PaymentElementCheckout />
        </Elements>
      )}
      {isFormLoading && (
        <RingLoader>
          <Ring size={35} lineWeight={7} speed={1} color="black" />
        </RingLoader>
      )}
    </div>
  );
};
const RingLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 120px;
`;
