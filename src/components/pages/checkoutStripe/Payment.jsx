import { useState, useEffect } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentElementCheckout } from "./PaymentElementCheckout";
import { Elements } from "@stripe/react-stripe-js";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

export const Payment = () => {
  const { cart, getTotalPrice, clearCart } = useContext(CartContext);
  const [publishableKey, setPublishableKey] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get("http://localhost:3000/config");
        const { publishableKey } = response.data;
        setPublishableKey(publishableKey);
        setStripePromise(loadStripe(publishableKey));
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };

    fetchConfig();
  }, []);

  useEffect(() => {}, [publishableKey]);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const total = getTotalPrice(); 

        const response = await axios.post(
          "http://localhost:3000/create-payment-intent",
          {
            amount: total * 100, // Send the total amount in the request body
          }
        );

        const { clientSecret } = response.data;
        setClientSecret(clientSecret);
        
      } catch (error) {
        console.error("Error fetching payment intent:", error);
      }
    };

    fetchPaymentIntent();
  }, []);

  return (
    <div>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentElementCheckout />
        </Elements>
      )}
    </div>
  );
};
