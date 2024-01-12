import styled from "styled-components/macro";
import { CardElement, useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { CartContext } from "../../context/CartContext";
import { useContext } from "react";
import axios from "axios";
import { useState } from "react";
import { GlobalToolsContext } from "../../context/GlobalToolsContext";
import { Ring } from "@uiball/loaders";
import { useEffect } from "react";


export const CardElement = ({ clientSecret }) => {
  const { cart, getTotalPrice, clearCart } = useContext(CartContext);
  const { windowWidth, scroll } = useContext(GlobalToolsContext);
  const total = getTotalPrice();
  const stripe = useStripe();
  let elements = useElements();
  const [payment, setPayment] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    setPayment(true);

    if (!error) {
      const { id } = paymentMethod;
      console.log(paymentMethod);

      try {
        const { data } = await axios.post(
          "http://localhost:3001/api/checkout",
          {
            paymentMethodId: id, // Use paymentMethodId instead of id
            amount: total * 100,
            clientSecret,
          }
        );
        console.log(data);

        elements.getElement(CardElement).clear();
      } catch (error) {
        console.log(error);
      }

      setPayment(false);
    }
  };

  useEffect(() => {
    // You can use this useEffect to apply additional styling or configurations
    // based on the appearance theme and labels options.
    // For example, you can dynamically update styles based on windowWidth or other conditions.
  }, [windowWidth]);

  return (

    <>
      <FormContainer>
        <FormCard>
          <Form onSubmit={handleSubmit}>
            <ProductContainer>
              {cart.map((product) => (
                <div key={product.id}>
                  <Images
                    src={product.img[0]}
                    alt={`Product: ${product.name}`}
                  />
                  <p>{product.title}</p>
                </div>
              ))}
            </ProductContainer>
            <p>$ {total}</p>
            <StripeCardBtn>
         
              <CardElement />
            </StripeCardBtn>
            <BuyBtn type="submit" disabled={!stripe}>
              {payment ? (
                <LoaderOverlay
                  window={windowWidth}
                  scrolled={scroll}
                  style={{ top: windowWidth < 900 && "0px" }}
                >
                  <Ring size={35} lineWeight={7} speed={1} color="black" />
                </LoaderOverlay>
              ) : (
                "Buy"
              )}
            </BuyBtn>
          </Form>
        </FormCard>
      </FormContainer>
    </>
  );
};
const FormContainer = styled.div`
  width: 100%;
`;
const FormCard = styled.div`
  width: 50%;
  margin: 0 auto;
`;
const Form = styled.form`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  gap: 3rem;
  flex-direction: column;
  border: 1px solid lightgray;
  padding: 20px;
`;
const ProductContainer = styled.div`
  display: flex;
`;
const Images = styled.img`
  width: 100px;
`;
const StripeCardBtn = styled.div`
  padding: 20px 8px;
  border: 1px solid lightgray;
  width: 90%;
`;
const BuyBtn = styled.button`
  width: 190px;
  height: 42px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 8px;
  background-color: black;
  color: white;
  margin-top: 24px;
`;
const LoaderOverlay = styled.div`
  position: fixed;
  top: ${(props) => (props.scrolled === "scrolled" ? "64px" : "90.2px")};
  transition: top
    ${(props) => (props.scrolled === "scrolled" ? "0.16s" : "0.16s")}
    ease-in-out;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2); /* Semi-transparent background */
  display: flex;
  justify-content: ${(props) => (props.window < 500 ? "flex-start" : "center")};
  align-items: center;
  padding-left: ${(props) => (props.window < 500 ? "80px" : "0")};
  z-index: 2; /* Higher z-index to cover other elements */
`;
