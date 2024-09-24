import styled from "styled-components/macro";
import {
  useStripe,
  useElements,
  PaymentMethodMessagingElement,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { PaymentElement } from "@stripe/react-stripe-js";
import { useContext } from "react";
import { Ring } from "@uiball/loaders";
import { GlobalToolsContext } from "../../../context/GlobalToolsContext";
import { CartContext } from "../../../context/CartContext";
import { bouncy } from "ldrs";
import { PaymentSkeletonLoader } from "./PaymentSkeletonLoader";
import { useEffect } from "react";
bouncy.register();

export const PaymentElementCheckout = ({ shipmentCost }) => {
  const { cart, getTotalPrice, getItemPrice } = useContext(CartContext);
  const { windowWidth, scroll } = useContext(GlobalToolsContext);
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(true);
  const stripe = useStripe();
  const elements = useElements();
  const total = getTotalPrice();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCheckoutLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/completion`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage("Payment status:" + paymentIntent.status + ":D");
    } else {
      setMessage("Unexpected state");
    }

    setIsProcessing(false);
    setMessage(null);
  };

  if (isCheckoutLoading) {
    return <PaymentSkeletonLoader />;
  }
  return (
    <>
      {isProcessing && (
        <LoaderOverlay window={windowWidth} scrolled={scroll}>
          <Ring size={35} lineWeight={7} speed={1} color="black" />
        </LoaderOverlay>
      )}
      <Form
        id="payment-form"
        onSubmit={handleSubmit}
        windowWidth={windowWidth}
        // data-aos="zoom-out-up"
      >
        <CheckoutContainer windowWidth={windowWidth}>
          <CartInfoContainer windowWidth={windowWidth}>
            <div style={{ width: "100%" }}>
              <StripeImg
                src="https://res.cloudinary.com/derdim3m6/image/upload/v1705075558/web%20access/samples%20for%20e-commerce/i8bd2slbkkqfzyrhuwh7.png"
                windowWidth={windowWidth}
              />
            </div>
            <TitleTotalContainer>
              <Title>We Shop</Title>
            </TitleTotalContainer>
            <ItemsContainer windowWidth={windowWidth}>
              {cart.map((product) => {
                const itemPrice = getItemPrice(product.id); //Buscar item x id en la funcion getItemPrice
                const hasDiscount = product.discountPrice; //Variable de Item con descuento
                return (
                  <ItemWrapper key={product.id} windowWidth={windowWidth}>
                    <ItemInfoWrapper>
                      <ImgWrapper windowWidth={windowWidth}>
                        <ItemImg src={product.img[0]} alt="" />
                      </ImgWrapper>
                      <InsideContentWrapper>
                        <ItemTitle>{product.title}</ItemTitle>

                        <QuantityWrapper>
                          <ItemQuantity>x {product.quantity}</ItemQuantity>
                        </QuantityWrapper>
                      </InsideContentWrapper>
                    </ItemInfoWrapper>
                    <PriceWrapper windowWidth={windowWidth}>
                      {hasDiscount ? (
                        <BothPriceWrapper
                          hasDiscount={hasDiscount}
                          windowWidth={windowWidth}
                        >
                          {hasDiscount && (
                            <DiscountPrice windowWidth={windowWidth}>
                              ${" "}
                              {(
                                product.discountPrice * product.quantity
                              ).toFixed(2)}
                            </DiscountPrice>
                          )}
                          <Price
                            hasDiscount={hasDiscount}
                            windowWidth={windowWidth}
                          >
                            $ {itemPrice.toFixed(2)}
                          </Price>
                        </BothPriceWrapper>
                      ) : (
                        <Price windowWidth={windowWidth}>
                          $ {itemPrice.toFixed(2)}
                        </Price>
                      )}
                    </PriceWrapper>
                  </ItemWrapper>
                );
              })}
            </ItemsContainer>
            <p
              style={{
                margin: "0 0 20px 0",
                fontSize: "0.75rem",
                fontWeight: "500",
                textAlign: "right",
              }}
            >
              Shipping cost:{" "}
              <span style={{ fontWeight: "600" }}>
                $ {shipmentCost.toFixed(2)}
              </span>
            </p>
            <PaymentMethodMessagingElement
              options={{
                amount: (total + shipmentCost) * 100,
                currency: "USD",
                paymentMethodTypes: ["klarna", "afterpay_clearpay", "affirm"],
                countryCode: "US",
              }}
            />
          </CartInfoContainer>
        </CheckoutContainer>
        <PaymentElementContainer
          windowWidth={windowWidth} /* data-aos="fade-left" */
        >
          <div style={{ minHeight: "300px" }}>
            <PaymentElement />
          </div>
          <Button disabled={isProcessing} id="submit">
            <span id="button-text">
              {isProcessing ? (
                <BouncyLoader>
                  <p
                    style={{
                      marginRight: "22px",
                      marginLeft: " 22px ",
                    }}
                  >
                    Processing
                  </p>
                  <l-bouncy size="20" speed="1.2" color="black"></l-bouncy>
                </BouncyLoader>
              ) : windowWidth > 750 ? (
                `Pay $ ${(total + shipmentCost).toFixed(2)}`
              ) : (
                `Pay $ ${(total + shipmentCost).toFixed(2)}`
              )}
            </span>
          </Button>
        </PaymentElementContainer>

        {message && <div id="payment-message">{message}</div>}
      </Form>
    </>
  );
};
const Form = styled.form`
  display: flex;
  flex-direction: ${(props) => (props.windowWidth > 750 ? "column" : "column")};
  justify-content: space-between;
  margin-bottom: 40px;
  padding: 40px 70px 30px;
  @media (max-width: 551px) {
    padding: 20px;
  }
`;
const CheckoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  -webkit-box-pack: justify;
  justify-content: space-between;
  height: auto;
  width: ${(props) => (props.windowWidth > 750 ? "100%" : "100%")};
  padding-right: ${(props) => (props.windowWidth > 750 ? "0" : "0")};
  margin: 0 0 10px;
  @media (max-width: 750px) {
    height: auto;
  }
`;

const CartInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${(props) => (props.windowWidth > 750 ? "0" : "0")};
  padding-left: ${(props) => (props.windowWidth > 750 ? "0" : "0")};
  gap: 0.9rem;
  position: relative;
  @media (max-width: 750px) {
    margin-bottom: 20px;
  }
  &::before {
    content: "";
    position: absolute;
    top: 52px;
    bottom: 0px;
    left: -7px;
    width: ${(props) => (props.windowWidth > 850 ? "0" : "0")};
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.15) 0%,
      rgba(0, 0, 0, 0) 100%
    );
  }
`;
const TitleTotalContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Logo = styled.img`
  width: 10%;
  margin-top: -10px;
  margin-bottom: 10px;
`;
const Title = styled.h1`
  margin-top: 10px;
  font-weight: 600;
  color: grey;
`;
const Total = styled.h2`
  font-weight: 900;
  font-size: 1.5rem;
`;
const ItemsContainer = styled.div`
  overflow-y: auto;
  height: ${(props) => (props.windowWidth > 750 ? "auto" : "auto")};
  max-height: 260px;
  padding-right: ${(props) => (props.windowWidth < 1100 ? "10px" : "10px")};
  ::-webkit-scrollbar {
    width: 7px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 5px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
  ::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }
  @media (max-width: 750px) {
    border-bottom: 1px solid grey;
    max-height: 168px;
  }
`;
const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  height: ${(props) => (props.windowWidth < 750 ? "80px" : "80px")};
`;
const ItemInfoWrapper = styled.div`
  display: flex;
`;
const ImgWrapper = styled.div`
  margin: 0 20px 0 0;
  width: 70px;
  height: 70px;
`;
const ItemImg = styled.img`
  object-fit: cover;
  border: 1px solid lightgrey;
  width: 100%;
  height: 100%;
`;
const ItemTitle = styled.h2`
  text-transform: capitalize;
  padding-bottom: 2px;
  font-size: clamp(0.65rem, 1.5vw, 1rem);
`;
const QuantityWrapper = styled.div``;
const ItemQuantity = styled.h4`
  font-weight: 600;
  font-size: 0.75rem;
`;
const InsideContentWrapper = styled.div`
  width: auto;
  padding: 12px 0px 0 0;
  height: 100%;
  @media (max-width: 500px) {
    width: 120px;
  }
`;
const PriceWrapper = styled.div`
  height: 50%;
  min-width: ${(props) => (props.windowWidth < 750 ? "100px" : "100px")};
`;
const BothPriceWrapper = styled.h4`
  display: flex;
  align-items: flex-end;
  gap: 0.1rem;
  flex-direction: column-reverse;
  margin: -10px 5px 0 0;
`;
const DiscountPrice = styled.span`
  color: #a83737;
  font-weight: 600;
  font-size: clamp(0.82rem, 0.8vw + 0.5rem, 0.94rem);
  font-style: italic;
  position: relative;
  display: inline-block;
  text-align: center;
`;
const Price = styled.span`
  margin: ${(props) => (props.hasDiscount ? "16px 0 0 0;" : "16px 5px 0 0")};
  font-weight: 600;
  font-size: ${(props) =>
    props.hasDiscount
      ? "clamp(.72rem, 0.8vw + 0.5rem, .85rem)"
      : "clamp(0.82rem, 0.8vw + 0.5rem, 0.94rem);"};
  font-style: italic;
  position: relative;
  display: flex;
  justify-content: flex-end;
  color: ${(props) => (props.hasDiscount ? "rgb(149 146 146)" : "#a83737")};
  /* Add the following styles to create the strike-through line if hasDiscount is true */
  &::after {
    content: ${(props) => (props.hasDiscount ? "''" : "none")};
    position: absolute;
    bottom: 52%;
    left: 0;
    width: 102%;
    height: 1px;
    background-color: black;
  }
`;

const PaymentElementContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 6rem;
  margin-top: 25px;
  position: relative;
  width: ${(props) => (props.windowWidth > 750 ? "100%" : "100%")};
  padding-left: ${(props) => (props.windowWidth > 750 ? "0" : "0")};
  padding-right: ${(props) => (props.windowWidth > 750 ? "0" : "0")};
  justify-content: space-between;
  &::before {
    content: "";
    position: absolute;
    top: -41px;
    bottom: 0px;
    left: 0px;
    height: 110%;
    width: 2px;
    background: linear-gradient(rgba(0, 0, 0, 0.15) 64%, rgba(0, 0, 0, 0) 100%);
    width: ${(props) => (props.windowWidth > 750 ? "0" : "0")};
  }
  &::after {
    content: "";
    position: absolute;
    top: 0px;
    bottom: 0px;
    right: 0px;
    width: ${(props) => (props.windowWidth > 850 ? "0" : "0")};
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.15) 0%,
      rgba(0, 0, 0, 0) 100%
    );
  }
`;
const StripeImg = styled.img`
  width: ${(props) =>
    props.windowWidth < 500 ? "35%" : props.windowWidth > 750 ? "22%" : "22%"};
  margin: -22px 0 0 -32px;
  @media (max-width: 750px) {
    margin: -7px 0px 0px -15px;
  }
`;

const Button = styled.button`
  background-color: rgb(20, 20, 20);
  color: white;
  font-weight: 600;
  height: 46px;
  margin: -66px auto 15px;
  border: none;
  border-radius: 4px;
  width: 99%;
  :hover {
    box-shadow: rgba(0, 0, 0, 2.45) 0px 0px 10px;
  }
  @media (max-width: 750px) {
    margin: -45px auto 15px;
  }
`;
const LoaderOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2); /* Semi-transparent background */
  display: flex;
  justify-content: ${(props) =>
    props.windowWidth < 500 ? "center" : "center"};
  padding-left: ${(props) => (props.windowWidth < 500 ? "0" : "0")};
  align-items: center;
  z-index: 2;
`;
const BouncyLoader = styled.div`
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  align-items: center;
`;
