import { useState, useEffect } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useContext } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { PaymentElementCheckout } from "./PaymentElementCheckout";
import { CartContext } from "../../../context/CartContext";

////////////////////////////////////////////////////////////////////////////////////////////////////////
export const Payment = ({ shipmentCost }) => {
  const { cart, getTotalPrice } = useContext(CartContext);
  const [publishableKey, setPublishableKey] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [isFormLoading, setIsFormLoading] = useState(true);
  const total = getTotalPrice();

  /////////////////////////////////////////////////////////////
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get(
          "https://template-ecommerce-stripe-hosted-page-1-backend.vercel.app/config"
          //"http://localhost:3000/config"
        );
        const { publishableKey } = response.data;
        setTimeout(() => {
          setPublishableKey(publishableKey);
          setStripePromise(loadStripe(publishableKey));
        }, 400);
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
      try {
        const response = await axios.post(
          "https://template-ecommerce-stripe-hosted-page-1-backend.vercel.app/create-payment-intent",
          //"http://localhost:3000/create-payment-intent",
          {
            items: cart,
            amount: (total + shipmentCost) * 100,
          }
        );

        const { clientSecret } = response.data;
        setTimeout(() => {
          setClientSecret(clientSecret);
          setIsFormLoading(false);
        }, 400);
      } catch (error) {
        console.error("Error fetching payment intent:", error);
      }
    };

    fetchPaymentIntent();
  }, [cart]);

  useEffect(() => {
    AOS.init();
  }, []);

  ////////////////////////////////////////////////////////////////
  return (
    <div>
      {stripePromise && clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret, locale: "en" }}
          onReady={() => setIsFormLoading(false)}
        >
          <PaymentElementCheckout shipmentCost={shipmentCost} />
        </Elements>
      )}
    </div>
  );
};
