import styled from "styled-components/macro";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import { PaymentElement } from "@stripe/react-stripe-js";
import { CartContext } from "../../context/CartContext";
import { useContext } from "react";
import { Ring } from "@uiball/loaders";
import { GlobalToolsContext } from "../../context/GlobalToolsContext";

export const PaymentElementCheckout = () => {
  const { cart, getTotalPrice, getItemPrice, clearCart } =
    useContext(CartContext);
  const { windowWidth, scroll } = useContext(GlobalToolsContext);
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

  return (
    <>
      {isProcessing && (
        <LoaderOverlay
          window={windowWidth}
          scrolled={scroll}
          style={{ top: windowWidth < 900 && "0px" }}
        >
          <Ring size={35} lineWeight={7} speed={1} color="black" />
        </LoaderOverlay>
      )}
      <Form
        id="payment-form"
        onSubmit={handleSubmit}
        windowWidth={windowWidth}
        data-aos="zoom-out-up"
      >
        <CheckoutContainer windowWidth={windowWidth}>
          <CartInfoContainer windowWidth={windowWidth}>
            <Logo src="https://res.cloudinary.com/derdim3m6/image/upload/v1689771276/web%20access/samples%20for%20e-commerce/Logos/2023-07-14_09h48_23-removebg-preview_yq3phy.png" />
            <TitleTotalContainer>
              <Title>We Shop</Title>
              <Total>
                {windowWidth > 750 ? <h2>$ {total.toFixed(2)}</h2> : null}
              </Total>
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
          </CartInfoContainer>
          <StripeImg
            src="https://res.cloudinary.com/derdim3m6/image/upload/v1705075558/web%20access/samples%20for%20e-commerce/i8bd2slbkkqfzyrhuwh7.png"
            windowWidth={windowWidth}
          />
        </CheckoutContainer>
        <PaymentElementContainer windowWidth={windowWidth} data-aos="fade-left">
          <PaymentElement />
          <Button disabled={isProcessing} id="submit">
            <span id="button-text">
              {isProcessing
                ? "Processing ... "
                : windowWidth > 750
                ? "Pay"
                : `Pay $ ${total.toFixed(2)}`}
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
  flex-direction: ${(props) => (props.windowWidth > 750 ? "row" : "column")};
  justify-content: space-between;
`;
const CheckoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  -webkit-box-pack: justify;
  justify-content: space-between;
  width: ${(props) => (props.windowWidth > 750 ? "50%" : "100%")};
  padding-right: ${(props) => (props.windowWidth > 750 ? "24px" : "0")};
  margin: 0;
  position: relative;
`;

const CartInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${(props) => (props.windowWidth > 750 ? "-25px" : "0")};
  gap: 0.9rem;
  padding-left: ${(props) => (props.windowWidth > 750 ? "15px" : "0")};
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 52px;
    bottom: 0px;
    left: -7px;
    width: ${(props) => (props.windowWidth > 850 ? "2px" : "0")};
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
  height: ${(props) => (props.windowWidth > 750 ? "398px" : "168px")};
  border-bottom: 1px solid lightgray;
  padding-right: 10px;
`;
const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  height: ${(props) => (props.windowWidth < 750 ? "none" : "80px")};
`;
const ItemInfoWrapper = styled.div`
  display: flex;
`;
const ImgWrapper = styled.div`
  margin: 0 20px 0 0;
  width: ${(props) => (props.windowWidth < 750 ? "52px" : "60px")};
  height: 65px;
`;
const ItemImg = styled.img`
  object-fit: contain;
  border: 1px solid lightgrey;
`;
const ItemTitle = styled.h2`
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
  min-width: ${(props) => (props.windowWidth < 750 ? "85px" : "100px")};
`;
const BothPriceWrapper = styled.h4`
  display: flex;
  align-items: ${(props) =>
    props.windowWidth < 750 ? "flex-start" : "flex-end"};
  gap: 0.1rem;
  flex-direction: column-reverse;
  margin: -10px 5px 0 0;
`;
const DiscountPrice = styled.span`
  color: #a83737;
  font-weight: 600;
  font-size: clamp(0.82rem, 2vw, 0.94rem);
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
      ? "clamp(.72rem, 2vw, .85rem)"
      : "clamp(.82rem, 2vw, .94rem)"};
  font-style: italic;
  position: relative;
  display: flex;
  justify-content: ${(props) =>
    props.windowWidth < 750 ? "flex-start" : "flex-end"};
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
  width: ${(props) => (props.windowWidth > 750 ? "50%" : "100%")};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 6rem;
  margin-top: 25px;
  position: relative;
  padding-left: ${(props) => (props.windowWidth > 750 ? "24px" : "0")};
  &::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: ${(props) => (props.windowWidth > 750 ? "2px" : "0")};
    background: linear-gradient(rgba(0, 0, 0, 0.15) 50%, rgba(0, 0, 0, 0) 100%);
  }
`;
const StripeImg = styled.img`
  width: ${(props) =>
    props.windowWidth < 500 ? "35%" : props.windowWidth > 750 ? "35%" : "22%"};
  margin-top: 8px;
`;

const Button = styled.button`
  background-color: rgb(0 12 79);
  color: white;
  font-weight: 600;
  height: 42px;
  border-radius: 8px;
`;
const LoaderOverlay = styled.div`
  position: fixed;
  top: ${(props) => (props.scrolled === "scrolled" ? "64px" : "0.2px")};
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
